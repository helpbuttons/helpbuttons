import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "components/map/LeafletMap";
import { Store } from "store/Store";
import { Event } from "store/Event";
import List from "components/list/List";
import NavHeader from "components/nav/NavHeader"; //just for mobile
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

//Current user session object
export interface UserState {
  username: string,
  email: string,
  realm: string,
  roles: [],
}

export interface CurrentUserState {
  token: any,
}

//No logged user  values
export const userInitial = {
  username: "",
  email: "",
  realm: "",
  roles: [],
}

//No logged user  values
export const currentUserInitial = {
  token: "",
}

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

  currentUser: CurrentUserState;
  user: UserState;
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

  currentUser: currentUserInitial,
  user: userInitial,
  backTest: backTestInitial,

});

const Home: NextPage = () => {
  return (

      <div className="index__container">
        <NavHeader />
        <Map />
      </div>

  );
};

export default Home;
