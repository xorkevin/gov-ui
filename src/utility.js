const formatStrArgs = (str, args) => {
  return str.replace(/{(\d+)}/g, (match, number) => {
    if (typeof args[number] != 'undefined') {
      return args[number];
    }
    return match;
  });
};

const formatStr = (str, ...args) => {
  return formatStrArgs(str, args);
};

const IS_WEB = typeof window !== 'undefined';

const isWeb = () => {
  return IS_WEB;
};

const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const COOKIE = {
  prev: false,
  map: new Map(),
};

const getCookie = (key) => {
  const cookies = document.cookie;
  if (cookies === COOKIE.prev) {
    return COOKIE.map.get(key);
  }
  const map = new Map(
    cookies.split(';').map((value) => {
      return value.trim().split('=');
    }),
  );
  COOKIE.prev = cookies;
  COOKIE.map = map;
  return map.get(key);
};

const setCookie = (key, value, path = '/', age = 31536000) => {
  document.cookie = `${key}=${value};path=${path};max-age=${age}`;
};

const getSearchParams = ({search}) => {
  let k = search;
  if (k.length > 0) {
    k = k.slice(1);
  }
  return new URLSearchParams(k);
};

const searchParamsToString = (search) => {
  let k = search.toString();
  if (k.length > 0) {
    return '?' + k;
  }
  return '';
};

export {
  formatStr,
  formatStrArgs,
  isWeb,
  logger,
  getCookie,
  setCookie,
  getSearchParams,
  searchParamsToString,
};
