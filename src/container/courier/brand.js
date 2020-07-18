import React, {Fragment, useState, useCallback} from 'react';
import {useURL} from '@xorkevin/substation';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Section,
  Table,
  Button,
  Time,
  Anchor,
  FaIcon,
  Img,
  Form,
  Input,
  useForm,
  usePaginate,
  useSnackbar,
} from '@xorkevin/nuke';

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

  const [endPage, setEndPage] = useState(true);
  const page = usePaginate(LIMIT, endPage);

  const posthook = useCallback(
    (_status, brands) => {
      setEndPage(brands.length < LIMIT);
    },
    [setEndPage],
  );
  const [brands, reexecute] = useAuthResource(
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
  const [create, execCreate] = useAuthCall(
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
        {create.loading && (
          <Fragment>
            <FaIcon icon="cloud-upload" /> Uploading
          </Fragment>
        )}
        {create.err && <span>{create.err}</span>}
      </Section>
      {brands.err && <span>{brands.err}</span>}
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
          {brands.data.map(({brandid, creation_time}) => (
            <BrandRow
              key={brandid}
              brandid={brandid}
              creation_time={creation_time}
              posthook={posthookDelete}
              errhook={displayErrSnack}
            />
          ))}
        </Table>
        <div>
          <Button onClick={page.prev}>prev</Button>
          {page.num}
          <Button onClick={page.next}>next</Button>
        </div>
      </Section>
    </div>
  );
};

export default CourierBrand;
