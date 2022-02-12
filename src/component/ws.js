import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import {sleep} from '../utility';

const WS_PROTOCOL = 'xorkevin.dev-governor_ws_v1alpha1';

const noop = Object.freeze(() => {});

const parseJSON = (s) => {
  try {
    return JSON.parse(s);
  } catch (_err) {
    return {};
  }
};

const WSDefaultOpts = Object.freeze({
  send: noop,
  sendChan: noop,
  sub: noop,
  subChan: noop,
  state: Object.freeze({
    open: false,
  }),
});

const WSCtx = createContext(WSDefaultOpts);

const WSProvider = ({value, children}) => {
  return <WSCtx.Provider value={value}>{children}</WSCtx.Provider>;
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

const useWS = (url, {delayMin, delayMax, delayExp, prehook, errhook} = {}) => {
  const [state, setWSState] = useState(false);

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
        const interval = setInterval(() => {
          delay = delayMin;
        }, delayMax + delayMin);
        await socketClosed;
        clearInterval(interval);
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
        if (errhook) {
          errhook('send', {message: 'Not connected'});
        }
        return;
      }
      ws.current.socket.send(data);
    },
    [ws, errhook],
  );

  const sendChan = useCallback(
    (channel, value) => {
      if (!ws.current.open) {
        if (errhook) {
          errhook('send', {message: 'Not connected'});
        }
        return;
      }
      ws.current.socket.send(
        JSON.stringify({
          channel,
          value,
        }),
      );
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

  const subChan = useCallback(
    (chan, f, signal) => {
      if (!f || signal.aborted) {
        return;
      }
      let onmessage = f.onmessage;
      if (f.onmessage) {
        const isChanPrefix = typeof chan === 'string';
        onmessage = (e) => {
          const data = parseJSON(e.data);
          if (data === undefined || data === null) {
            return;
          }
          const {channel, value} = data;
          if (typeof channel !== 'string') {
            return;
          }
          if (isChanPrefix) {
            if (!channel.startsWith(chan)) {
              return;
            }
          } else {
            if (!chan.test(channel)) {
              return;
            }
          }
          f.onmessage(channel, value, e);
        };
      }
      const sub = Object.assign({}, f, {onmessage, signal});
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
      send,
      sendChan,
      sub,
      subChan,
      state,
    }),
    [send, sendChan, sub, subChan, state],
  );
  return res;
};

const useWSSub = (ws, {onopen, onmessage, onerror, onclose} = {}) => {
  const {sub} = ws;
  useEffect(() => {
    const controller = new AbortController();
    sub({onopen, onmessage, onerror, onclose}, controller.signal);
    return () => {
      controller.abort();
    };
  }, [sub, onopen, onmessage, onerror, onclose]);
};

const useWSSubChan = (ws, chan, {onopen, onmessage, onerror, onclose} = {}) => {
  const {subChan} = ws;
  useEffect(() => {
    const controller = new AbortController();
    subChan(chan, {onopen, onmessage, onerror, onclose}, controller.signal);
    return () => {
      controller.abort();
    };
  }, [subChan, chan, onopen, onmessage, onerror, onclose]);
};

const CTL_CHANNEL = '_ctl_';

const useWSPresenceLocation = (ws, loc) => {
  const {state, sendChan} = ws;
  const {open} = state;
  useEffect(() => {
    if (!open) {
      return;
    }
    sendChan(CTL_CHANNEL, {
      ops: [{op: 'location', args: {location: loc}}],
    });
  }, [open, sendChan, loc]);
};

export {
  WS_PROTOCOL,
  WSDefaultOpts,
  WSCtx,
  WSProvider,
  useWS,
  useWSSub,
  useWSSubChan,
  useWSPresenceLocation,
};
