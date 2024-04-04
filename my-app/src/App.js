
import './App.css';
import Header from './components/app/Header';
import Footer from './components/app/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Articles from './components/articles/Articles';

import ArticleDetail from './components/articles/ArticleDetail';
import Login from './components/loginRegister/Login';
import Register from './components/loginRegister/Register';
import Settings from './components/profile/Settings';
import Profile from './components/profile/Profile';
import Favorite from './components/profile/Favorite';
function App() {
  return (
    <BrowserRouter>
    <Header></Header>
    <Routes>
    <Route path="/" element={<Articles></Articles>} />
    <Route path="/users/login" element={<Login></Login>} />
    <Route path="/users/register" element={<Register></Register>} />
    <Route path="/article/:slug" element={<ArticleDetail></ArticleDetail>}/>
    <Route path="/settings" element={<Settings></Settings>}/>
    <Route path="/profile/:username" element={<Profile></Profile>}/>
    <Route path="/profile/:username/favorites" element={<Favorite></Favorite>}/>
    </Routes>
    <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
