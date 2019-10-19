import React, {Fragment, useCallback} from 'react';
import {useURL} from '@xorkevin/substation';
import {usePaginate} from 'service/paginate';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {useSnackbar} from 'service/snackbar';
import Section from 'component/section';
import Table from 'component/table';
import Button from 'component/button';
import Time from 'component/time';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';
import Img from 'component/image';
import {Form, Input, useForm} from 'component/form';

const LIMIT = 32;

const selectAPIBrands = (api) => api.courier.brand.get;
const selectAPICreate = (api) => api.courier.brand.create;
const selectAPIDelete = (api) => api.courier.brand.id.del;
const selectAPIImage = (api) => api.courier.brand.id.image;

const BrandRow = ({brandid, creation_time, posthook, errhook}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [brandid],
    {},
    {posthook, errhook},
  );
  const imageURL = useURL(selectAPIImage, [brandid]);

  return (
    <tr>
      <td>{brandid}</td>
      <td>
        <Anchor ext href={imageURL}>
          <Img rounded imgWidth={256} imgHeight={256} src={imageURL} />
        </Anchor>
      </td>
      <td>
        <Time value={creation_time * 1000} />
      </td>
      <td>
        <Button text onClick={execDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

const CourierBrand = () => {
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_stage, err) => {
      snackbar(
        <Fragment>
          <span>Failed to delete brand: {err}</span>
        </Fragment>,
      );
    },
    [snackbar],
  );

  const [formState, updateForm] = useForm({
    brandid: '',
    image: undefined,
  });

  const page = usePaginate(LIMIT);
  const pageSetEnd = page.setEnd;

  const posthook = useCallback(
    (_status, brands) => {
      pageSetEnd(brands.length < LIMIT);
    },
    [pageSetEnd],
  );
  const {err, data: brands, reexecute} = useAuthResource(
    selectAPIBrands,
    [LIMIT, page.value],
    [],
    {posthook},
  );

  const posthookRefresh = useCallback(
    (_status, _data, opts) => {
      reexecute(opts);
      updateForm('brandid', '');
      updateForm('url', undefined);
    },
    [reexecute, updateForm],
  );
  const [createState, execCreate] = useAuthCall(
    selectAPICreate,
    [formState],
    {},
    {posthook: posthookRefresh},
  );

  const posthookDelete = useCallback(
    (_status, _data, opts) => {
      reexecute(opts);
    },
    [reexecute],
  );

  const {loading, err: errCreate} = createState;

  return (
    <div>
      <Section subsection sectionTitle="Add Brand">
        <Form formState={formState} onChange={updateForm} onEnter={execCreate}>
          <Input label="brand id" name="brandid" />
          <Input
            type="file"
            accept="image/*"
            capture="environment"
            label="brand image"
            name="image"
          />
        </Form>
        <Button onClick={execCreate}>Add Brand</Button>
        {loading && (
          <Fragment>
            <FaIcon icon="cloud-upload" /> Uploading
          </Fragment>
        )}
        {errCreate && <span>{errCreate}</span>}
      </Section>
      {err && <span>{err}</span>}
      <Section subsection sectionTitle="Brands">
        <Table
          fullWidth
          head={
            <Fragment>
              <th>brand id</th>
              <th>image</th>
              <th>creation time</th>
              <th></th>
            </Fragment>
          }
        >
          {brands.map(({brandid, creation_time}) => (
            <BrandRow
              key={brandid}
              brandid={brandid}
              creation_time={creation_time}
              posthook={posthookDelete}
              errhook={displayErrSnack}
            />
          ))}
        </Table>
      </Section>
    </div>
  );
};

export default CourierBrand;
