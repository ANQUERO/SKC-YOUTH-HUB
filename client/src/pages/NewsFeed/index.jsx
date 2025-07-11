import React from 'react'

import { Navbar } from '@components/NavbarFeed.jsx'
import { NewsFeed } from './newsFeed'

const Feed = () => {
  return (
    <main className='newsFeed'>
      <Navbar />
      <NewsFeed />
    </main >

  )
}

export default Feed
