
import './App.css'
import ImageGenerator from './components/image_generator'
import WelcomePage from './components/welcome_page/welcome_page'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (

      <Router>
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/generate" element={<ImageGenerator/>} />
      </Routes>
    </Router>

  )
}

export default App
