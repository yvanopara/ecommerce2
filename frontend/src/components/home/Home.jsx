import React from 'react'
import Head from '../head/Head'
import LatestCollections from '../latestCollection/LatestCollections'
import BestSeller from '../bestSeller/BestSeller'

export default function Home() {
  return (
    <div>
      
      <Head/>
      <LatestCollections/>
      <BestSeller/>
    </div>
  )
}
