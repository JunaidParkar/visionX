import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './screen/authentication'
import UserDashboard from './screen/userDashboard'
import useAuthStatus from './hooks/useAuthStatus'
import ResetPassword from './screen/resetPassword'
import Loader from './components/loader'
import { signOut } from 'firebase/auth'
import { auth } from './firebase/config'
import UrlRedirect from './screen/urlRedirect'
import PageNotFound from './screen/pageNotFound'

const App = () => {

  const { user, isLoggedIn, isEmailVerified, isLoading } = useAuthStatus();

  if (user != null && !isEmailVerified) {
    signOut(auth).then(() => {}).catch((error) => {
      alert('Error logging out:', error);
    });
    alert("Verify your E-Mail first")
  }

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 123) {
      e.preventDefault();
    }
  });
  
  if (!isLoading) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoading ? <Loader /> : isEmailVerified ? <UserDashboard /> : <Login />} />
          <Route path='/resetPassword' element={isLoading ? <Loader /> : <ResetPassword />} />
          <Route path='/url/:urlID' element={<UrlRedirect />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
  
export default App
