import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "../components/LeafletMap";
import { Store } from "../store/Store";
import { Event } from "../store/Event";
import List from "../layouts/List";
import NavBottom from "../components/NavBottom"; //just for mobile
import NavHeader from "../components/NavHeader"; //just for mobile

//    Components
import HeaderDesktop from "../layouts/HeaderDesktop";

import { BackTestState, backTestInitial } from "../pages/BackTest/data";

import ButtonDataService from "services/Buttons";

import { userService, authenticationService } from '../services';


// https://immerjs.github.io/immer/
// Para simplificar la modificación de estructuras de datos
// al estilo "immutable objects"
import produce from 'immer';


// -- estado global --

export interface GlobalState {
  network: {
    id: number;
  }
  sumador: {
    valor: number;
  }
  gente: {
    cargando: boolean;
    listado: object[];
  }
  backTest: BackTestState;
}


export const store = new Store<GlobalState>({

  network: {
    id: 0,
  },
  sumador: {
    valor: 0,
  },
  gente: {
    cargando: false,
    listado: [],
  },
  backTest: backTestInitial,

});

const Home: NextPage = () => {
  return (
    <>
      <NavHeader />
      <List />
      <Map />
      <NavBottom />
    </>
  );
};

export default Home;
