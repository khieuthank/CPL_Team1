
import './App.css';
import Header from './components/app/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Articles from './components/articles/Articles';

function App() {
  return (
    <BrowserRouter>
    <Header></Header>
    <Routes>
    <Route path="/" element={<Articles></Articles>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
