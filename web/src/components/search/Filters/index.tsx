//Filters is the component under the search bar sectioon of the home page and other pages. It consist of several items all with btn-fillter class, and its parts can be altered by the btn templates of the selected network.

import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';

//if the filters are too many, it ddisplays a "more filters" option at the end that brings the PopupExtraFilters

export default function Filters({ setSelectedTypes }) {
  const buttonTypeChanged = (e) => {
    const buttonTypeName = e.target.value;
    const value = e.target.checked;

    setSelectedTypes((prevSelected) => {
      let newSelected = prevSelected.filter((selected) =>  buttonTypeName != selected)
      if (value == true) {
        newSelected.push(buttonTypeName)
        return Array.from(new Set(newSelected));
      }
      return Array.from(new Set(newSelected))
    });
  };

  return (
    <div className="filters">
      <div className="checkbox-filter__container">
        {buttonTypes.map((buttonType) => (
          <label
            key={buttonType.name}
            className="checkbox__filter-label"
          >
            <input
              type="checkbox"
              className="checkbox-filter__checkbox"
              id="input-tos"
              defaultChecked={true}
              value={buttonType.name}
              onChange={buttonTypeChanged}
            ></input>
            <div className="checkbox-filter__content btn-filter-with-icon">
              <div
                style={buttonColorStyle(buttonType.cssColor)}
                className="btn-filter__icon"
              ></div>
              <div className="checkbox__text">
                {buttonType.caption}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* 
        <select className="dropdown__filter">
          <option value="status" className="dropdown-select__option">Status changes</option>
          <option value="status" className="dropdown-select__option">All comments</option>
          <option value="status" className="dropdown-select__option">Other users comments</option>
          <option value="status" className="dropdown-select__option">Telegram messages</option>
          <option value="status" className="dropdown-select__option">All interactions</option>
          <option value="status" className="dropdown-select__option">Other buttons interactions</option>
          <option value="status" className="dropdown-select__option">My buttons interactions</option>
        </select> */}
    </div>
  );
}
