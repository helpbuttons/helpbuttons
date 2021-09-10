//a variation of menuselect specific for time
import { useState } from "react";




// -- componente sumador --
export class Resetear implements UpdateEvent {
  public update(state: object): object {
    return produce(state, draft => {
      draft.sumador.valor = 0;
    });
  }
}


export class Sumar implements UpdateEvent {
  public constructor(private valor: int) {}

  public update(state: object): object {
    return produce(state, draft => {
      draft.sumador.valor += this.valor;
    });
  }
}

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
