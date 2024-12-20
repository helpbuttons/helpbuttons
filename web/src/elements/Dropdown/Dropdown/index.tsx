///dropddown selector component
import React, { useState } from 'react';
export function DropdownField({
  label = null,
  options,
  onChange = (value) => {},
  defaultSelected = null,
  explain = '',
  className = 'dropdown__dropdown-trigger',
  value = null
}) {
  return (
    <div className='form__field'>
      {label && <label className="form__label"> {label}</label>}
      {explain && <p className="form__explain">{explain}</p>}
      <Dropdown className={className} options={options} onChange={onChange} defaultSelected={defaultSelected} value={value}/>
    </div>
  );
}
export function Dropdown({
  options,
  onChange = (value) => {},
  defaultSelected = null,
  explain = '',
  className = 'dropdown-select__trigger',
  value = null
}) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = (e) => {
    const selectedIndex = e.target.value;
    setSelected(selectedIndex);
    onChange(selectedIndex);
  };

  let selectAttrs = {
    className: className,
    onChange: handleChange,
    defaultValue: defaultSelected,
  }
  if(!defaultSelected)
  {
    selectAttrs = {
      className: className,
      onChange: handleChange,
      value: value,
    }
  }
  return (
    <>
      <select
        {...selectAttrs}
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
