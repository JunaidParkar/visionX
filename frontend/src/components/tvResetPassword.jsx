import React, { useState } from 'react'
import "../css/tvResetPassword.css"
import Loader from './loader';
import { sendPasswordReset } from '../firebase/funct';

const TvResetPassword = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("")


  const handleEmail = (e) => { setEmail(e.target.value) }


  const sendMailResetPass = async () => {
    setIsLoading(true)
    let mail = await sendPasswordReset(email)
    alert(mail.msg)
    setIsLoading(false)
    location.reload()
  }

  return (
    <>
      { isLoading ? <Loader /> : "" }
      <div className="flexCenter resetContainer">
        <div className="flex form">
          <h5>reset password</h5>
          <input type="email" id="" placeholder='Enter your E-Mail' onChange={(e) => handleEmail(e)} />
          <button onClick={() => sendMailResetPass()}>Submit</button>
        </div>
      </div>
    </>
  )
}

export default TvResetPassword
