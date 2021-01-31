import {useCallback} from 'react';
import {useURL} from '@xorkevin/substation';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  useMenu,
  Menu,
  MenuItem,
  Field,
  FieldFile,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  usePaginate,
  ButtonGroup,
  Anchor,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import Img from '@xorkevin/nuke/src/component/image/rounded';

const BRAND_LIMIT = 32;

const selectAPIBrands = (api) => api.courier.brand.get;
const selectAPICreate = (api) => api.courier.brand.create;
const selectAPIDelete = (api) => api.courier.brand.id.del;
const selectAPIImage = (api) => api.courier.brand.id.image;

const BrandRow = ({
  creatorid,
  brandid,
  creation_time,
  posthookDelete,
  errhook,
}) => {
  const [_deleteState, execDelete] = useAuthCall(
    selectAPIDelete,
    [creatorid, brandid],
    {},
    {posthook: posthookDelete, errhook},
  );
  const imageURL = useURL(selectAPIImage, [creatorid, brandid]);

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column>
          <h5>{brandid}</h5>
          <Anchor ext href={imageURL}>
            <Img src={imageURL} ratio={1} />
          </Anchor>
          <div>
            Created <Time value={creation_time * 1000} />
          </div>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem onClick={execDelete} icon={<FaIcon icon="trash" />}>
                Delete
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const CourierBrand = ({accountid}) => {
  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_deleteState, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const form = useForm({
    brandid: '',
    image: undefined,
  });

  const paginate = usePaginate(BRAND_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookBrands = useCallback(
    (_status, brands) => {
      setAtEnd(brands.length < BRAND_LIMIT);
    },
    [setAtEnd],
  );
  const [brands, reexecute] = useAuthResource(
    selectAPIBrands,
    [accountid, BRAND_LIMIT, paginate.index],
    [],
    {posthook: posthookBrands},
  );

  const formAssign = form.assign;
  const posthookRefresh = useCallback(
    (_status, _data, opts) => {
      formAssign({
        brandid: '',
        image: undefined,
      });
      reexecute(opts);
    },
    [reexecute, formAssign],
  );
  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [accountid, form.state],
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
      <h3>Brands</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <ListGroup>
            {brands.data.map(({brandid, creatorid, creation_time}) => (
              <BrandRow
                key={brandid}
                creatorid={creatorid}
                brandid={brandid}
                creation_time={creation_time}
                posthookDelete={posthookDelete}
                errhook={displayErrSnack}
              />
            ))}
          </ListGroup>
          <ButtonGroup>
            <ButtonTertiary disabled={paginate.atFirst} onClick={paginate.prev}>
              prev
            </ButtonTertiary>
            {paginate.page}
            <ButtonTertiary disabled={paginate.atLast} onClick={paginate.next}>
              next
            </ButtonTertiary>
          </ButtonGroup>
          {brands.err && <p>{brands.err.message}</p>}
        </Column>
        <Column fullWidth md={8}>
          <h4>Create new brand</h4>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execCreate}
          >
            <Field name="brandid" label="Brand ID" nohint />
            <FieldFile
              name="image"
              hint="Choose an image"
              accept="image/jpeg, image/png"
              onChange={form.update}
              fullWidth
            >
              <ButtonTertiary>Choose</ButtonTertiary>
            </FieldFile>
          </Form>
          <ButtonGroup>
            <ButtonPrimary onClick={execCreate}>Add Brand</ButtonPrimary>
          </ButtonGroup>
          {create.loading && (
            <p>
              <FaIcon icon="cloud-upload" /> Uploading
            </p>
          )}
          {create.err && <p>{create.err.message}</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default CourierBrand;
