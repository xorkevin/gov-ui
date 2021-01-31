import {lazy} from 'react';

import {GovUIDefaultOpts, GovUICtx, GovUIMiddleware} from './src/middleware';
import GovAPI from './src/apiconfig';

const DevtoolsContainer = lazy(() => import('./src/container/devtools'));
const LoginContainer = lazy(() => import('./src/container/login'));
const OAuthContainer = lazy(() => import('./src/container/oauth'));
const AccountContainer = lazy(() => import('./src/container/account'));
const UserContainer = lazy(() => import('./src/container/user'));
const OrgContainer = lazy(() => import('./src/container/org'));
const AdminContainer = lazy(() => import('./src/container/admin'));
const CourierContainer = lazy(() => import('./src/container/courier'));
const SetupContainer = lazy(() => import('./src/container/setup'));

export {
  GovUIDefaultOpts,
  GovUICtx,
  GovUIMiddleware,
  GovAPI,
  DevtoolsContainer,
  LoginContainer,
  OAuthContainer,
  AccountContainer,
  UserContainer,
  OrgContainer,
  AdminContainer,
  CourierContainer,
  SetupContainer,
};
