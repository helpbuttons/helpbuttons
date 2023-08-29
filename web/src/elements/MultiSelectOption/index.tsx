import FieldError from 'elements/Fields/FieldError';
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { IoCheckmark } from 'react-icons/io5';
type IconType = 'cross' | 'red' | 'check';

export function MultiSelectOptionIcon({checked, icon }: { icon: IconType, checked:boolean }) {
  switch (icon) {
    case 'cross':
      return (
        <div className="checkbox__icon">
          <IoClose />
        </div>
      );
    case 'check':
    return (
      <div className="checkbox__icon">
        { checked && <IoCheckmark />}
      </div>
    );
    case 'red':
      return <div className="btn-filter__icon"></div>;
    default:
      return null;
  }
}

export default function MultiSelectOption({
  defaultValue,
  name,
  handleChange = (name: string, value: any) => {},
  children,
  icon,
  ref,
}: {
  defaultValue: boolean;
  name: string;
  handleChange?: (name: string, value: any) => void;
  children: any;
  icon: IconType;
  ref: any;
}) {
  const [checked, setChecked] = useState<boolean>(defaultValue);

  const onChange = () => {
    setChecked((prevValue) => !prevValue);
    handleChange(name, !checked);
  };

  return (
    <div className="checkbox">
      <label className="checkbox__label">
        <input
          type="checkbox"
          className="checkbox__checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          ref={ref}
        ></input>
        <div
          className={`checkbox__content ${checked ? 'checked' : ''}`}
        >
          <MultiSelectOptionIcon checked={checked} icon={icon}/>
          {children}
        </div>
      </label>
    </div>
  );
}