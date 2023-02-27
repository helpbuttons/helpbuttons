import React from 'react';
import { useState } from 'react';


export const FieldPrivacy = React.forwardRef(({
  name,
  setValue,
  textPublic,
  textPrivate,
}, ref) => {

  const [isPrivate, setPrivate] = useState(false);
  const changePrivacy = () => {
    setPrivate(!isPrivate);
    setValue(name, !isPrivate ? 'private' : 'public')
  };
  return (
    <div className="checkbox">
      <label className="checkbox__label">
        <input type="checkbox" className="checkbox__checkbox" />
        <div
          className="checkbox__content "
          onClick={() => {
            changePrivacy();
          }}
        >
          <div className="checkbox__icon">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
            </svg>
          </div>
          <div className="checkbox__text">
            {isPrivate ? textPublic : textPrivate}
          </div>
        </div>
      </label>
    </div>
  );
});
