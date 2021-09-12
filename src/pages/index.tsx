import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "../components/LeafletMap/index";
import { Store } from "../store/Store";
import { Event } from "../store/Event";

import styles from "../styles/Home.module.scss";

//    Components
import HeaderDesktop from "../layouts/HeaderDesktop";



import ButtonDataService from "services/Buttons";
// https://immerjs.github.io/immer/
// Para simplificar la modificación de estructuras de datos
// al estilo "immutable objects"
import produce from 'immer';

// -- estado global --
export const store = new Store({

  network: {
    id: 0,
  },
  sumador: {
    valor: 0,
  },
  gente: {
    cargando: false,
    listado: [],
  }

});

const Home: NextPage = () => {
  return (
    <>
      <HeaderDesktop />
      <Map />
    </>
  );
};

export default Home;
