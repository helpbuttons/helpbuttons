import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "../components/LeafletMap/index";

import Header from "../components/Header";
import styles from "../styles/Home.module.scss";

import Search from "../components/Search";
import Posts from "../components/Posts";
import Filters from "../components/Filters";

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
        <Search />
        <Filters />
        <Posts />
      </div>
      <Map />
    </>
  );
};

export default Home;
