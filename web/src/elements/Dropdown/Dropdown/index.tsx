///dropdown selector component
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import React, { useState } from 'react';
import { IoList } from 'react-icons/io5';
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
  className = 'dropdown__dropdown-trigger',
  value = null
}) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = (e) => {
    const selectedIndex = e.target.value;
    setSelected(selectedIndex);
    onChange(selectedIndex);
  };

  let selectAttrs = {
    className: `${className} dropdown-select-with-icon`,
    onChange: handleChange,
    defaultValue: defaultSelected,
  }
  if(!defaultSelected)
  {
    selectAttrs = {
      className: `${className} dropdown-select-with-icon`,
      onChange: handleChange,
      defaultValue: false,
    }
  }
  return (
    <div className="dropdown-select__container">
      <IoList className="dropdown-select__icon" />
      <select {...selectAttrs}>
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
    </div>
  );
}


export function DropdownLine(props){
  const {options, onChange} = props

  return (<>
  {options.map((option, index) => (
          <Btn 
          key={index}
          btnType={BtnType.splitIcon}
          contentAlignment={ContentAlignment.left}
          caption={option.name}
          onClick={() => onChange(option.value)}
        />
        ))}
  
  </>)
}