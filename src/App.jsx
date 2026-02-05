import { useState } from 'react'
import './App.css'
import MapView from './components/MapView'
import NameStats from './components/NameStats'
import Methodology from './components/Methodology'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const SECTIONS = {
  MAP: 'map',
  NAMES: 'names',
  METHODOLOGY: 'methodology',
}

function App() {
  const [activeSection, setActiveSection] = useState(SECTIONS.MAP)

  return (
    <div className="app">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        {activeSection === SECTIONS.MAP && <MapView />}
        {activeSection === SECTIONS.NAMES && <NameStats />}
        {activeSection === SECTIONS.METHODOLOGY && (
          <Methodology onBack={() => setActiveSection(SECTIONS.MAP)} />
        )}
      </main>
      {activeSection !== SECTIONS.MAP && (
        <Footer onMethodologyClick={() => setActiveSection(SECTIONS.METHODOLOGY)} />
      )}
    </div>
  )
}

export default App
