import {
  createContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import {atomFamily, useRecoilValue, useSetRecoilState} from 'recoil';

import {sleep} from '../utility';

const WS_PROTOCOL = 'xorkevin.dev/governor/ws/v1alpha1';

const noop = Object.freeze(() => {});

const WSDefaultOpts = Object.freeze({
  name: '__DEFAULT__',
  send: noop,
  sub: noop,
});

const WSCtx = createContext(WSDefaultOpts);

const defaultWSState = Object.freeze({
  open: false,
});

const WSState = atomFamily({
  key: 'govui:ws_state',
  default: defaultWSState,
});

const WSProvider = ({value, children}) => {
  return <WSCtx.Provider value={value}>{children}</WSCtx.Provider>;
};

const useWSValue = (name) => {
  return useRecoilValue(WSState(name));
};

const useWSValueCtx = () => {
  const {name} = useContext(WSCtx);
  return useWSValue(name);
};

const registerHandlers = (socket, sub) => {
  if (!sub) {
    return;
  }
  const {onopen, onmessage, onerror, onclose, signal} = sub;
  if (onopen) {
    socket.addEventListener('open', onopen, {signal});
  }
  if (onmessage) {
    socket.addEventListener('message', onmessage, {signal});
  }
  if (onerror) {
    socket.addEventListener('error', onerror, {signal});
  }
  if (onclose) {
    socket.addEventListener('close', onclose, {signal});
  }
};

const useWS = (
  name,
  url,
  {delayMin, delayMax, delayExp, prehook, errhook} = {},
) => {
  const setWSState = useSetRecoilState(WSState(name));

  const ws = useRef({
    socket: null,
    open: false,
    loaded: false,
    subs: new Set(),
  });

  if (!url) {
    ws.current.open = false;
  }

  if (typeof delayMin !== 'number') {
    delayMin = 250;
  }
  if (typeof delayMax !== 'number') {
    delayMax = 15000;
  }
  if (typeof delayExp !== 'number') {
    delayExp = 2;
  }

  useEffect(() => {
    ws.current.open = false;
    ws.current.loaded = false;
    setWSState({open: false});
    if (!url) {
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      let delay = delayMin;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        ws.current.open = false;
        ws.current.loaded = false;
        setWSState({open: false});

        if (prehook) {
          const err = await prehook({signal});
          if (signal.aborted) {
            return;
          }
          if (err) {
            if (errhook) {
              errhook('prehook', err);
            }
            await sleep(delay);
            if (signal.aborted) {
              return;
            }
            delay = Math.min(delay * delayExp, delayMax);
            continue;
          }
        }

        const socket = new WebSocket(url, WS_PROTOCOL);
        const socketClosed = new Promise((resolve) => {
          socket.addEventListener('close', () => {
            if (signal.aborted) {
              resolve();
              return;
            }
            ws.current.open = false;
            ws.current.loaded = false;
            setWSState({open: false});
            resolve();
          });
        });
        socket.addEventListener('open', () => {
          if (signal.aborted) {
            return;
          }
          delay = delayMin;
          ws.current.open = true;
          setWSState({open: true});
        });
        const innerController = new AbortController();
        signal.addEventListener(
          'abort',
          () => {
            socket.close(1000, 'OK');
          },
          {signal: innerController.signal},
        );
        for (const sub of ws.current.subs.values()) {
          registerHandlers(socket, sub);
        }
        ws.current.socket = socket;
        ws.current.loaded = true;
        await socketClosed;
        if (signal.aborted) {
          return;
        }
        innerController.abort();
        await sleep(delay);
        if (signal.aborted) {
          return;
        }
        delay = Math.min(delay * delayExp, delayMax);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [setWSState, ws, url, delayMin, delayMax, delayExp, prehook, errhook]);

  const send = useCallback(
    (data) => {
      if (!ws.current.open) {
        errhook('send', {message: 'Not connected'});
        return;
      }
      ws.current.socket.send(data);
    },
    [ws, errhook],
  );

  const sub = useCallback(
    (f, signal) => {
      if (!f || signal.aborted) {
        return;
      }
      const sub = Object.assign({}, f, {signal});
      ws.current.subs.add(sub);
      signal.addEventListener('abort', () => {
        ws.current.subs.delete(sub);
      });
      if (ws.current.loaded) {
        registerHandlers(ws.current.socket, sub);
      }
    },
    [ws],
  );

  const res = useMemo(
    () => ({
      name,
      send,
      sub,
    }),
    [name, send, sub],
  );
  return res;
};

const useWSSub = (sub, {onopen, onmessage, onerror, onclose} = {}) => {
  useEffect(() => {
    const controller = new AbortController();
    sub({onopen, onmessage, onerror, onclose}, controller.signal);
    return () => {
      controller.abort();
    };
  }, [sub, onopen, onmessage, onerror, onclose]);
};

export {
  WS_PROTOCOL,
  WSDefaultOpts,
  WSCtx,
  WSState,
  WSProvider,
  useWSValue,
  useWSValueCtx,
  useWS,
  useWSSub,
};
