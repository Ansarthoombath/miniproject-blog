import './App.css';
import Header from './components/Header/Header';
import Card from './components/Card/Card';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import IndexPage from './components/Pages/IndexPage';
import LoginPage from './components/Pages/LoginPage';
import Registerpage from './components/Pages/Registerpage';
import { UserContextProvider } from './components/UserContext';
import CreatePost from './components/Pages/CreatePost';
import PostPage from './components/Pages/PostPage';
import EditPost from './components/Pages/EditPost';


function App() {
  return (

    <UserContextProvider>
      <Routes>
      <Route path='/' element={<Layout/>}>
       <Route index element={<IndexPage /> }/>
       <Route path='/login' element={<LoginPage/>}/>
       <Route path='/register' element={<Registerpage/>}/>
       <Route path='/create' element={<CreatePost/>}/>
       <Route path='/post/:id' element={<PostPage/>}/>
       <Route path="/edit-post/:id" element={<EditPost />} />
    
      </Route> 
    </Routes>
    </UserContextProvider>
    
    
  );
}

export default App;

