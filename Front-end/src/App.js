import './App.css';
import Register from './components/Register'
import Login from './components/Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { useState } from 'react';
import { TokenProvider } from './components/TokenProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Homepage from './components/Homepage';
import ChatPage from './components/ChatPage';
function App() {
  const [token,setToken] = useState()
  return (
    <TokenProvider>
      <BrowserRouter>
        <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/homepage" element={<Homepage/>}/>
          <Route path="/chat/:user" element={<ChatPage/>}/>
        </Route>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </TokenProvider>
  );
}


export default App;
