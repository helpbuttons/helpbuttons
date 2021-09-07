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
  const submitButton = async () => {
    const response = await fetch ('/api/buttons',{
      method: 'POST',
      body: JSON.stringify({ button }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <>
      <Map/>
    </>
  )
}

export default Home
