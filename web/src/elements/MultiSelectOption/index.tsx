import FieldError from 'elements/Fields/FieldError';
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { IoCheckmark } from 'react-icons/io5';
type IconType = 'cross' | 'red' | 'check' | 'emoji';

export function MultiSelectOptionIcon({checked, icon, iconLink }: { icon: IconType, checked:boolean, iconLink:string }) {
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
    case 'emoji':
      return <div className="btn-with-icon__emoji">{iconLink}</div>;
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
  iconLink,
  ref,
  color,
}: {
  defaultValue: boolean;
  name: string;
  handleChange?: (name: string, value: any) => void;
  children: any;
  icon: IconType;
  ref: any;
  iconLink:string;
  color:string;
}) {
  const [checked, setChecked] = useState<boolean>(defaultValue);

  const onChange = () => {
    setChecked((prevValue) => !prevValue);
    handleChange(name, !checked);
  };

  return (
    <div className="checkbox" >
      <label className="checkbox__label">
        <input
          type="checkbox"
          className="checkbox__checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          ref={ref}
          style={{'background-color': 'red'} as React.CSSProperties}
        ></input>
        <div
          className={`checkbox__content ${checked ? 'checked' : ''}`}
          style={{'border-color': color} as React.CSSProperties}
        >
          <MultiSelectOptionIcon checked={checked} icon={icon} iconLink={iconLink} />
          {children}
        </div>
      </label>
    </div>
  );
}