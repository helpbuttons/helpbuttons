import React, { useMemo } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Map from '../components/LeafletMap/index'

import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {

  return (
    <>
      <Map/>
    </>
  )
}

export default Home
