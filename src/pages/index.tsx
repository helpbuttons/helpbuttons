import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "../components/LeafletMap";
import { Store } from "../store/Store";
import { Event } from "../store/Event";
import List from "../layouts/List";
import NavBottom from "../components/NavBottom"; //just for mobile
import NavHeader from "../components/NavHeader"; //just for mobile
import FiltersMobile from "../components/FiltersMobile"; //just for mobile
import HeaderInfoOverlay from "../components/HeaderInfoOverlay"; //just for mobile

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
      <NavHeader />
      <HeaderInfoOverlay />
      <FiltersMobile />
      <Map />
      <NavBottom />
    </>
  );
};

export default Home;
