///dropddown selector component
import React, { useState } from 'react';

export function Dropdown({
  label = null,
  options,
  onChange = (value) => {},
  defaultSelected = null,
}) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = (e) => {
    const selectedIndex = e.target.value;
    setSelected(selectedIndex);
    console.log(selectedIndex);
    onChange(selectedIndex);
  };

  return (
    <>
      {label && <div className="form__label">{label}</div>}
      <select
        className="dropdown-select__trigger"
        onChange={handleChange}
      >
        {options.map((option, index) => {
          if (option.value === selected) {
            return (
              <option
                className="dropdown-select__option"
                key={index}
                value={option.value}
                selected
              >
                {' '}
                {option.name}
              </option>
            );
          } else {
            return (
              <option
                className="dropdown-select__option"
                key={index}
                value={option.value}
              >
                {' '}
                {option.name}
              </option>
            );
          }
        })}
      </select>
    </>
  );
}
