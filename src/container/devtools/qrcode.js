import {useState, useCallback} from 'react';
import {
  Container,
  Grid,
  Column,
  Card,
  Field,
  Form,
  useForm,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';

import {QRCode, QRECLevel} from '../../component/qrcode';

const QRCodeContainer = () => {
  const [data, setData] = useState(null);
  const form = useForm({
    data: '',
  });
  const genQR = useCallback(async () => {
    setData(form.state.data);
  }, [form.state, setData]);

  return (
    <div>
      <h3>QRCode tester</h3>
      <Grid>
        <Column fullWidth md={16}>
          <Card
            title={
              <Container padded>
                <h4>Image</h4>
              </Container>
            }
          >
            <Container padded>
              <Form
                formState={form.state}
                onChange={form.update}
                onSubmit={genQR}
              >
                <Field name="data" label="Data" nohint fullWidth />
              </Form>
              <ButtonGroup>
                <ButtonPrimary onClick={genQR}>Generate</ButtonPrimary>
              </ButtonGroup>
              {data && <QRCode data={data} level={QRECLevel.H} />}
            </Container>
          </Card>
        </Column>
      </Grid>
    </div>
  );
};

export default QRCodeContainer;
