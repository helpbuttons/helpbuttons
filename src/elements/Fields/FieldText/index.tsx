
// const handleChange = (event) => {
//     console.log('aim')
//     console.log(event.target.value)

import React from "react";

    
//     if(event.target.type == 'checkbox') {
//       console.log(event)
//       console.log(event.target.name)
//       console.log('values: ' + values[event.target.name])
//       // setNetworkData({ ...values, [event.target.name]: event.target.value });
//       return;
//     }
//     setNetworkData({ ...values, [event.target.name]: event.target.value });
//   };

export default function FieldText({
    label,
    defaultvalue,
    handleChange,
    name,
    validationError
}) {
    const [value, setValue] = React.useState(false);

    const onChange = (e) => {
        setValue(e.target.value);
        handleChange(name, e.target.value);
      };

    return (
        <div className="form__field">
        <label className="label">{label}</label>
            <input 
                      name={name} 
                      type="text"
                      onChange={onChange}
                      className={`form__input ${validationError ? 'validation-error' : ''}`} 
                    />
         {validationError}
        </div>
    );
}
