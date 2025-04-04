import { lazy, Suspense, useContext, useEffect,useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { mainContext } from './components/context/context.js'
import FullscreenFallback from './components/fallback.jsx'
import ScrollToTop from './components/scrollToTop.jsx'
import Navbar from './components/navbar.jsx'


// Lazy Load Components
const Home = lazy(() => import('./components/home.jsx'))
const About = lazy(() => import('./components/about/about.jsx'));
const Saved = lazy(() => import('./components/saved.jsx'))
const HowTo = lazy(() => import('./components/howTo.jsx'))

function App() {
  const soft = useRef(0)
  const { ProjectHasChangedModal,projectHasChangedModalOpen, Notification } = useContext(mainContext)
  const location = useLocation()

  useEffect(() => {
    setTimeout(() => {
      const navElement = document.querySelector('nav');
      if (navElement) {
        document.documentElement.style.setProperty('--navbarWidth', navElement.getBoundingClientRect().width + 'px');
      }
    }, 0); // Runs after initial render

    function resizing() {
      const navElement = document.querySelector('nav');
      if (navElement) {
        document.documentElement.style.setProperty('--navbarWidth', navElement.getBoundingClientRect().width + 'px');
      }
    }

    window.addEventListener('resize', resizing);
    return () => {
      window.removeEventListener('resize', resizing);
    };
  }, []);

  return (
    <section className='text-white'>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Suspense  fallback={<FullscreenFallback />}><Home /></Suspense>} />
        <Route path="/about" element={(<Suspense  fallback={<FullscreenFallback />}><About /></Suspense>)} />
        <Route path="/saved" element={<Suspense  fallback={<FullscreenFallback />}><Saved /></Suspense>} />
        <Route path="/how-to" element={<Suspense  fallback={<FullscreenFallback />}><HowTo /></Suspense>} />
      </Routes>
      <Navbar />
    { projectHasChangedModalOpen && <ProjectHasChangedModal />}   
      <Notification />
    </section>
  )
}

export default App
