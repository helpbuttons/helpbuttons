///dropddown selector component
import React from 'react';

type DropdownProps = {
  label?:string,
  listOption: {
    name: string;
    obj: any;
    onClick?: () => void;
  }[];
};
class Dropdown extends React.Component<DropdownProps> {
  constructor(props: DropdownProps) {
    super(props);
    this.state = { obj: null };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedIndex = e.target.value;
    const selectedOption = this.props.listOption[selectedIndex];
    this.setState({ obj: selectedOption.obj });

    if (selectedOption.onClick) {
      selectedOption.onClick();
    }
  }

  render() {
    const { label } = this.props;

    return (
      <>
        {label && <div className="form__label">{label}</div>}
        <select className='dropdown-select__trigger' onChange={this.handleChange}>
          {this.props.listOption.map((option, index) => (
            <option className='dropdown-select__option' key={index} value={index} selected={option.selected}>
              {option.name}
            </option>
          ))}
        </select>
      </>
      
    );
  }
}

export default Dropdown;
