import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Formatter from './pages/Formatter'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/formatter" element={<Formatter />} />
      </Routes>
    </div>
  )
}
