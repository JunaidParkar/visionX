import React, { useState } from 'react'
import hamburger from "../assets/hamburger.png"
import "../css/authentication.css"
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../components/loader'
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { createUserByEmail } from '../firebase/funct'

const SignIn = () => {

  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginData = (e) => {
    setSignInData({...signInData, [e.target.name]: e.target.value})
  }

  const submitLoginData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await setPersistence(auth, browserLocalPersistence)
    await signInWithEmailAndPassword(auth, signInData.email, signInData.password).then(usr => {}).catch(e => alert(e.message))
    setIsLoading(false);
  }

  return (
    <>
      { isLoading ? <Loader /> : "" }
      <form method='POST' onSubmit={e => submitLoginData(e)}>
        <h3>Log In</h3>
        <div className="flex inputs">
          <input type="email" name="email" placeholder='Enter your E-Mail ID' onChange={e => handleLoginData(e)} />
          <input type="password" name="password" placeholder='Enter your password' onChange={e => handleLoginData(e)} />
          <div className="flex btns">
            <input type="submit" value="Log In" />
            <Link to="/resetPassword">forgot password??</Link>
          </div>
        </div>
      </form>
    </>
  )
}

const SignUp = () => {
  
  const [registerData, setregisterData] = useState({
    email: "",
    password: "",
    confPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterData = (e) => {
    setregisterData({...registerData, [e.target.name]: e.target.value})
  }

  const submitRegisterData = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (registerData.password.length >= 6 && registerData.password.length <= 12) {
      if (registerData.password == registerData.confPassword) {
        let regDetails = await createUserByEmail({email: registerData.email, password: registerData.password})
        alert(regDetails.msg)
      } else {
        alert("password mis match")
      }
    } else {
      alert("Password should be more than 6 and less than 12 characters")
    }
    setIsLoading(false)
  }

  return (
    <>
      { isLoading ? <Loader /> : "" }
      <form onSubmit={e => submitRegisterData(e)}>
        <h3>Create Account</h3>
        <div className="flex inputs">
          <input type="email" name="email" placeholder='Enter your E-Mail ID' onChange={e => handleRegisterData(e)} />
          <input type="password" name="password" placeholder='Enter your password' onChange={e => handleRegisterData(e)} />
          <input type="password" name="confPassword" placeholder='Re-enter your password' onChange={e => handleRegisterData(e)} />
          <div className="flex btns">
            <input type="submit" value="Create account" />
          </div>
        </div>
      </form>
    </>
  )
}

const Authentication = () => {

  const navigate = useNavigate()

  const [isSendingData, setisSendingData] = useState(false);
  const [pagination, setPagination] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  if (window.innerWidth < 290) {
    alert("Not supported in this device of this width")
    window.location.href = "https://google.com"
  }


  return (
    <>
      { isLoading ? <Loader /> : "" }
      <div className="bodyAuth">
        <div className="flexCenter navbar">
          <div className="flexCenter options">
            <div className={pagination == "login" ? "option active" : "option"} onClick={e => isSendingData ? "" : setPagination("login")}>Sign In</div>
            <div className={pagination == "register" ? "option active" : "option"} onClick={e => isSendingData ? "" : setPagination("register")}>Register</div>
          </div>
          <div className="hamburger">
            <img src={hamburger} alt="" />
          </div>
        </div>
        <div className="flexCenter mainAuthBody">
          {pagination == "login" ? <SignIn navigate={navigate} /> : <SignUp navigate={navigate} />}
        </div>
      </div>
    </>
  )
}

export default Authentication
