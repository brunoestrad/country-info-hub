import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import CountrySelect from './components/CountrySelect'
import CountryInfo from './components/CountryInfo'

function App() {
  // Router to change between select and information
  return (
    <BrowserRouter>
        <Routes>
            <Route index element={< CountrySelect />}/>
            <Route path="/country-info" element={<CountryInfo/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
