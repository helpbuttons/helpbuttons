import React, { useMemo } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Map from '../components/LeafletMap/index'
import axios from "axios";

import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  axios.get('http://localhost:3001/buttons/find').then((res) => {
    res.data.map((button) => {
      console.log(button.name);
    });
  }).catch(() => console.log('ERRRO'));

  return (
    <>
      <Map/>
    </>
  )
}

export default Home
