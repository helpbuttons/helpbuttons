import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
type IconType = 'cross' | 'red';

export function CheckBoxIcon({ icon }: { icon: IconType }) {
  switch (icon) {
    case 'cross':
      return (
        <div className="checkbox__icon">
          <IoClose />
        </div>
      );
    case 'red':
      return <div className="btn-filter__icon red"></div>;
    default:
      return null;
  }
}

export default function CheckBox({
  defaultValue,
  name,
  handleChange = (name: string, value: any) => {},
  children,
}: {
  defaultValue: boolean;
  name: string;
  handleChange?: (name: string, value: any) => void;
  children: any;
}) {
  const [checked, setChecked] = useState<boolean>(defaultValue);

  const onChange = () => {
    setChecked(() => !checked);
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
        ></input>
        <div
          className={`checkbox__content ${checked ? 'checked' : ''}`}
        >
          {children}
        </div>
      </label>
    </div>
  );
}
