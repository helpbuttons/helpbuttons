import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "../components/LeafletMap/index";
import { Store } from "../store/Store";
import Event from "../store/Event";

import Header from "../layouts/Header";
import styles from "../styles/Home.module.scss";

import HomeSearch from "../layouts/HomeSearch";
import ButtonList from "../layouts/ButtonList";
import ButtonFilters from "../layouts/ButtonFilters";

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
      <Header />
      <div style={{ position: 'absolute', zIndex: 1000 }}>
        <HomeSearch />
        <ButtonFilters />
        <ButtonList />
      </div>
      <Map />
    </>
  );
};

export default Home;
