import {Routes, Route} from 'react-router-dom'
import Home from "./components/Home"
import Enigme1 from "./components/Enigme1"
import Enigme2 from "./components/Enigme2"
import Enigme3 from "./components/Enigme3"
import Enigme4 from "./components/Enigme4"
import './App.css'
import EnigmaSelection from './components/EnigmaSelection'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/enigme1' element={<Enigme1/>}/>
      <Route path='/enigme2' element={<Enigme2/>}/>
      <Route path='/enigme3' element={<Enigme3/>}/>
      <Route path='/enigme4' element={<Enigme4/>}/>
      <Route path='/enigma-selection' element={<EnigmaSelection/>}/>
    </Routes>
  )
}

export default App

