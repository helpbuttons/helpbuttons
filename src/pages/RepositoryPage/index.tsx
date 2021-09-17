//App styled elem, comp and layoouts
import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "../components/LeafletMap/index";
import { Store } from "../store/Store";
import { Event } from "../store/Event";
import List from "../layouts/List";
import NavBottom from "../components/NavBottom"; //just for mobile
import Repository from "../../layouts/Repository";
import NavHeader from "../components/NavHeader"; //just for mobile

const RepositoryPage: NextPage = () => {
  return (
    <>
      <Repository />
    </>
  );
};

export default RepositoryPage;
