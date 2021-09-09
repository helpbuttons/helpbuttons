import { useState } from "react";

function NetPicker() {
  const [network, setNetwork] = useState("");

  console.log(network)

  return (
    <select 
      name="network" 
      onChange={(e) => setNetwork(e.target.value)}
    >
      <option value="1">red1</option>
      <option value="2">red2</option>
      <option value="3">red3</option>
    </select>
  );
}

export default NetPicker;
