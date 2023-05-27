import React, { useState } from 'react'
import { getAuth, deleteUser } from "firebase/auth";
import useAuthStatus from '../hooks/useAuthStatus';
import { deleteUserAccount } from '../firebase/funct';

const DeleteUser = () => {
    
    const { user, isLoggedIn, isEmailVerified, isLoading } = useAuthStatus();
    const [deleteData, setDeleteData] = useState({
        email: "",
        password: ""
    })

    const handleDelete = async () => {
        let resp = await deleteUserAccount(deleteData.email, deleteData.password, user.uid)
        if (resp.stat == "Wrong Password") {
            alert("wrong password")
        } else if (resp.stat === 500) {
            alert(resp.msg)
        }
    }

    const handleDeleteData = (e) => {
        setDeleteData({...deleteData, [e.target.name]: e.target.value})
    }



  return (
    <>
        <div className="flexCenter resetContainer">
            <div className="flex form">
                <h5>Delete my account</h5>
                <input type="email" name="email" id="" placeholder='Enter your E-Mail' onChange={e => handleDeleteData(e)} />
                <input type="password" name="password" id="" placeholder='Enter your Password' onChange={e => handleDeleteData(e)} />
                <button onClick={() => handleDelete()}>Submit</button>
            </div>
        </div>
    </>
  )
}

export default DeleteUser
