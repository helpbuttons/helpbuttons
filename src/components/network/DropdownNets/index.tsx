//a variation of dropddown specific for time
import { useState } from "react";


export default function DropdownNets({networks, ...props}) {

  let networksArray = networks.length > 0 ? networks[0] : networks;

  const options = networksArray.map((net, i) => (

      <option className="dropdown-nets__dropdown-option" label={net.name} value={net.name}>{net.name}</option>

  ));

  console.log(options);

  return (

    <>
      <input className="dropdown-nets__dropdown-trigger dropdown__dropdown" autoComplete="off" list="" id="input" name="browsers" placeholder="Select other Network" type='text'></input>
      <datalist className="dropdown-nets__dropdown-content" id='listid'>
        {options}
      </datalist>
    </>


  );
}
