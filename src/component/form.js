import React, {useState, useMemo} from 'react';
import shortid from 'shortid';

const Input = ({
  type,
  value,
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
  onChange,
  onEnter,
  wide,
  fullWidth,
}) => {
  const id = useMemo(() => shortid.generate(), []);

  const handleChange = useMemo(() => {
    if (!onChange) {
      return () => {};
    }
    switch (type) {
      case 'file':
        return (event) => {
          if (event.target.files.length < 1) {
            onChange(undefined);
          } else {
            onChange(event.target.files[0]);
          }
        };
      case 'checkbox':
        return (event) => {
          onChange(event.target.checked);
        };
      default:
        return (event) => {
          onChange(event.target.value);
        };
    }
  }, [onChange, type]);

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

  if (type === 'file') {
    k.push('file');
  } else if (type === 'radio') {
    k.push('radio');
  } else if (type === 'checkbox') {
    k.push('checkbox');
  }

  if (wide) {
    k.push('wide');
  } else if (fullWidth) {
    k.push('full-width');
  }

  let inp = null;
  if (dropdown) {
    inp = (
      <select id={id} value={value} multiple={multiple} onChange={handleChange}>
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
            accept={accept}
            capture={capture}
            value={value}
            checked={checked}
            onChange={handleChange}
            onKeyPress={handleEnter}
            placeholder=" "
          />
        );
        break;
      case 'radio':
        inp = (
          <input
            id={id}
            type={type}
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

export default Input;
