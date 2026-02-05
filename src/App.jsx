import { useState } from 'react'
import './App.css'
import MapView from './components/MapView'
import NameStats from './components/NameStats'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const SECTIONS = {
  MAP: 'map',
  NAMES: 'names',
}

function App() {
  const [activeSection, setActiveSection] = useState(SECTIONS.MAP)

  return (
    <div className="app">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        {activeSection === SECTIONS.MAP && <MapView />}
        {activeSection === SECTIONS.NAMES && <NameStats />}
      </main>
      <Footer />
    </div>
  )
}

export default App
