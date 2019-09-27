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

  const k = ['fuzzyoptions'];
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

const FuzzySelect = ({
  id,
  type,
  name,
  value,
  onChange,
  onKeyPress,
  align,
  position,
  fixed,
  children,
}) => {
  const [hidden, setHidden] = useState(true);
  const optelem = useRef(null);

  const setHiddenHandler = useCallback(() => {
    setHidden(true);
  }, [setHidden]);

  const setVisibleHandler = useCallback(() => {
    setHidden(false);
  }, [setHidden]);

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
            {children}
          </OptionsContainer>,
          document.body,
        )}
      <input
        ref={optelem}
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder=" "
        onFocus={setVisibleHandler}
        onBlur={setHiddenHandler}
      />
    </Fragment>
  );
};

const FuzzyOption = ({onChange, name, value, children}) => {
  const setVal = useCallback(() => {
    if (onChange) {
      onChange(name, value);
    }
  }, [onChange, name, value]);
  // onMouseDown required to occur before onBlur
  return <div onMouseDown={setVal}>{children}</div>;
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
  fuzzyselect,
  textarea,
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
    if (!textarea && !fuzzyselect) {
      onEnter = onEnter || context.onEnter;
    }
    if (context.error) {
      error = error || context.error[name];
    }
    if (context.valid) {
      valid = valid || context.valid[name];
    }
  }

  const handleChange = useMemo(() => {
    if (!onChange) {
      return () => {};
    }
    switch (type) {
      case 'file':
        return (event) => {
          if (event.target.files.length < 1) {
            onChange(name, undefined);
          } else {
            onChange(name, event.target.files[0]);
          }
        };
      case 'checkbox':
        return (event) => {
          onChange(name, event.target.checked);
        };
      default:
        return (event) => {
          onChange(name, event.target.value);
        };
    }
  }, [type, name, onChange]);

  const handleEnter = useMemo(() => {
    if (!onEnter) {
      return () => {};
    }
    return (target) => {
      if (target.key === 'Enter') {
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

  if (wide) {
    k.push('wide');
  } else if (fullWidth) {
    k.push('full-width');
  }

  let inp = null;
  if (fuzzyselect) {
    inp = (
      <FuzzySelect
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onKeyPress={handleEnter}
      >
        {Array.isArray(fuzzyselect) &&
          fuzzyselect.map((i) => (
            <FuzzyOption
              key={i.value}
              onChange={onChange}
              name={name}
              value={i.value}
            >
              {i.value}
            </FuzzyOption>
          ))}
      </FuzzySelect>
    );
  } else if (dropdown) {
    inp = (
      <select
        id={id}
        value={value}
        multiple={multiple}
        onChange={handleChange}
        onKeyPress={handleEnter}
      >
        {Array.isArray(dropdown) &&
          dropdown.map((i) => (
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
        onKeyPress={handleEnter}
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
            onKeyPress={handleEnter}
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
            onKeyPress={handleEnter}
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
            onKeyPress={handleEnter}
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
            onKeyPress={handleEnter}
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

export {Input, useForm, Form, Input as default};
