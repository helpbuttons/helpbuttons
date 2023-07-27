import CheckBox from 'elements/Checkbox';
import React from 'react';
import { useState } from 'react';

export const FieldPrivacy = 
React.forwardRef(
  ({
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
    <div className="form__field">
      <p className="form__label">Privacy:</p>
      <p className="form__explain">Private networks can't be seen without login</p>

        <CheckBox
                      defaultValue={
                        false
                      }
                      name={isPrivate ? textPublic : textPrivate}
                      handleChange={() => {
                        changePrivacy();
                      }}
                    >
                      <div className="btn-filter__icon"></div>
                      <div className="btn-with-icon__text">
                         {isPrivate ? textPublic : textPrivate}
                      </div>
        </CheckBox>
    </div>
  );
});
