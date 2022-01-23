import {useState, useEffect, useCallback} from 'react';
import {useURL} from '@xorkevin/substation';
import {useRelogin} from '@xorkevin/turbine';
import {Field, Form, useForm, ButtonGroup} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';

const selectAPIEcho = (api) => api.ws.echo;

const WS_PROTOCOL = 'xorkevin.dev/governor/ws/v1alpha1';

const WSEchoContainer = () => {
  const relogin = useRelogin();
  const url = useURL(selectAPIEcho);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const [_data, _res, err] = await relogin();
      if (controller.signal.aborted) {
        return;
      }
      if (err) {
        return;
      }
      const socket = new WebSocket(url, WS_PROTOCOL);
      controller.signal.addEventListener('abort', () => {
        return () => {
          socket.close(1000, 'OK');
        };
      });
    })();
    return () => {
      controller.abort();
    };
  }, [relogin, url]);

  const form = useForm({
    data: '',
  });

  return (
    <div>
      <h3>Websocket echo tester</h3>
      <Form formState={form.state} onChange={form.update}>
        <Field name="data" label="Data" nohint fullWidth />
      </Form>
      <ButtonGroup>
        <ButtonPrimary>Send</ButtonPrimary>
      </ButtonGroup>
    </div>
  );
};

export default WSEchoContainer;
