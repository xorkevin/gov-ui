import {useState, useReducer, useEffect, useCallback, useRef} from 'react';
import {useURL} from '@xorkevin/substation';
import {useRelogin} from '@xorkevin/turbine';
import {
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {randomID} from '../../utility';

const selectAPIEcho = (api) => api.ws.echo;

const WS_PROTOCOL = 'xorkevin.dev/governor/ws/v1alpha1';

const WS_CHANNEL = 'echo';

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const MSG_APPEND = Symbol('MSG_APPEND');
const MSG_READY_STATE = Symbol('MSG_READY_STATE');

const STATE_LOADING = Symbol('LOADING');
const STATE_OPEN = Symbol('OPEN');
const STATE_CLOSED = Symbol('CLOSED');

const MsgAppend = (readyState, id, kind, data) => ({
  type: MSG_APPEND,
  readyState,
  timems: Date.now(),
  id,
  kind,
  data,
});

const MsgReadyState = (readyState) => ({
  type: MSG_READY_STATE,
  readyState,
});

const msgsReducer = (state, action) => {
  switch (action.type) {
    case MSG_APPEND: {
      const msgs = state.msgs;
      const {readyState, timems, id, kind, data} = action;
      msgs.push({timems, id, kind, data});
      return Object.assign({}, state, {
        readyState,
        msgs,
      });
    }
    case MSG_READY_STATE: {
      const {readyState} = action;
      return Object.assign({}, state, {
        readyState,
      });
    }
    default:
      return state;
  }
};

const WSEchoContainer = () => {
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_res, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const ws = useRef(null);
  const [msgs, dispatchMsgs] = useReducer(msgsReducer, {
    readyState: STATE_CLOSED,
    msgs: [],
  });

  const relogin = useRelogin();
  const url = useURL(selectAPIEcho);

  const [shouldConnect, setShouldConnect] = useState(true);
  const toggleShouldConnect = useCallback(() => {
    setShouldConnect((i) => !i);
  }, [setShouldConnect]);

  useEffect(() => {
    const id = randomID();
    const controller = new AbortController();
    (async () => {
      if (!shouldConnect) {
        if (!controller.signal.aborted) {
          dispatchMsgs(
            MsgAppend(STATE_CLOSED, '', 'close', 'connection closed'),
          );
        }
        return;
      }
      while (true) {
        const [_data, res, err] = await relogin();
        if (controller.signal.aborted) {
          return;
        }
        if (err) {
          displayErrSnack(res, err);
          await sleep(5000);
          if (controller.signal.aborted) {
            return;
          }
          continue;
        }
        const socket = new WebSocket(url, WS_PROTOCOL);
        socket.onopen = () => {
          if (controller.signal.aborted) {
            return;
          }
          dispatchMsgs(MsgAppend(STATE_OPEN, id, 'open', 'connection opened'));
        };
        socket.onmessage = (e) => {
          if (controller.signal.aborted) {
            return;
          }
          dispatchMsgs(
            MsgAppend(
              STATE_OPEN,
              id,
              'msg',
              `${e.origin} ${e.lastEventId} ${e.data}`,
            ),
          );
        };
        socket.onerror = () => {
          if (controller.signal.aborted) {
            return;
          }
          dispatchMsgs(MsgAppend(STATE_OPEN, id, 'error', 'connection error'));
        };
        const socketClosed = new Promise((resolve) => {
          socket.onclose = (e) => {
            if (controller.signal.aborted) {
              resolve();
              return;
            }
            dispatchMsgs(
              MsgAppend(
                STATE_CLOSED,
                id,
                'close',
                `connection closed: ${e.code} ${e.reason} ${e.wasClean}`,
              ),
            );
            resolve();
          };
        });
        controller.signal.addEventListener('abort', () => {
          socket.close(1000, 'OK');
        });
        dispatchMsgs(MsgReadyState(STATE_LOADING));
        ws.current = socket;
        await socketClosed;
        if (controller.signal.aborted) {
          return;
        }
        await sleep(5000);
        if (controller.signal.aborted) {
          return;
        }
      }
    })();
    return () => {
      controller.abort();
    };
  }, [relogin, displayErrSnack, ws, dispatchMsgs, url, shouldConnect]);

  const form = useForm({
    data: '',
  });

  const formVal = useRef(form.data);
  formVal.current = form.state.data;
  const formAssign = form.assign;
  const sendMsg = useCallback(() => {
    if (!formVal.current) {
      return;
    }
    ws.current.send(
      JSON.stringify({
        channel: WS_CHANNEL,
        value: formVal.current,
      }),
    );
    formAssign({
      data: '',
    });
  }, [formAssign, formVal]);
  const notReady = useCallback(() => {
    displayErrSnack(null, {message: 'Not connected'});
  }, [displayErrSnack]);
  const send =
    shouldConnect && msgs.readyState === STATE_OPEN ? sendMsg : notReady;

  return (
    <div>
      <h3>Websocket echo tester</h3>
      <Form formState={form.state} onChange={form.update} onSubmit={send}>
        <Field name="data" label="Data" nohint fullWidth />
      </Form>
      <ButtonGroup>
        <ButtonPrimary onClick={send}>Send</ButtonPrimary>
        <ButtonTertiary onClick={toggleShouldConnect}>
          {shouldConnect ? 'Disconnect' : 'Connect'}
        </ButtonTertiary>
      </ButtonGroup>
      <pre>{msgs.readyState.description}</pre>
      <pre>{JSON.stringify(msgs.msgs, null, '  ')}</pre>
    </div>
  );
};

export default WSEchoContainer;
