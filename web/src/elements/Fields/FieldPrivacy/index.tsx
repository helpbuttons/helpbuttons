import CheckBox from 'elements/MultiSelectOption';
import React from 'react';
import { useState } from 'react';
import { FieldCheckbox } from '../FieldCheckbox';

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
   
    //revise to add new field type or change to use FieldCheckbox

  );
});
