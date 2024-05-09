import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useEffect, useState } from "react"
import { useToggle } from 'shared/custom.hooks'
import { getLocale } from 'shared/sys.helper'

export function EmojiPicker({updateEmoji = (emoji) => { console.log(emoji)}, pickerEmoji = null, label, explain})
{
    const [showPicker, toggleShowPicker] = useToggle(false);
    const [emoji, setEmoji] = useState(null)
    useEffect(() => {
        if(emoji){
            updateEmoji(emoji)
        }
    }, [emoji])
    return (<>
        {label && <label className="form__label">{label}</label>}
        {explain && 
            <p className="form__explain">{explain}</p>
        }
        <p className="emoji-picker" onClick={() => {toggleShowPicker(!showPicker)}}>{pickerEmoji ? pickerEmoji : emoji}</p>
            {showPicker && 
                <Picker data={data} onEmojiSelect={(emoji) => {setEmoji(() => emoji.native);toggleShowPicker(false)}} locale={getLocale()} noCountryFlags={true} emojiSize={16} theme="light"/>
            }
        </>
    )
}