import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Store } from "store/Store";
import { Event } from "store/Event";

//services
import { userService } from 'services/Users';
import ButtonDataService from "services/Buttons";
import { authenticationService } from 'services';

//    Components
import HomeInfo from "pages/HomeInfo";


import { BackTestState, backTestInitial } from "pages/BackTest/data";




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

      <HomeInfo />

  );
};

export default Home;
