import React, { useState } from 'react'
import Loader from '../components/loader'
import "../css/authentication.css"
import { sendPasswordReset } from '../firebase/funct';

const ResetPassword = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("")


    if (window.innerWidth < 290) {
        alert("Not supported in this device of this width")
        window.location.href = "https://google.com"
    }

    
    const handleEmail = (e) => { setEmail(e.target.value) }

    const sendMailResetPass = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        let mail = await sendPasswordReset(email)
        alert(mail.msg)
        setIsLoading(false)
    }


  return (
    <>
        { isLoading ? <Loader /> : "" }

        <div className="bodyAuth">
            <div className="flexCenter mainAuthBody">
                <form method='POST' onSubmit={e => sendMailResetPass(e)}>
                    <h3>Reset Password</h3>
                    <div className="flex inputs">
                        <input type="email" placeholder='Enter your E-Mail ID' onChange={e => handleEmail(e)} />
                        <div className="flex btns">
                            <input type="submit" value="Log In" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default ResetPassword
