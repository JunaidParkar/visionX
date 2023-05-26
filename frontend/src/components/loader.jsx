import React from 'react'
import "../css/loader.css"
import logo from "../assets/logo.png"

const Loader = () => {
  return (
    <>
        <div className="flexCenter loader">
            <img src={logo} alt="" />
            <h3>Loading...</h3>
        </div>
    </>
  )
}

export default Loader
