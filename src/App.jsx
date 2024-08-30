import React from 'react'
import Home from './components/home.jsx'
import Navbar from './components/navbar.jsx'
import About from './components/aboutUs.jsx'
import Saved from './components/saved.jsx'
import HowTo from './components/howTo.jsx'
import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/scrollToTop.jsx'

function routes() {
  return (
    <section className='min-h-[100vh] text-white'>
      {/* a big bug has come to know  : if click for edit in the card to edit player then we click another card's three dots the and after if we save the changes are being saved in latest click three dots card not in the neede one
      reason : clicking on another card's three dots while editing causing the state to updated to another card
      solved : added and used different key for editbtn that only updates on onclicking edit button not on three dots */      
      }
       <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/saved' element={<Saved />} />
        <Route path='/how-to' element={<HowTo />} />
      </Routes>
      <Navbar />
    </section>
  )
}

export default routes