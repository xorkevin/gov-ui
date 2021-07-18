import QRCode from 'qrcode';

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

const emailRegex =
  /^[a-z0-9_-][a-z0-9_+-]*(\.[a-z0-9_+-]+)*@[a-z0-9]+(-+[a-z0-9]+)*(\.[a-z0-9]+(-+[a-z0-9]+)*)*$/;

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

const TimeFormatter = () => {
  if (Intl && Intl.DateTimeFormat) {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  }
  return {
    format: (date) => {
      return date.toString();
    },
  };
};

const timeFormatter = TimeFormatter();
const dateToLocale = (date) => {
  return timeFormatter.format(date);
};

const QRECLow = Symbol('QRECLow');
const QRECMedium = Symbol('QRECMedium');
const QRECQuartile = Symbol('QRECQuartile');
const QRECHigh = Symbol('QRECHigh');

const QRECLevel = Object.freeze({
  L: QRECLow,
  M: QRECMedium,
  Q: QRECQuartile,
  H: QRECHigh,
});

const qrecLevelToOpt = {
  QRECLow: 'L',
  QRECMedium: 'M',
  QRECQuartile: 'Q',
  QRECHigh: 'H',
};
const qrecLevelsSet = new Set(Object.keys(qrecLevelToOpt));

const generateQR = async (data, ecLevel, scale) => {
  try {
    const uri = await QRCode.toDataURL([{data, mode: 'byte'}], {
      errorCorrectionLevel: qrecLevelsSet.has(ecLevel)
        ? qrecLevelToOpt[ecLevel]
        : 'L',
      type: 'image/png',
      scale: typeof scale !== 'number' || scale <= 0 ? 8 : scale,
      margin: 0,
    });
    return [uri, null];
  } catch (err) {
    return [null, err];
  }
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
  dateToLocale,
  QRECLevel,
  generateQR,
};
