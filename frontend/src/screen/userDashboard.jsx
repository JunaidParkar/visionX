import React, { useEffect, useState } from 'react'
import useAuthStatus from '../hooks/useAuthStatus';
import Loader from '../components/loader';
import { useNavigate } from 'react-router-dom';
import trash from "../assets/trash.png"
import eyeOpen from "../assets/eyeOpen.png"
import eyeClose from "../assets/eyeClose.png"
import copy from "../assets/copy.png"
import "../css/userDashboard.css"
import TV from '../components/tv';
import TvResetPassword from '../components/tvResetPassword';
import DeleteUser from '../components/deleteUser';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { addUrlToDB, deleteUserUrl, fetchData, generateUniqueIDForUrl, getProjects, toggleUrlStatus, urlChecker } from '../functions/sessionFunction';

const UserDashboard = () => {

    const { user, isLoggedIn, isEmailVerified, isLoading } = useAuthStatus();
    const [preloader, setPreloader] = useState(false)
    const [accountScreen, setAccountScreen] = useState("resetPassword");
    const [userUrls, setUserUrls] = useState(null);
    // const [urlFetcher, setUrlFetcher] = useState(false)
    const [projects, setProjects] = useState(null)
    const [addUrlData, setAddUrlData] = useState({
        name: "",
        url: ""
    })


    const navigate = useNavigate()


    useEffect(() => {
        const fetchUrls = async () => {
          if (isLoggedIn && !isLoading && user) {
            setPreloader(true);
            try {
                let fetchResponse = await fetchData(user.uid);
                let projResponse = await getProjects()
                if (fetchResponse.stat === 200) {
                    setUserUrls(fetchResponse.urls);
                    // setUrlFetcher(true)
                } else if (fetchResponse.stat === 500) {
                    alert(fetchResponse.urls);
                    // setUrlFetcher(false)
                } else if (fetchResponse.stat === 16) {
                    alert("No data available");
                    // setUrlFetcher(false)
                }
                if (projResponse.stat === 200) {
                    setProjects(projResponse.proj)
                } else {
                    alert("Unable to fetch project at the moment")
                }
            } catch (error) {
                console.error("Error fetching user URLs:", error);
            }
            setAccountScreen("tv")
            setPreloader(false);
          }
        };
        fetchUrls();
    }, [isLoggedIn, isLoading]);

    if (window.innerWidth < 290) {
        alert("Not supported in this device of this width")
        window.location.href = "https://google.com"
    }


    if (!isLoading) {
        if (!isLoggedIn) {
            navigate("/auth")
        } else if (isLoggedIn && !isEmailVerified) {
            alert("Kindly verify your E-Mail first")
        }
    }


    const handleAddUrlData = e => {
        setAddUrlData({...addUrlData, [e.target.name]: e.target.value})
    }


    const copyToClipboard = async (id) => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/url/${id}`);
            alert("Short url copied to Clipboard")
        } catch (error) {
            alert('Failed to copy text to clipboard:', error, "Try refreshing your page and allow clipboard permission is asked");
        }
    }
      


    const addNewUrl = async () => {
        setPreloader(true)
        await urlChecker(addUrlData.url).then(async(exists) => {
            await generateUniqueIDForUrl().then(async (id) => {
                if (exists) {
                    let userData = {
                        uid: user.uid,
                        url: addUrlData.url.trim(),
                        urlId: id.trim(),
                        urlName: addUrlData.name
                    }
                    await addUrlToDB(userData).then(e => {
                        alert(e.stat)
                    })
                } else {
                    alert('URL does not exist');
                }
            })
        }).catch((error) => {
            console.error(error);
        });
        console.clear()
        console.warn(`Any error encountered related "Access Allow Origin" is due validating the url you provided. Its normal for it...`)
        setPreloader(false)
        location.reload()
    }

    const toggleStatusURL = async (urlName, status) => {
        setPreloader(true)
        try {
            let dataToTransfer = {
                uid: user.uid,
                urlName: urlName,
                status: status
            }
            let response = await toggleUrlStatus(dataToTransfer)
            response.stat === 501 ? alert(response.msg) : response.stat === 200 ? "" : alert("Internal Server Error")
        } catch (error) {
            alert(error)
        }
        setPreloader(false)
        location.reload()
    }

    const deleteUrl = async (name) => {
        setPreloader(true)
        try {
            let dataToSubmit = {uid: user.uid, urlname: name.trim()}
            let resp = await deleteUserUrl(dataToSubmit)
            if (resp.stat === 200) {
                location.reload()
            } else if (resp.stat === 501) {
                alert(resp.msg)
            } else if (resp.stat === 500) {
                alert("unable to reach server")
            } else {
                alert("Internal server error")
            }
        } catch (error) {
            alert(error)
        }
    }

    const logoutUser = () => {
        signOut(auth)
            .then(() => {})
            .catch((error) => {
              alert('Error logging out:', error);
        });
    }


    return (
        <>
            {isLoading || preloader ? <Loader /> : ""}
            <div className="mainUserDashboard">
                <div className="flex welcomeHeader">
                    <p> {user != null ? user.email : ""},</p>
                </div>
                <div className="urlTab">
                    <div className="urlHeader">
                        <h3>my url's</h3>
                    </div>
                    <div className="urlSec">
                        <div className="urlContainer">
                            {userUrls != null ? Object.keys(userUrls).map((urlID) => (
                                <div className="flex url" key={urlID} >
                                    <a href={userUrls[urlID].originalURL}>{userUrls[urlID].name}</a>
                                    <div className="flex urlOptions">
                                        <img src={copy} alt="Copy Link" onClick={() => copyToClipboard(userUrls[urlID].URLID)} />
                                        {userUrls[urlID].active == "enable" ? <img src={eyeOpen} alt="Working" onClick={() => toggleStatusURL(userUrls[urlID].name, "disable")} /> : <img src={eyeClose} alt="Disabled" onClick={() => toggleStatusURL(userUrls[urlID].name, "enable")} /> }
                                        <img src={trash} alt="delete" onClick={() => deleteUrl(userUrls[urlID].name)} />
                                    </div>
                                </div>
                            )) : ""}
                        </div>
                    </div>
                </div>
                <div className="addUrlTab">
                    <div className="addUrlHeader">
                        <h3>Add URL</h3>
                    </div>
                    <div className="flex addUrlBody">
                        <input type="text" name="name" id="" onChange={e => handleAddUrlData(e)} placeholder='Enter name for URL' />
                        <input type="url" name="url" id="" onChange={e => handleAddUrlData(e)} placeholder='Enter your URL' />
                        <button type='button' onClick={() => addNewUrl()}><p>Add</p></button>
                    </div>
                </div>
                <div className="moreProjectsTab">
                    <div className="projectsHeader">
                        <h3>More projects by us</h3>
                    </div>
                    <div className="flex projectsBody">
                        {
                            projects != null ? projects.map(item => (
                                <div className="proj" key={item.id} onClick={() => {window.location.href = item.url}}>
                                    <img src={item.img} alt={item.Name} />
                                    <div className="flex overLay">
                                        <h4>{item.Name}</h4>
                                        <p>by {item.by}</p>
                                    </div>
                                </div>
                            )) : ""
                        }
                    </div>
                </div>
                <div className="myAccountTab">
                    <div className="accountHeader">
                        <h3>My account</h3>
                    </div>
                    <div className="accountScreen">
                        {accountScreen == "tv" ? <TV /> : accountScreen == "resetPassword" ? <TvResetPassword /> : accountScreen == "deleteAccount" ? <DeleteUser /> : ""}
                    </div>
                    <div className="accountOption">
                        <ul className='flex'>
                            {accountScreen == "tv" ? "" : <li><button onClick={() => setAccountScreen("tv")}>back</button></li>}
                            {accountScreen == "resetPassword" ? "" : <li><button onClick={() => setAccountScreen("resetPassword")}>Reset Password</button></li>}
                            {accountScreen == "deleteAccount" ? "" : <li><button onClick={() => setAccountScreen("deleteAccount")}>Delete account</button></li>}
                            <li><button onClick={() => logoutUser()}>logout</button></li>
                        </ul>
                    </div>
                </div>
                <div className="flexCenter tradeMarkDiv">
                    <p>a project by <a href="http://junaidparkar-f7e41.web.app" target="_blank" rel="noopener noreferrer">junaid parkar</a>. © 2023</p>
                </div>
            </div>
        </>
    )
}

export default UserDashboard
