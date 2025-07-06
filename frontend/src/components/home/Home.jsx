import React from 'react'
import Head from '../head/Head'
import LatestCollections from '../latestCollection/LatestCollections'
import BestSeller from '../bestSeller/BestSeller'
import HomePageCategory from '../../pages/homePageCategory/HomePageCategory'

export default function Home() {
  return (
    <div>
      
      <Head/>
      <LatestCollections/>
      <HomePageCategory/>
      <BestSeller/>
    </div>
  )
}
