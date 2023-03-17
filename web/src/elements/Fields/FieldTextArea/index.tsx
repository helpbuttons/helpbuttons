import React, { useState } from "react";
import FieldError from "../FieldError";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { SearchIndex } from 'emoji-mart'

interface IFieldTextArea {
  label: string,
  onChange: Function,
  name: string,
  validationError: any,
  placeholder: string,
  classNameExtra?: string
}


export const FieldTextArea = React.forwardRef(({
    label,
    onChange,
    name,
    validationError,
    placeholder,
    classNameExtra,
    watch,
    setValue,
    setFocus
}, ref): IFieldTextArea => {

  const [foundEmojies, setFoundEmojies] = useState([])


  const handleChange = (event) => {
    // onChange()
    return;
    
    const firstDoublePoint = event.target.value.search(":") ;
    const countDoublePoint = event.target.value.split(":") ;
    const cursorPosition = event.target.selectionEnd

    if (firstDoublePoint > 0 && countDoublePoint.length % 2 == 0) {
      const searchString = countDoublePoint[countDoublePoint.length-1];
      if (searchString) 
      {
        const emojis = SearchIndex.search(searchString).then((emojies ) => {
          if (emojies && emojies.length > 0)
          {
            setFoundEmojies(emojies)
          }else {
            setFoundEmojies([])
          }
            
        })
      }else {
        setFoundEmojies([])
      }
    }else {
      setFoundEmojies([])
    }
  }
  const addEmojiToMessage = (emoji) => {
    const inputField = 'message';
    const message = watch(inputField)
    // console.log(emoji)
    setValue(inputField, `${message}:${emoji.id}:`)
    setFocus(inputField, { shouldSelect: false })
  }

    return (
      <>
      <div className="form__field">
        <p className="popup__paragraph">{label}</p>
        {/* {JSON.stringify(foundEmojies)} */}
        {foundEmojies.map((emoji, idx) => {
          
          return (<p>{emoji.id} - {emoji.skins[0].native}</p>)
        })
        }
        <textarea
          onChange={handleChange}
          name={name}
          className={`${classNameExtra} textarea__textarea`}
          placeholder={placeholder}
          ref={ref}
        ></textarea>
        
        <Picker data={data} onEmojiSelect={addEmojiToMessage} />

        <FieldError validationError={validationError} />
      </div>
    </>
    );
});


