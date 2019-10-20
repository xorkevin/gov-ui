import {useState, useCallback} from 'react';

const max = (a, b) => (a > b ? a : b);
const max0 = (a) => max(a, 0);

const endNextPage = () => {};

const usePaginate = (limit = 8, end = false) => {
  const [value, setVal] = useState(0);

  const next = useCallback(() => setVal((i) => max0(i + limit)), [
    setVal,
    limit,
  ]);
  const prev = useCallback(() => setVal((i) => max0(i - limit)), [
    setVal,
    limit,
  ]);
  const set = useCallback((i) => setVal(i), [setVal]);
  const first = useCallback(() => setVal(0), [setVal]);

  return {
    value,
    num: Math.floor(value / max(limit, 1)) + 1,
    next: end ? endNextPage : next,
    prev,
    set,
    first,
  };
};

export {usePaginate};
