import { useEffect } from 'react';
import { useRef } from 'store/Store';
import { store } from 'pages/index';
import { LoadCommonNetworks } from './data';


import NavHeader from 'components/nav/NavHeader'

export default function BackTest() {

  const selectedNetwork = useRef(store, (state) => state.common.selectedNetwork);
  const networks = useRef(store, (state) => state.common.networks);

  useEffect(() => {
    store.emit(new LoadCommonNetworks());
  }, []);

  return (
  <>
    <NavHeader />
    <h1>Common Store Variables</h1>
    <h2>Selected Network</h2>
    {
      selectedNetwork
        ? <h2>Hi this is the selected network { selectedNetwork.id }</h2>
        : <p>Cargando...</p>
    }
    <h2>Networks</h2>
    {
      networks
        ? <h2>This is the number of created networks { networks.length }</h2>
        : <p>Cargando...</p>
    }

  </>
  );
}
