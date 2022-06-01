import DropdownComp from "components/dropdown";
import DropdownOption from "components/dropdown/option";
import { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { alertService } from "services/Alert";

//services
import { NetworkService } from "services/Networks";
import { INetwork } from "services/Networks/network.type";
import { setSelectedNetwork, setValueAndDebounce } from "./data";

const timeInMsBetweenStrokes = 200;

export default function DropdownNetworks({ ...props }) {
  const [options, setOptions] = useState([]);

  const [sub, setSub] = useState(new Subject()); //evita la inicializaacion en cada renderizado
  const [sub$, setSub$] = useState(
    setValueAndDebounce(sub, timeInMsBetweenStrokes)
  ); //para no sobrecargar el componente ,lo delegamos a una lib externa(solid);

  const onChange = (event) => {
    //console.log(event.target.value);
    sub.next(event.target.value);
  };

  useEffect(() => {
    let s = sub$.subscribe(
      (rs: any) => {
        setOptions(
          rs.response.map((net) => {
            return (
              <DropdownOption key={net.id} label={net.name} value={net.id} />
            );
          })
        );
      },
      (e) => {
        console.log("error subscribe", e);
      }
    );
    return () => {
      s.unsubscribe(); //limpiamos
    };
  }, []); //first time

  const setValue = (networkId, networkName) => {
    // const networkId = e.target.attributes.data_id.nodeValue;
    // const networkName = e.target.attributes.label.nodeValue;
    setSelectedNetwork(networkId);
    alertService.info(
      "You're using the network '" + networkName + "' network !"
    );
  };
  return (
    <>
      <DropdownComp
        setValue={setValue}
        bubbleChange={onChange}
        options={options}
        placeholder="Search other Network"
      ></DropdownComp>
    </>
  );
}
