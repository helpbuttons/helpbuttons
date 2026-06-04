import { useEffect, useState } from 'react';
import { DropdownSearch } from 'elements/Dropdown/DropdownSearch';
import t from 'i18n';

export function TimePickInput({defaultDateTime, handleChange}) {
  const [results, setResults] = useState([])
  const [invalid, setInvalid] = useState(false)

  const dateToTime = (date) => {
    if(date){
      return `${date.getHours()}:${ String(date.getMinutes()).padStart(2, '0')}`
    }
    return ''
  }
  const defaultTime = dateToTime(defaultDateTime);
  const [input, setInput] = useState(defaultTime)

  const timeRegex = /^([01]?\d|2[0-3])(:([0-5]?\d?)?)?$/gm;

  const getTimes = (hours: number, minutes: number) => {
    const results = []

    const maximumHours = (hours+5) < 24 ? hours+5 : 23;
    for (let i = hours; i <= maximumHours; i++) {
      if(!minutes || minutes < 1 || i != hours)
      {
        results.push(
          {label: i + ':00', value: {hour: Number(i), minutes: 0}}
        )
      }
      if(!minutes || (minutes < 31 && i != hours))
        {
          results.push(
            {label: i + ':30', value: {hour: Number(i), minutes: 30}}
          )
      }
    }    
    return results
  }
  const getHours = (input) => {
    return input.substring(0,2)
  }

  const getMinutes = (input) => {
    return input.substring(3,5)
  }

  const timesToPickList = (input) => {
    const found = input.match(timeRegex)
    if(found)
    {
      setInvalid(() => false)
      const hours = getHours(input)
      const minutes = getMinutes(input)
      return getTimes(hours, minutes)
    }
    if(!input)
    {
      setInvalid(() => false)
      return []
    }
    setInvalid(() => true)
    
    return []
  }

  const toDate = (newTime) => {
    const newDate = new Date()
    newDate.setHours(newTime.value.hour)
    newDate.setMinutes(newTime.value.minutes)
    return newDate;
  }

  const setSelected = (timeSelected) => {
    setInput(() => timeSelected.label)
    setResults(() => [])
    handleChange(toDate(timeSelected))
  }
  useEffect(() => {
    if(!input)
    {
      return;
    }
    if(!invalid && input.length == 5)
    {
      return;
    }
    setResults(() => timesToPickList(input))
  }, [input])

  const handleBlur = (input) => {
    if(!input)
    {
      return;
    }
    if(!invalid && input.length == 5)
    {
      setResults(() => [])
      return;
    }
    if(results.length > 0){
      setSelected(results[0])
      setResults(() => [])
    }
  }

  const handleSelected = (timeSelected) => {
    setSelected(timeSelected)
  }

  const handleFocus = () => {
    if(!input && !invalid)
    {
      const now = new Date()
      setInput(() => `${now.getHours()}`)
    }
    if(!invalid)
    {
      setResults(() => timesToPickList(input.substring(0,2)))
    }
  }

  return <span>
          <DropdownSearch input={input} setInput={setInput} results={results} handleSelected={handleSelected} handleBlur={handleBlur} handleFocus={handleFocus}/>
          {invalid && <span>invalid</span>}
        </span>
}

export function TimeRangePicker({defaultStart, defaultEnd, handleChangeStart, handleChangeEnd}) {
  return (
      <div className='picker__hours'>
            <TimePickInput defaultDateTime={defaultStart}
              handleChange={(value) => handleChangeStart(value)} /> <span className='picker__hours-dash'>-</span>
            <TimePickInput defaultDateTime={defaultEnd}
              handleChange={(value) => handleChangeEnd(value)} />
      </div>
      
  )
}