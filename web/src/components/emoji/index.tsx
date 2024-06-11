import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import PickerField from 'components/picker/PickerField'
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn'
import { useEffect, useState } from "react"
import { useToggle } from 'shared/custom.hooks'
import { getLocale } from 'shared/sys.helper'

export function EmojiPicker({updateEmoji, pickerEmoji, label, explain})
{
    const [showPopup, setShowPopup] =  useState(false)

    const closePopup = () => setShowPopup(() => false)
    const openPopup = () => setShowPopup(() => true)
    const [emoji, setEmoji] = useState(null)
    useEffect(() => {
        if(emoji){
            updateEmoji(emoji)
        }
    }, [emoji])
    return (
        <PickerField       
        label={label} 
        explain={explain} 
        btnLabel={pickerEmoji ? pickerEmoji : emoji} 
        showPopup={showPopup} 
        openPopup={openPopup} 
        closePopup={closePopup}>
             <Picker data={data} onEmojiSelect={(emoji) => {setEmoji(() => emoji.native);console.log('close popup..'); closePopup()}} locale={getLocale()} noCountryFlags={true} emojiSize={16} theme="light"/>
        </PickerField>
    )
}