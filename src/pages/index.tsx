import React, { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Map from "../components/LeafletMap/index";

import Header from "../components/Header";
import styles from "../styles/Home.module.scss";

import Search from "../components/Search";
import Posts from "../components/Posts";
import Filters from "../components/Filters";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <div>
        <Search />
        <Filters />
        <Posts />
      </div>
      <Map />
    </>
  );
};

export default Home;
