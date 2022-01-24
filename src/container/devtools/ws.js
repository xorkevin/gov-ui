import {Fragment, useState, useReducer, useCallback, useRef} from 'react';
import {useURL} from '@xorkevin/substation';
import {useRelogin} from '@xorkevin/turbine';
import {
  Table,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  ButtonGroup,
  Chip,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {useWSValue, useWS, useWSSub} from '../../component/ws';

const selectAPIEcho = (api) => api.ws.echo;

const WS_CHANNEL = 'echo';

const Formatter = () => {
  if (Intl && Intl.DateTimeFormat) {
    return new Intl.DateTimeFormat([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      timeZoneName: 'short',
    });
  }
  return {
    format: (date) => {
      return date.toString();
    },
  };
};

const timeFormatter = Formatter();

const parseJSON = (s) => {
  try {
    return JSON.parse(s);
  } catch (_err) {
    return {};
  }
};

const MsgRow = ({timems, kind, data}) => {
  const isMsg = kind === 'msg';
  const log = !isMsg ? data : '';
  const {channel, value} = isMsg ? parseJSON(data) : {};
  return (
    <tr>
      <td>{timeFormatter.format(timems)}</td>
      <td>{kind}</td>
      <td>{log}</td>
      <td>{channel}</td>
      <td>{value}</td>
    </tr>
  );
};

const MSG_APPEND = Symbol('MSG_APPEND');

const MsgAppend = (kind, data) => ({
  type: MSG_APPEND,
  timems: Date.now(),
  kind,
  data,
});

const msgsReducer = (state, action) => {
  switch (action.type) {
    case MSG_APPEND: {
      const msgs = state.msgs;
      const {timems, kind, data} = action;
      msgs.push({timems, kind, data});
      return Object.assign({}, state, {
        msgs,
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

  const [msgs, dispatchMsgs] = useReducer(msgsReducer, {
    msgs: [],
  });

  const [shouldConnect, setShouldConnect] = useState(true);
  const toggleShouldConnect = useCallback(() => {
    setShouldConnect((i) => !i);
  }, [setShouldConnect]);

  const url = useURL(selectAPIEcho);

  const relogin = useRelogin();
  const prehookWS = useCallback(async () => {
    const [_data, _res, err] = await relogin();
    return err;
  }, [relogin]);
  const ws = useWS('devtools:ws', shouldConnect ? url : null, {
    prehook: prehookWS,
    errhook: displayErrSnack,
  });

  const onopenWS = useCallback(() => {
    dispatchMsgs(MsgAppend('open', 'connection opened'));
  }, [dispatchMsgs]);
  const onmessageWS = useCallback(
    (e) => {
      dispatchMsgs(MsgAppend('msg', e.data));
    },
    [dispatchMsgs],
  );
  const onerrorWS = useCallback(() => {
    dispatchMsgs(MsgAppend('error', 'connection error'));
  }, [dispatchMsgs]);
  const oncloseWS = useCallback(
    (e) => {
      dispatchMsgs(
        MsgAppend(
          'close',
          `connection closed: ${e.code} ${e.reason} ${e.wasClean}`,
        ),
      );
    },
    [dispatchMsgs],
  );
  useWSSub(ws.sub, {
    onopen: onopenWS,
    onmessage: onmessageWS,
    onerror: onerrorWS,
    onclose: oncloseWS,
  });

  const form = useForm({
    data: '',
  });

  const formVal = useRef(form.state.data);
  formVal.current = form.state.data;
  const formAssign = form.assign;
  const send = useCallback(() => {
    if (!formVal.current) {
      return;
    }
    ws.sendChan(WS_CHANNEL, formVal.current);
    formAssign({
      data: '',
    });
  }, [ws, formAssign, formVal]);

  const {open} = useWSValue('devtools:ws');

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
      <div>
        <Chip>{open ? 'OPEN' : 'CLOSED'}</Chip>
      </div>
      <Table
        head={
          <Fragment>
            <th>Time</th>
            <th>Kind</th>
            <th>Log</th>
            <th>Channel</th>
            <th>Value</th>
          </Fragment>
        }
      >
        {msgs.msgs.map(({timems, kind, data}) => (
          <MsgRow
            key={`${timems}:${kind}`}
            timems={timems}
            kind={kind}
            data={data}
          />
        ))}
      </Table>
    </div>
  );
};

export default WSEchoContainer;
