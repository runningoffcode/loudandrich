import { useState } from 'react'
import './App.css'
import MapView from './components/MapView'
import NameStats from './components/NameStats'
import Holidays from './components/Holidays'
import Methodology from './components/Methodology'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RequestModal from './components/RequestModal'

const SECTIONS = {
  MAP: 'map',
  NAMES: 'names',
  HOLIDAYS: 'holidays',
  METHODOLOGY: 'methodology',
}

function App() {
  const [activeSection, setActiveSection] = useState(SECTIONS.MAP)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  return (
    <div className="app">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onRequestClick={() => setIsRequestModalOpen(true)}
      />
      <main>
        {activeSection === SECTIONS.MAP && <MapView />}
        {activeSection === SECTIONS.NAMES && <NameStats />}
        {activeSection === SECTIONS.HOLIDAYS && <Holidays />}
        {activeSection === SECTIONS.METHODOLOGY && (
          <Methodology onBack={() => setActiveSection(SECTIONS.MAP)} />
        )}
      </main>
      <Footer onMethodologyClick={() => setActiveSection(SECTIONS.METHODOLOGY)} />
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  )
}

export default App
