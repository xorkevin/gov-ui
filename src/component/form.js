import React, {useState, useCallback, useMemo} from 'react';
import {randomID} from 'utility';

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
  textarea,
  accept,
  capture,
  checked,
  wide,
  fullWidth,
}) => {
  const id = useMemo(randomID, []);

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
  if (dropdown) {
    inp = (
      <select
        id={id}
        value={value}
        multiple={multiple}
        onChange={handleChange}
        onKeyPress={handleEnter}
      >
        {Array.isArray(dropdown) &&
          dropdown.map((i) => {
            return (
              <option key={i.value} value={i.value}>
                {i.text}
              </option>
            );
          })}
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

  return (
    <div className={k.join(' ')}>
      {inp}
      <label htmlFor={id}>{label}</label>
      {dropdown && <div className="dropdown-arrow" />}
      {!error && info && <span className="info">{info}</span>}
      {error && <span className="error">{error}</span>}
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

export {Input, useForm, Input as default};
