
import './App.css'
import FashionImgList from './components/FashionImgList/FashionImgList';
import FashionImgDetail from './components/FashionImgDetail/FashionImgDetail';
import FashionImgNew from './components/FashionImgNew/FashionImgNew';
import ImageGenerator from './components/image_generator'
import WelcomePage from './components/welcome_page/welcome_page'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layouts/Layout';
import Error from './error.jsx';
function App() {

  return (

      <Router>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route path="/list" element={<FashionImgList/>} />
        <Route path="/list/:id" element={<FashionImgDetail />} />
        <Route path="/list/new" element={<FashionImgNew />} />
        <Route path="/imageAI" element={<WelcomePage/>} />
        <Route path="/imageAI/generate" element={<ImageGenerator/>} />
        <Route path="*" element={<Error message="Page not found!" />} />
        </Route>
      </Routes>
    </Router>

  )
}

export default App
