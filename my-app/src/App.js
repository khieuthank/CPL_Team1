
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

import { AuthProvider } from './components/context/AuthContext';
import CreateArticles from './components/articles/CreateArticles';
import EditArticle from './components/articles/EditArticle';
import ProfileAuthor from './components/profile/ProfileAuthor';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    
    <Header></Header>
    <Routes>
    <Route path="/" element={<Articles></Articles>} />
    <Route path="/users/login" element={<Login></Login>} />
    <Route path="/users/register" element={<Register></Register>} />
    <Route path="/article/:slug" element={<ArticleDetail></ArticleDetail>}/>
    <Route path="/settings" element={<Settings></Settings>}/>
    <Route path="/profile/:username" element={<Profile></Profile>}/>
    <Route path="/profileAuthor/:username" element={<ProfileAuthor></ProfileAuthor>}/>

    <Route path="/profile/:username/favorites" element={<Favorite></Favorite>}/>

    <Route path="/CreateArticles" element={<CreateArticles></CreateArticles>}/>
    <Route path="/edit/:slug" element={<EditArticle></EditArticle>}/>

   

  

    </Routes>
    <Footer></Footer>
    
    </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;
