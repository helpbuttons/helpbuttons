import type { NextPage } from 'next'
import Head from 'next/head'
import FakeFiters from '../components/FakeFilters'
import FakeSelect from '../components/FakeSelect'
import FakeList from '../components/FakeList';

import { Provider } from 'react-redux';
import { store } from '../store/store';

import styles from '../styles/Home.module.scss'
import React from 'react';

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Simulacion de los filtros de HB</title>
      </Head>
      <div className={styles.container}>
        <Provider store={store}>
          <FakeFiters />
          <FakeSelect />
          <FakeList />
        </Provider>
      </div>
    </>
  )
}

export default Home
