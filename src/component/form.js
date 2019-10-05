import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import {randomID} from 'utility';
import Chip from 'component/chip';
import FaIcon from 'component/faicon';

const FormContext = React.createContext();

const Form = ({
  formState,
  onChange,
  onEnter,
  errCheck,
  validCheck,
  children,
}) => {
  let error = useMemo(() => {
    if (errCheck) {
      return errCheck(formState);
    }
    return undefined;
  }, [errCheck, formState]);
  let valid = useMemo(() => {
    if (validCheck) {
      return validCheck(formState);
    }
    return undefined;
  }, [validCheck, formState]);
  return (
    <FormContext.Provider value={{formState, onChange, onEnter, error, valid}}>
      {children}
    </FormContext.Provider>
  );
};

const OptionsContainer = ({align, position, fixed, reference, children}) => {
  const [bounds, setBounds] = useState(
    reference.current.getBoundingClientRect(),
  );
  const [scrollY, setScrollY] = useState(window.scrollY);

  useEffect(() => {
    let running = null;
    const handler = () => {
      if (!running) {
        running = window.requestAnimationFrame(() => {
          setBounds(reference.current.getBoundingClientRect());
          setScrollY(window.scrollY);
          running = null;
        });
      }
    };
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
      if (running) {
        window.cancelAnimationFrame(running);
      }
    };
  }, [reference, setBounds, setScrollY]);

  const k = ['input-options'];
  const s = {};

  if (align === 'right') {
    s.left = bounds.right;
    k.push('right');
  } else {
    s.left = bounds.left;
    k.push('left');
  }
  if (position === 'top') {
    s.top = bounds.top;
    k.push('top');
  } else {
    s.top = bounds.bottom;
    k.push('bottom');
  }
  if (fixed) {
    k.push('fixed');
  } else {
    s.top += scrollY;
  }

  const so = {
    width: bounds.right - bounds.left,
  };

  return (
    <div className={k.join(' ')} style={s}>
      <div className="options-container" style={so}>
        {children}
      </div>
    </div>
  );
};

const preventDefault = (e) => {
  e.preventDefault();
};

const Option = ({close, reference, setValue, value, selected, children}) => {
  const handler = useCallback(() => {
    setValue(value);
    close();
    reference.current.blur();
  }, [close, reference, setValue, value]);

  const k = [];
  if (selected) {
    k.push('selected');
  }

  return (
    <div className={k.join(' ')} onMouseDown={preventDefault} onClick={handler}>
      {children}
    </div>
  );
};

const SelectValue = ({rmValue, value}) => {
  const handler = useCallback(() => {
    rmValue(value);
  }, [rmValue, value]);

  return (
    <span className="select-value" onClick={handler}>
      <Chip>
        {value} <FaIcon icon="times" />
      </Chip>
    </span>
  );
};

const Select = ({
  id,
  type,
  name,
  value,
  multiple,
  onChange,
  align,
  position,
  fixed,
  dropdowninput,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [hidden, setHidden] = useState(true);
  const [index, setIndex] = useState(0);
  const optelem = useRef(null);

  const setHiddenHandler = useCallback(() => {
    setHidden(true);
    setIndex(0);
  }, [setHidden, setIndex]);

  const setVisibleHandler = useCallback(() => {
    setHidden(false);
    setIndex(0);
  }, [setHidden, setIndex]);

  const rmValue = useCallback(
    (v) => {
      const k = new Set(value);
      k.delete(v);
      onChange(name, Array.from(k).sort());
    },
    [onChange, name, value],
  );

  const setValueMultiple = useCallback(
    (v) => {
      const k = new Set(value);
      k.add(v);
      onChange(name, Array.from(k).sort());
      setSearchVal('');
      onChange('_search_' + name, '');
    },
    [setSearchVal, onChange, name, value],
  );

  const setValueSingle = useCallback(
    (v) => {
      onChange(name, v);
    },
    [onChange, name],
  );

  const setValue = multiple ? setValueMultiple : setValueSingle;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        setIndex((i) => {
          let k = i + 1;
          if (k > dropdowninput.length - 1 || k < 0) {
            k = 0;
          }
          return k;
        });
      } else if (e.key === 'ArrowUp') {
        setIndex((i) => {
          let k = i - 1;
          if (k < 0 || k > dropdowninput.length - 1) {
            k = dropdowninput.length - 1;
          }
          return k;
        });
      } else if (e.key === 'Enter') {
        if (dropdowninput.length > 0 && !hidden) {
          let k = index;
          if (k < 0 || k > dropdowninput.length - 1) {
            k = 0;
          }
          setValue(dropdowninput[k].value);
          setHidden(true);
          setIndex(0);
        }
      }
    },
    [setIndex, setHidden, setValue, dropdowninput, index, hidden],
  );

  const handleChange = useCallback(
    (e) => {
      if (hidden) {
        setHidden(false);
      }
      if (multiple) {
        setSearchVal(e.target.value);
        onChange('_search_' + name, e.target.value);
      } else {
        onChange(name, e.target.value);
      }
    },
    [setHidden, setSearchVal, onChange, name, multiple, hidden],
  );

  const k = [];
  if (multiple && Array.isArray(value) && value.length > 0) {
    k.push('shift');
  }

  return (
    <Fragment>
      {optelem.current &&
        !hidden &&
        ReactDOM.createPortal(
          <OptionsContainer
            align={align}
            position={position}
            fixed={fixed}
            reference={optelem}
          >
            {dropdowninput.map((i, idx) => (
              <Option
                key={i.value}
                close={setHiddenHandler}
                reference={optelem}
                setValue={setValue}
                value={i.value}
                selected={index === idx}
              >
                {i.value}
              </Option>
            ))}
          </OptionsContainer>,
          document.body,
        )}
      {multiple && (
        <span>
          {Array.isArray(value) &&
            value.map((i) => (
              <SelectValue key={i} rmValue={rmValue} value={i} />
            ))}
        </span>
      )}
      <input
        ref={optelem}
        id={id}
        className={k.join(' ')}
        type={type}
        name={name}
        value={multiple ? searchVal : value}
        onChange={handleChange}
        placeholder=" "
        onFocus={setVisibleHandler}
        onBlur={setHiddenHandler}
        onKeyDown={handleKeyDown}
      />
    </Fragment>
  );
};

const Input = ({
  type,
  name,
  value,
  onChange,
  onEnter,
  label,
  info,
  error,
  valid,
  dropdown,
  multiple,
  dropdowninput,
  textarea,
  toggle,
  accept,
  capture,
  checked,
  wide,
  fullWidth,
}) => {
  const id = useMemo(randomID, []);

  const context = useContext(FormContext);
  if (context) {
    if (context.formState) {
      if (type === 'radio' || type === 'checkbox') {
        checked = checked || context.formState[name];
      } else {
        value = value || context.formState[name];
      }
    }
    onChange = onChange || context.onChange;
    if (!textarea && !dropdowninput) {
      onEnter = onEnter || context.onEnter;
    }
    if (context.error) {
      error = error || context.error[name];
    }
    if (context.valid) {
      valid = valid || context.valid[name];
    }
  }

  const changeFunc = useMemo(() => {
    if (!onChange) {
      return () => {};
    }
    return onChange;
  }, [onChange]);

  const handleChange = useMemo(() => {
    switch (type) {
      case 'file':
        return (e) => {
          if (e.target.files.length < 1) {
            changeFunc(name, undefined);
          } else {
            changeFunc(name, e.target.files[0]);
          }
        };
      case 'checkbox':
        return (e) => {
          changeFunc(name, e.target.checked);
        };
      default:
        return (e) => {
          changeFunc(name, e.target.value);
        };
    }
  }, [type, name, changeFunc]);

  const handleEnter = useMemo(() => {
    if (!onEnter) {
      return () => {};
    }
    return (e) => {
      if (e.key === 'Enter') {
        onEnter();
      }
    };
  }, [onEnter]);

  const k = ['input'];

  if (valid) {
    k.push('valid');
  } else if (error) {
    k.push('invalid');
  }

  switch (type) {
    case 'file':
    case 'radio':
    case 'checkbox':
      k.push(type);
      break;
    default:
      k.push('normal');
  }

  if (toggle) {
    k.push('toggle');
  }

  if (wide) {
    k.push('wide');
  } else if (fullWidth) {
    k.push('full-width');
  }

  let inp = null;
  if (dropdowninput && Array.isArray(dropdowninput)) {
    inp = (
      <Select
        id={id}
        type={type}
        name={name}
        value={value}
        multiple={multiple}
        onChange={changeFunc}
        dropdowninput={dropdowninput}
      />
    );
  } else if (dropdown && Array.isArray(dropdown)) {
    inp = (
      <select
        id={id}
        value={value}
        multiple={multiple}
        onChange={handleChange}
        onKeyDown={handleEnter}
      >
        {dropdown.map((i) => (
          <option key={i.value} value={i.value}>
            {i.text}
          </option>
        ))}
      </select>
    );
  } else if (textarea) {
    inp = (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleEnter}
        placeholder=" "
      />
    );
  } else {
    switch (type) {
      case 'file':
        inp = (
          <input
            id={id}
            type={type}
            name={name}
            onChange={handleChange}
            onKeyDown={handleEnter}
            accept={accept}
            capture={capture}
            placeholder=" "
          />
        );
        break;
      case 'radio':
        inp = (
          <input
            id={id}
            type={type}
            name={name}
            value={value}
            checked={checked === value}
            onChange={handleChange}
            onKeyDown={handleEnter}
            placeholder=" "
          />
        );
        break;
      case 'checkbox':
        inp = (
          <input
            id={id}
            type={type}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            onKeyDown={handleEnter}
            placeholder=" "
          />
        );
        break;
      default:
        inp = (
          <input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            onKeyDown={handleEnter}
            placeholder=" "
          />
        );
    }
  }

  let errDisplay = false;
  if (typeof error !== 'boolean') {
    errDisplay = true;
  }

  return (
    <div className={k.join(' ')}>
      {inp}
      <label htmlFor={id}>{label}</label>
      {dropdown && <div className="dropdown-arrow" />}
      {!error && info && <span className="info">{info}</span>}
      {error && (
        <span className="error">
          {!errDisplay && info}
          {errDisplay && error}
        </span>
      )}
    </div>
  );
};

const useForm = (initState = {}) => {
  const [formState, setFormState] = useState(initState);
  const updateForm = useCallback(
    (name, val) =>
      setFormState((prev) => Object.assign({}, prev, {[name]: val})),
    [setFormState],
  );
  return [formState, updateForm];
};

const matchChars = (from, to) => {
  let j = 0;
  for (let i = 0; i < from.length; i++) {
    while (j < to.length && to[j] !== from[i]) {
      j++;
    }
    if (j >= to.length) {
      return false;
    }
    j++;
  }
  return true;
};

const fuzzyFilter = (count, options, map, search = '') => {
  const s = search.toLowerCase();
  const matches = [];
  for (let i = 0; i < options.length && matches.length < count; i++) {
    const k = options[i];
    if (matchChars(s, map(k).toLowerCase())) {
      matches.push(k);
    }
  }
  return matches;
};

export {Input, useForm, fuzzyFilter, Form, Input as default};
