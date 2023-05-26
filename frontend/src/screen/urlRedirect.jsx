import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/loader'
import { getUrlForRedirect } from '../functions/sessionFunction'

const UrlRedirect = () => {
    const [isLoading, setIsLoading] = useState(true)
    const {urlID} = useParams()
    console.log(urlID)

    useEffect(() => {
      const checkStatus = async () => {
        await getUrlForRedirect(urlID).then(urlData => {
            if (urlData.stat === 200) {
                if (urlData.data.active === "enable") {
                    window.location.href = urlData.data.url
                } else {
                    navigate("/url")
                }
            } else{
                navigate("/url")
            }
        }).catch(err => {
            alert(err)
            navigate("/url")
        })
      }
      checkStatus()
    }, [])

    const navigate = useNavigate()
    

  return (
    <>
        {isLoading ? <Loader /> : ""}
    </>
  )
}

export default UrlRedirect
