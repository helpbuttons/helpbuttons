import React, { useEffect, useMemo } from "react";
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


import { CommonDataState, commonDataInitial } from "pages/Common/data";


// https://immerjs.github.io/immer/
// Para simplificar la modificación de estructuras de datos
// al estilo "immutable objects"


// -- estado global --
export interface GlobalState {

  commonData: CommonDataState;

}

export const store = new Store<GlobalState>({

  commonData: commonDataInitial,

});

const Home: NextPage = () => {
  return (

      <HomeInfo />

  );
};

export default Home;
