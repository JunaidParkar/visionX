import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/loader'
import { getUrlForRedirect } from '../functions/sessionFunction'
import PageNotFound from './pageNotFound'

const UrlRedirect = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isActive, setIsActive] = useState(true)
    const {urlID} = useParams()
    console.log(urlID)

    useEffect(() => {
      const checkStatus = async () => {
        await getUrlForRedirect(urlID).then(urlData => {
            if (urlData.stat === 200) {
                if (urlData.data.active === "enable") {
                  setIsActive(true)
                  window.location.href = urlData.data.url
                } else {
                  setIsActive(false)
                }
            } else{
                setIsActive(false)
            }
        }).catch(err => {
            alert(err)
            setIsActive(false)
        })
      }
      checkStatus()
    }, [])
    

  return (
    <>
        {isLoading ? <Loader /> : !isActive ? <PageNotFound /> : ""}
    </>
  )
}

export default UrlRedirect
