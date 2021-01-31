const formatURLArgs = (str, args) => {
  return str.replace(/{(\d+)}/g, (match, number) => {
    if (typeof args[number] != 'undefined') {
      return encodeURIComponent(args[number]);
    }
    return match;
  });
};

const formatURL = (str, ...args) => {
  return formatURLArgs(str, args);
};

const IS_WEB = typeof window !== 'undefined';

const isWeb = () => {
  return IS_WEB;
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

const getSearchParams = (search) => {
  return new URLSearchParams(search);
};

const searchParamsToString = (search) => {
  let k = search.toString();
  if (k.length > 0 && k[0] !== '?') {
    k = '?' + k;
  }
  return k;
};

const emailRegex = /^[a-z0-9_-][a-z0-9_+-]*(\.[a-z0-9_+-]+)*@[a-z0-9]+(-+[a-z0-9]+)*(\.[a-z0-9]+(-+[a-z0-9]+)*)*$/;

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
};

const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

const randomID = (len = 8) => {
  const idarr = [];
  for (let i = 0; i < len; i++) {
    idarr.push(ALPHABET[Math.floor(ALPHABET.length * Math.random())]);
  }
  return idarr.join('');
};

export {
  formatURL,
  formatURLArgs,
  isWeb,
  getCookie,
  setCookie,
  getSearchParams,
  searchParamsToString,
  emailRegex,
  isValidURL,
  randomID,
};
