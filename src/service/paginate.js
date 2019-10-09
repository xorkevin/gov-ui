import {useState, useCallback} from 'react';
import {max0} from 'utility';

const endNextPage = () => {};

const usePaginate = (limit = 8, offset = 0) => {
  const [value, setVal] = useState(offset);
  const [end, setEnd] = useState(false);

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
    next: end ? endNextPage : next,
    prev,
    set,
    first,
    setEnd,
  };
};

export {usePaginate};
