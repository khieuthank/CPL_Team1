
import './App.css';
import Header from './components/app/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Articles from './components/articles/Articles';

import ArticleDetail from './components/articles/ArticleDetail';
import Login from './components/loginRegister/Login';
import Register from './components/loginRegister/Register';

function App() {
  return (
    <BrowserRouter>
    <Header></Header>
    <ArticleDetail></ArticleDetail>
    <Routes>
    <Route path="/" element={<Articles></Articles>} />
    <Route path="/users/login" element={<Login></Login>} />
    <Route path="/users/register" element={<Register></Register>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
