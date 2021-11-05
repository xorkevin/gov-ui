import {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import {useResource, makeFetch} from '@xorkevin/substation';
import {useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  FieldSelect,
  FieldSearchSelect,
  FieldMultiSelect,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  Description,
  ButtonGroup,
  Chip,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {getSearchParams, randomID} from '../../utility';

const selectAPIOidConfig = (api) => api.wellknown.openidconfig;
const selectAPIApps = (api) => api.oauth.app.get;

const NONCE_LENGTH = 43;
const OAUTHAPP_LIMIT = 32;

const responseTypeOpts = [{display: 'code', value: 'code'}];
const responseModeOpts = [
  {display: 'default', value: ''},
  {display: 'query', value: 'query'},
  {display: 'fragment', value: 'fragment'},
];
const promptOpts = [
  {display: 'default', value: ''},
  {display: 'none', value: 'none'},
  {display: 'login', value: 'login'},
  {display: 'consent', value: 'consent'},
  {display: 'select_account', value: 'select_account'},
];
const challengeMethodOpts = [
  {display: 'none', value: ''},
  {display: 'plain', value: 'plain'},
  {display: 'SHA-256', value: 'S256'},
];
const responseTypeToGrantType = {
  code: 'authorization_code',
};

const jwtAlgToSubtleCrypto = {
  RS256: {
    importParams: {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    verifyParams: {
      name: 'RSASSA-PKCS1-v1_5',
    },
  },
};

const secondsMinute = 60;

const unixTime = () => Math.floor(Date.now() / 1000);

const isString = (s) => typeof s === 'string';

const textEncoder = new TextEncoder();

const base64ToArrayBuffer = (s) => {
  const binary = atob(s.replaceAll('-', '+').replaceAll('_', '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const storageOAuthReqKey = () => 'govui:devtools:oauthreq';

const storeOAuthReq = (req) => {
  localStorage.setItem(storageOAuthReqKey(), JSON.stringify(req));
};

const retrieveOAuthReq = () => {
  const k = localStorage.getItem(storageOAuthReqKey());
  try {
    return JSON.parse(k);
  } catch (_e) {
    return null;
  }
};

const storageOAuthClientSecretKey = () => 'govui:devtools:oauthclientsecret';

const storeOAuthClientSecret = (secret) => {
  localStorage.setItem(storageOAuthClientSecretKey(), secret);
};

const retrieveOAuthClientSecret = () => {
  return localStorage.getItem(storageOAuthClientSecretKey());
};

const ChipList = ({list}) => {
  if (!Array.isArray(list)) {
    return null;
  }
  return (
    <Fragment>
      {list.map((i) => (
        <Chip key={i}>{i}</Chip>
      ))}
    </Fragment>
  );
};

const errMsgHandler = (message) => () => [null, -1, {message}];
const errMsg = (message) => ({message});

const OAuthTool = ({pathCallback}) => {
  const ctx = useContext(GovUICtx);

  const displaySnackbarStoreSecret = useSnackbarView(
    <SnackbarSurface>&#x2713; Client secret stored</SnackbarSurface>,
  );

  const randomState = useMemo(() => randomID(NONCE_LENGTH), []);
  const randomNonce = useMemo(() => randomID(NONCE_LENGTH), []);
  const randomChallenge = useMemo(() => randomID(NONCE_LENGTH), []);
  const form = useForm({
    authendpoint: '',
    clientid: '',
    redirecturi: ctx.siteURL + pathCallback,
    responsetype: 'code',
    responsemode: '',
    scope: ctx.openidAllScopes,
    prompt: '',
    maxage: '',
    loginhint: '',
    state: randomState,
    nonce: randomNonce,
    challengemethod: 'S256',
    challenge: randomChallenge,
  });

  const scopeOpts = useMemo(
    () => ctx.openidAllScopes.map((i) => ({display: i, value: i})),
    [ctx],
  );

  const formAssign = form.assign;
  const posthookConfig = useCallback(
    (_res, config) => {
      formAssign({
        authendpoint: config.authorization_endpoint,
      });
    },
    [formAssign],
  );
  const [oidConfig] = useResource(
    selectAPIOidConfig,
    [],
    {},
    {posthook: posthookConfig},
  );

  const [apps] = useAuthResource(selectAPIApps, [OAUTHAPP_LIMIT, 0], []);

  const clientOpts = useMemo(
    () =>
      apps.success
        ? apps.data.map((i) => ({display: i.name, value: i.client_id}))
        : [],
    [apps],
  );

  const formChallengeMethod = form.state.challengemethod;
  const formChallenge = form.state.challenge;
  const [codeChallengeValue, setCodeChallengeValue] = useState(formChallenge);
  useEffect(() => {
    const controller = new AbortController();
    switch (formChallengeMethod) {
      case 'plain':
        setCodeChallengeValue(formChallenge);
        break;
      case 'S256':
        (async () => {
          const data = new TextEncoder().encode(formChallenge);
          const hash = await crypto.subtle.digest('SHA-256', data);
          if (controller.signal.aborted) {
            return;
          }
          const hashstr = btoa(
            new Uint8Array(hash).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          )
            .replaceAll('=', '')
            .replaceAll('+', '-')
            .replaceAll('/', '_');
          setCodeChallengeValue(hashstr);
        })();
        break;
      default:
        setCodeChallengeValue('');
    }
    return () => {
      controller.abort();
    };
  }, [formChallengeMethod, formChallenge]);
  const formState = form.state;
  const linkDest = useMemo(() => {
    const {
      authendpoint,
      clientid,
      redirecturi,
      responsetype,
      responsemode,
      scope,
      prompt,
      maxage,
      loginhint,
      state,
      nonce,
      challengemethod,
    } = formState;
    if (authendpoint.length === 0) {
      return '#';
    }
    try {
      const url = new URL(authendpoint);
      const q = url.searchParams;
      if (clientid.length > 0) {
        q.set('client_id', clientid);
      }
      if (redirecturi.length > 0) {
        q.set('redirect_uri', redirecturi);
      }
      if (responsetype.length > 0) {
        q.set('response_type', responsetype);
      }
      if (responsemode.length > 0) {
        q.set('response_mode', responsemode);
      }
      if (state.length > 0) {
        q.set('state', state);
      }
      if (nonce.length > 0) {
        q.set('nonce', nonce);
      }
      if (challengemethod.length > 0 && codeChallengeValue.length > 0) {
        q.set('code_challenge_method', challengemethod);
        q.set('code_challenge', codeChallengeValue);
      }
      if (scope.length > 0) {
        q.set('scope', scope.join(' '));
      }
      if (prompt.length > 0) {
        q.set('prompt', prompt);
      }
      if (maxage.length > 0) {
        q.set('max_age', maxage);
      }
      if (loginhint.length > 0) {
        q.set('login_hint', loginhint);
      }
      return url.toString();
    } catch (_e) {
      return '#';
    }
  }, [formState, codeChallengeValue]);

  const makeOAuthReq = useCallback(() => {
    const req = {
      time: unixTime(),
      clientid: formState.clientid,
      redirecturi: formState.redirecturi,
      responsetype: formState.responsetype,
      state: formState.state,
      nonce: formState.nonce,
      challengemethod: formState.challengemethod,
      challenge: formState.challenge,
    };
    storeOAuthReq(req);
    window.location.replace(linkDest);
  }, [formState, linkDest]);

  const secretForm = useForm({
    clientsecret: '',
  });
  const secretFormState = secretForm.state;
  const storeClientSecret = useCallback(() => {
    storeOAuthClientSecret(secretFormState.clientsecret);
    displaySnackbarStoreSecret();
  }, [secretFormState, displaySnackbarStoreSecret]);

  return (
    <div>
      <h3>OAuth Tool</h3>
      <Grid>
        <Column md={12}>
          <Form formState={form.state} onChange={form.update}>
            <Grid>
              <Column md={12}>
                <FieldSearchSelect
                  name="clientid"
                  label="Client"
                  options={clientOpts}
                  nohint
                  fullWidth
                />
                <Field name="clientid" label="Client ID" nohint fullWidth />
                <Field
                  name="redirecturi"
                  label="Redirect URI"
                  nohint
                  fullWidth
                />
                <FieldSelect
                  name="responsetype"
                  label="Response Type"
                  options={responseTypeOpts}
                  nohint
                  fullWidth
                />
                <FieldSelect
                  name="responsemode"
                  label="Response Mode"
                  options={responseModeOpts}
                  nohint
                  fullWidth
                />
                <FieldMultiSelect
                  name="scope"
                  label="Scope"
                  options={scopeOpts}
                  nohint
                  fullWidth
                />
                <FieldSelect
                  name="prompt"
                  label="Prompt"
                  options={promptOpts}
                  nohint
                  fullWidth
                />
                <Field name="maxage" label="Max Age" nohint fullWidth />
                <Field name="loginhint" label="Login Hint" nohint fullWidth />
              </Column>
              <Column md={12}>
                <Field
                  name="authendpoint"
                  label="Authorization Endpoint"
                  nohint
                  fullWidth
                />
                <Field name="state" label="State" nohint fullWidth />
                <Field name="nonce" label="Nonce" nohint fullWidth />
                <FieldSelect
                  name="challengemethod"
                  label="Code Challenge Method"
                  options={challengeMethodOpts}
                  nohint
                  fullWidth
                />
                <Field
                  name="challenge"
                  label="Code Challenge Secret"
                  nohint
                  fullWidth
                />
                <Field
                  noctx
                  value={codeChallengeValue}
                  label="Code Challenge"
                  readOnly
                  nohint
                  fullWidth
                />
              </Column>
            </Grid>
          </Form>
          <h4>Store client secret</h4>
          <Form
            formState={secretForm.state}
            onChange={secretForm.update}
            onSubmit={storeClientSecret}
          >
            <Field name="clientsecret" label="Client secret" nohint />
          </Form>
          <ButtonGroup>
            <ButtonSecondary onClick={storeClientSecret}>
              Store Client Secret
            </ButtonSecondary>
          </ButtonGroup>
        </Column>
        <Column md={12}>
          <h4>Openid Configuration</h4>
          {oidConfig.success && (
            <Fragment>
              <Description label="Issuer" item={oidConfig.data.issuer} />
              <Description
                label="Authorization Endpoint"
                item={oidConfig.data.authorization_endpoint}
              />
              <Description
                label="Token Endpoint"
                item={oidConfig.data.token_endpoint}
              />
              <Description
                label="Userinfo Endpoint"
                item={oidConfig.data.userinfo_endpoint}
              />
              <Description label="JWKs URI" item={oidConfig.data.jwks_uri} />
              <Description
                label="Scopes Supported"
                item={<ChipList list={oidConfig.data.scopes_supported} />}
              />
              <Description
                label="Response Types Supported"
                item={
                  <ChipList list={oidConfig.data.response_types_supported} />
                }
              />
              <Description
                label="Response Modes Supported"
                item={
                  <ChipList list={oidConfig.data.response_modes_supported} />
                }
              />
              <Description
                label="Grant Types Supported"
                item={<ChipList list={oidConfig.data.grant_types_supported} />}
              />
              <Description
                label="Subject Types Supported"
                item={
                  <ChipList list={oidConfig.data.subject_types_supported} />
                }
              />
              <Description
                label="ID Token Signing Algorithms Supported"
                item={
                  <ChipList
                    list={oidConfig.data.id_token_signing_alg_values_supported}
                  />
                }
              />
              <Description
                label="Token Endpoint Auth Methods Supported"
                item={
                  <ChipList
                    list={oidConfig.data.token_endpoint_auth_methods_supported}
                  />
                }
              />
              <Description
                label="Code Challenge Methods Supported"
                item={
                  <ChipList
                    list={oidConfig.data.code_challenge_methods_supported}
                  />
                }
              />
              <Description
                label="Claims Supported"
                item={<ChipList list={oidConfig.data.claims_supported} />}
              />
            </Fragment>
          )}
          {oidConfig.err && <p>{oidConfig.err.message}</p>}
        </Column>
      </Grid>
      <h4>OAuth Link</h4>
      <AnchorText href={linkDest}>
        <code>{linkDest}</code>
      </AnchorText>
      <ButtonGroup>
        <ButtonPrimary onClick={makeOAuthReq}>Send OAuth Request</ButtonPrimary>
      </ButtonGroup>
    </div>
  );
};

const OAuthCB = () => {
  const {search} = useLocation();
  const params = useMemo(() => {
    const query = getSearchParams(search);
    return {
      state: query.get('state') || '',
      error: query.get('error') || '',
      errorDesc: query.get('error_description') || '',
      code: query.get('code') || '',
    };
  }, [search]);
  const req = useMemo(() => {
    return retrieveOAuthReq();
  }, []);

  const [timeValid, setTimeValid] = useState(true);
  useEffect(() => {
    if (!timeValid) {
      return;
    }
    const handler = () => {
      const k = req && unixTime() < req.time + secondsMinute;
      if (k !== timeValid) {
        setTimeValid(k);
      }
    };
    const interval = window.setInterval(handler, 1000);
    handler();
    return () => {
      window.clearInterval(interval);
    };
  }, [req, timeValid, setTimeValid]);

  const statesEqual = req && params.state === req.state;
  const statesMessage = statesEqual ? '\u2713 Match' : '\u00D7 Mismatch';
  const timeMessage = timeValid ? '\u2713 Unexpired' : '\u00D7 Expired';

  const clientsecret = useMemo(() => {
    return retrieveOAuthClientSecret();
  }, []);

  const form = useForm({
    clientsecret: clientsecret || '',
  });

  const [oidConfig] = useResource(selectAPIOidConfig, [], {});

  const jwksReq = useMemo(() => {
    if (!oidConfig.success) {
      return errMsgHandler('No openid config');
    }
    return makeFetch({
      url: oidConfig.data.jwks_uri,
      method: 'GET',
      expectdata: true,
      err: 'Failed to get jwks',
    });
  }, [oidConfig]);

  const [jwksRes, setJWKSRes] = useState({
    success: false,
    err: false,
    data: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const [data, _, err] = await jwksReq();
      if (controller.signal.aborted) {
        return;
      }
      if (err) {
        setJWKSRes({success: false, err, data: null});
        return;
      }
      setJWKSRes({success: true, err: false, data});
    })();
    return () => {
      controller.abort();
    };
  }, [jwksReq, setJWKSRes]);

  const formState = form.state;

  const tokenReq = useMemo(() => {
    if (params.error) {
      return errMsgHandler('Auth code response error');
    }
    if (!req) {
      return errMsgHandler('No stored request');
    }
    if (!statesEqual) {
      return errMsgHandler('Invalid state');
    }
    if (!timeValid) {
      return errMsgHandler('Invalid time');
    }
    if (!oidConfig.success) {
      return errMsgHandler('No openid config');
    }
    return makeFetch({
      url: oidConfig.data.token_endpoint,
      method: 'POST',
      transformer: () => ({
        headers: {
          Authorization: `Basic ${btoa(
            `${req.clientid}:${formState.clientsecret}`,
          )}`,
        },
        body: new URLSearchParams({
          grant_type: responseTypeToGrantType[req.responsetype],
          redirect_uri: req.redirecturi,
          code: params.code,
          code_verifier: req.challenge,
        }),
        opts: {
          credentials: 'omit',
        },
      }),
      expectdata: true,
      err: 'Failed token request',
    });
  }, [params, req, statesEqual, timeValid, formState, oidConfig]);

  const [tokenRes, setTokenRes] = useState({
    success: false,
    err: false,
    data: null,
  });
  const makeTokenReq = useCallback(async () => {
    const [data, _, err] = await tokenReq();
    if (err) {
      setTokenRes({success: false, err, data: null});
      return;
    }
    setTokenRes({success: true, err: false, data});
  }, [tokenReq, setTokenRes]);

  const [idTokenHeaders, idTokenClaims, idTokenErr] = useMemo(() => {
    if (!tokenRes.success) {
      return [null, null, errMsgHandler('Token request incomplete')];
    }
    if (!isString(tokenRes.data.id_token)) {
      return [null, null, errMsgHandler('No id token')];
    }
    const jwt = tokenRes.data.id_token.split('.');
    if (jwt.length !== 3) {
      return [null, null, errMsgHandler('Malformed jwt')];
    }
    const b64claims = jwt[1].replaceAll('-', '+').replaceAll('_', '/');
    const b64headers = jwt[0].replaceAll('-', '+').replaceAll('_', '/');
    try {
      return [JSON.parse(atob(b64headers)), JSON.parse(atob(b64claims)), false];
    } catch (err) {
      return [null, null, err];
    }
  }, [tokenRes]);

  const validClaims = useMemo(() => {
    const valid = '\u2713 Valid';
    const invalid = '\u00D7 Invalid';
    if (idTokenErr) {
      return {
        iss: invalid,
        aud: invalid,
      };
    }
    const msg = (v) => (v ? valid : invalid);
    return {
      iss: msg(idTokenClaims['iss'] === oidConfig.data.issuer),
      aud: msg(
        Array.isArray(idTokenClaims['aud']) &&
          idTokenClaims['aud'].includes(req.clientid),
      ),
      azp: msg(idTokenClaims['azp'] === req.clientid),
      nonce: msg(!req.nonce || idTokenClaims['nonce'] === req.nonce),
    };
  }, [idTokenErr, idTokenClaims, oidConfig, req]);

  const [accessTokenValid, setAccessTokenValid] = useState(true);
  useEffect(() => {
    if (idTokenErr) {
      return;
    }
    if (!accessTokenValid) {
      return;
    }
    const handler = () => {
      setAccessTokenValid(unixTime() <= idTokenClaims['exp']);
    };
    const interval = window.setInterval(handler, 1000);
    handler();
    return () => {
      window.clearInterval(interval);
    };
  }, [idTokenErr, idTokenClaims, accessTokenValid, setAccessTokenValid]);
  const accessTokenMessage = accessTokenValid
    ? '\u2713 Valid'
    : '\u00D7 Invalid';

  const [jwtSig, setJWTSig] = useState({kid: '', err: false});
  useEffect(() => {
    if (!jwksRes.success) {
      setJWTSig({kid: '', err: errMsg('No jwks')});
      return;
    }
    if (!tokenRes.success) {
      setJWTSig({kid: '', err: errMsg('No id token')});
      return;
    }
    if (!Array.isArray(jwksRes.data.keys) || jwksRes.data.keys.length === 0) {
      setJWTSig({kid: '', err: errMsg('No jwks key')});
      return;
    }
    if (!isString(tokenRes.data.id_token)) {
      setJWTSig({kid: '', err: errMsg('No id token')});
      return;
    }

    const jwt = tokenRes.data.id_token.split('.');
    if (jwt.length !== 3) {
      setJWTSig({kid: '', err: errMsg('Malformed id token')});
      return;
    }
    const jwtpayload = `${jwt[0]}.${jwt[1]}`;
    const jwtsig = jwt[2];
    const jwtheaders = (() => {
      try {
        const b64headers = jwt[0].replaceAll('-', '+').replaceAll('_', '/');
        return JSON.parse(atob(b64headers));
      } catch (err) {
        setJWTSig({kid: '', err});
        return null;
      }
    })();
    if (!jwtheaders) {
      return;
    }
    if (!jwtheaders.kid) {
      setJWTSig({
        kid: '',
        err: errMsg('JWT missing kid header'),
      });
      return;
    }
    const jwk = jwksRes.data.keys.find((i) => i.kid === jwtheaders.kid);
    if (!jwk) {
      setJWTSig({
        kid: '',
        err: errMsg(`JWK with kid ${jwtheaders.kid} not found`),
      });
      return;
    }
    if (jwtheaders.alg !== jwk.alg) {
      setJWTSig({
        kid: jwk.kid,
        err: errMsg(`Invalid jwt alg ${jwtheaders.alg}`),
      });
      return;
    }

    const params = jwtAlgToSubtleCrypto[jwk.alg];
    if (!params) {
      setJWTSig({
        kid: jwk.kid,
        err: errMsg(`Unsupported alg ${jwk.alg}`),
      });
      return;
    }
    const {importParams, verifyParams} = params;

    const controller = new AbortController();
    (async () => {
      try {
        const pubkey = await window.crypto.subtle.importKey(
          'jwk',
          jwk,
          importParams,
          false,
          ['verify'],
        );
        if (controller.signal.aborted) {
          return;
        }
        const ok = await window.crypto.subtle.verify(
          verifyParams,
          pubkey,
          base64ToArrayBuffer(jwtsig),
          textEncoder.encode(jwtpayload),
        );
        if (controller.signal.aborted) {
          return;
        }
        if (!ok) {
          setJWTSig({kid: jwk.kid, err: errMsg('Invalid signature')});
          return;
        }
        setJWTSig({kid: jwk.kid, err: false});
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }
        setJWTSig({kid: jwk.kid, err});
      }
    })();
    return () => {
      controller.abort();
    };
  }, [jwksRes, tokenRes, setJWTSig]);
  const jwtSigMessage = jwtSig.err ? '\u00D7 Invalid' : '\u2713 Valid';
  const jwtSigInfo = useMemo(() => {
    if (!jwtSig.kid) {
      return '';
    }
    const jwk = jwksRes.data.keys.find((i) => i.kid === jwtSig.kid);
    if (!jwk) {
      return '';
    }
    return `Verified with key ${jwk.kid} using alg ${jwk.alg}.`;
  }, [jwtSig, jwksRes]);

  const userinfoReq = useMemo(() => {
    if (!oidConfig.success) {
      return errMsgHandler('No openid config');
    }
    if (!tokenRes.success) {
      return errMsgHandler('No access token');
    }
    return makeFetch({
      url: oidConfig.data.userinfo_endpoint,
      method: 'GET',
      transformer: () => ({
        headers: {
          Authorization: `Bearer ${tokenRes.data.access_token}`,
        },
        opts: {
          credentials: 'omit',
        },
      }),
      expectdata: true,
      err: 'Failed userinfo request',
    });
  }, [oidConfig, tokenRes]);

  const [userinfoRes, setUserinfoRes] = useState({
    success: false,
    err: false,
    data: null,
  });
  const makeUserinfoReq = useCallback(async () => {
    const [data, _, err] = await userinfoReq();
    if (err) {
      setUserinfoRes({success: false, err, data: null});
      return;
    }
    setUserinfoRes({success: true, err: false, data});
  }, [userinfoReq, setUserinfoRes]);

  return (
    <div>
      <h3>OAuth Callback Tool</h3>
      <Grid>
        <Column md={12}>
          <h4>OAuth Response</h4>
          <Description label="State" item={params.state} />
          {params.error ? (
            <Fragment>
              <Description
                label="Error Code"
                item={<Chip>{params.error}</Chip>}
              />
              <Description label="Error Message" item={params.errorDesc} />
            </Fragment>
          ) : (
            <Fragment>
              <Description label="Code" item={params.code} />
            </Fragment>
          )}
          <h4>Stored request</h4>
          {!req && <strong>None</strong>}
          {req && (
            <Fragment>
              <Description
                label="Time"
                item={
                  <Fragment>
                    {req.time} <Chip>{timeMessage}</Chip>
                  </Fragment>
                }
              />
              <Description label="Client ID" item={req.clientid} />
              <Description label="Redirect URI" item={req.redirecturi} />
              <Description label="Response Type" item={req.responsetype} />
              <Description
                label="Grant Type"
                item={responseTypeToGrantType[req.responsetype]}
              />
              <Description
                label="State"
                item={
                  <Fragment>
                    {req.state} <Chip>{statesMessage}</Chip>
                  </Fragment>
                }
              />
              <Description label="Nonce" item={req.nonce} />
              <Description
                label="Challenge Method"
                item={req.challengemethod}
              />
              <Description label="Challenge Secret" item={req.challenge} />
            </Fragment>
          )}
          <h4>Client secret</h4>
          <Form formState={form.state} onChange={form.update}>
            <Field name="clientsecret" label="Client secret" nohint />
          </Form>
        </Column>
        <Column md={12}>
          <h4>Openid Configuration</h4>
          {oidConfig.success && (
            <Fragment>
              <Description label="Issuer" item={oidConfig.data.issuer} />
              <Description
                label="Token Endpoint"
                item={oidConfig.data.token_endpoint}
              />
              <Description
                label="Userinfo Endpoint"
                item={oidConfig.data.userinfo_endpoint}
              />
              <Description label="JWKs URI" item={oidConfig.data.jwks_uri} />
              <Description
                label="Scopes Supported"
                item={<ChipList list={oidConfig.data.scopes_supported} />}
              />
              <Description
                label="Grant Types Supported"
                item={<ChipList list={oidConfig.data.grant_types_supported} />}
              />
              <Description
                label="Subject Types Supported"
                item={
                  <ChipList list={oidConfig.data.subject_types_supported} />
                }
              />
              <Description
                label="ID Token Signing Algorithms Supported"
                item={
                  <ChipList
                    list={oidConfig.data.id_token_signing_alg_values_supported}
                  />
                }
              />
              <Description
                label="Token Endpoint Auth Methods Supported"
                item={
                  <ChipList
                    list={oidConfig.data.token_endpoint_auth_methods_supported}
                  />
                }
              />
              <Description
                label="Code Challenge Methods Supported"
                item={
                  <ChipList
                    list={oidConfig.data.code_challenge_methods_supported}
                  />
                }
              />
              <Description
                label="Claims Supported"
                item={<ChipList list={oidConfig.data.claims_supported} />}
              />
            </Fragment>
          )}
          {oidConfig.err && <p>{oidConfig.err.message}</p>}
          <h4>JWKS</h4>
          {jwksRes.success && (
            <Fragment>
              <pre className="devtools-code">
                {JSON.stringify(jwksRes.data, null, '  ')}
              </pre>
            </Fragment>
          )}
          {jwksRes.err && <p>{jwksRes.err.message}</p>}
        </Column>
      </Grid>
      <hr />
      <h4>Token Request</h4>
      <ButtonGroup>
        <ButtonPrimary onClick={makeTokenReq}>Send Token Request</ButtonPrimary>
      </ButtonGroup>
      {tokenRes.success && (
        <Fragment>
          <Grid>
            <Column md={12}>
              <Field
                noctx
                value={tokenRes.data.access_token}
                label="Access Token"
                readOnly
                nohint
              />
              <div>
                <h6>Token type</h6>
                {tokenRes.data.token_type}
              </div>
              <div>
                <h6>Expires in</h6>
                {tokenRes.data.expires_in}
              </div>
              <Field
                noctx
                value={tokenRes.data.refresh_token}
                label="Refresh Token"
                readOnly
                nohint
              />
              <div>
                <h6>Scopes</h6>
                <ChipList
                  list={
                    isString(tokenRes.data.scope) &&
                    tokenRes.data.scope.split(' ')
                  }
                />
              </div>
              <Field
                noctx
                value={tokenRes.data.id_token}
                label="ID Token"
                readOnly
                nohint
              />
              <div>
                <h6>JWT Signature</h6>
                <Chip>{jwtSigMessage}</Chip>
                {jwtSig.err && <p>{jwtSig.err.message}</p>}
                {jwtSigInfo && <p>{jwtSigInfo}</p>}
              </div>
            </Column>
            <Column md={12}>
              <h5>ID Token Claims</h5>
              {!idTokenErr && (
                <Fragment>
                  {Array.isArray(oidConfig.data.claims_supported) &&
                    oidConfig.data.claims_supported.map((i) => (
                      <Description
                        key={i}
                        label={i}
                        item={
                          <Fragment>
                            {idTokenClaims[i] && idTokenClaims[i].toString()}{' '}
                            {validClaims[i] && <Chip>{validClaims[i]}</Chip>}
                            {i === 'exp' && <Chip>{accessTokenMessage}</Chip>}
                          </Fragment>
                        }
                      />
                    ))}
                  <pre className="devtools-code">
                    {JSON.stringify(idTokenHeaders, null, '  ')}
                    {JSON.stringify(idTokenClaims, null, '  ')}
                  </pre>
                </Fragment>
              )}
              {idTokenErr && <p>{idTokenErr.message}</p>}
            </Column>
          </Grid>
          <hr />
          <h4>Userinfo Request</h4>
          <ButtonGroup>
            <ButtonPrimary onClick={makeUserinfoReq}>
              Send Userinfo Request
            </ButtonPrimary>
          </ButtonGroup>
          {userinfoRes.success && (
            <pre className="devtools-code">
              {JSON.stringify(userinfoRes.data, null, '  ')}
            </pre>
          )}
          {userinfoRes.err && <p>{userinfoRes.err.message}</p>}
        </Fragment>
      )}
      {tokenRes.err && (
        <p>
          {tokenRes.err.message ||
            tokenRes.err.error_description ||
            tokenRes.err.error}
        </p>
      )}
    </div>
  );
};

const OAuth = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <OAuthTool pathCallback={`${match.url}/cb`} />
      </Route>
      <Route path={`${match.path}/cb`}>
        <OAuthCB />
      </Route>
      <Redirect to={`${match.url}`} />
    </Switch>
  );
};

export default OAuth;
