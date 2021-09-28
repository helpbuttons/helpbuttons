import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "../components/map/LeafletMap";
import { Store } from "../store/Store";
import { Event } from "../store/Event";
import List from "../components/list/List";
import NavBottom from "../components/nav/NavBottom"; //just for mobile
import NavHeader from "../components/nav/NavHeader"; //just for mobile
import { userService } from 'services/Users';
import { Link } from 'elements/Link';

//    Components
import HeaderDesktop from "../layouts/HeaderDesktop";

import { BackTestState, backTestInitial } from "../pages/BackTest/data";

import ButtonDataService from "services/Buttons";

import { authenticationService } from 'services';


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
  user: {
    id: number,
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
  user: {
    id: 0,
  },
  backTest: backTestInitial,

});

const Home: NextPage = () => {
  return (
    <>

      <h1>Hi {userService.userValue?.firstName}!</h1>
      <p>You&apos;re logged in with Next.js & JWT!!</p>
      <p><Link href="/users">Manage Users</Link></p>

      <NavHeader />
      <Map />
      <NavBottom />
    </>
  );
};

export default Home;
