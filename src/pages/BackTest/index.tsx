import { useEffect } from 'react';
import { useRef } from '../../store/Store';
import { store } from '../index';
import { LoadOpenApi } from './data';


import NavHeader from '../../components/NavHeader'

export default function BackTest() {

  const openApi = useRef(store, (state) => state.backTest.openApi);
  const heading = useRef(store, (state) => state.backTest.heading);

  useEffect(() => {
    store.emit(new LoadOpenApi());
  }, []);

  return (
  <>
    <NavHeader />
    <h1>{ heading }</h1>
    {
      openApi
        ? <h2>Hola { openApi.info.title }</h2>
        : <p>Cargando...</p>
    }
  </>
  );
}
