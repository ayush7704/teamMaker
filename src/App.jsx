import { useContext } from 'react'
import Home from './components/home.jsx'
import Navbar from './components/navbar.jsx'
import About from './components/about.jsx'
import Saved from './components/saved.jsx'
import HowTo from './components/howTo.jsx'
import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/scrollToTop.jsx'
import { mainContext } from './components/context/context.js'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
function routes() {
  // styled modal buttons 
  const { Modal ,Notification} = useContext(mainContext)

  // useGSAP(()=>{
  //   gsap.fromTo('.spinner',{transform:`rotate(45deg) rotateX(-385deg) rotateY(385deg)`},{transform:`rotate(45deg) rotateX(-25deg) rotateY(25deg)`,repeat:-1,duration:4,ease:'none'})
  // })
  return (
    <section className='pb-[6rem] text-white'>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/saved' element={<Saved />} />
        <Route path='/how-to' element={<HowTo />} />
      </Routes>
      <Navbar />
      <Modal />
      <Notification/>
    </section>
  )
}

export default routes