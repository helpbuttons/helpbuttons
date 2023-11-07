///dropddown selector component
import React, { useState } from 'react';
export function DropdownField({
  label = null,
  options,
  onChange = (value) => {},
  defaultSelected = null,
  explain = '',
}) {
  return (
    <div className="form__field">
      <label className="form__label"> {label}</label>
      <p className="form__explain">{explain}</p>
      <Dropdown options={options} onChange={onChange} defaultSelected={defaultSelected}/>
    </div>
  );
}
export function Dropdown({
  label = null,
  options,
  onChange = (value) => {},
  defaultSelected = null,
  explain = '',
  className = 'dropdown-select__trigger',
}) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = (e) => {
    const selectedIndex = e.target.value;
    setSelected(selectedIndex);
    onChange(selectedIndex);
  };

  return (
    <>
      {label && <label className="form__label"> {label}</label>}
      {explain && 
            <p className="form__explain">{explain}</p>
      }
      <select
        className={className}
        onChange={handleChange}
        defaultValue={defaultSelected}
      >
        {options.map((option, index) => (
          <option
            className="dropdown-select__option"
            key={index}
            value={option.value}
          >
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
}
