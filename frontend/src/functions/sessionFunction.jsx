import { api } from "../api/axios";

export const urlChecker = (url) => {
    return new Promise((resolve, reject) => {
        const MrChecker = new XMLHttpRequest();
        const CheckThisUrl = url.trim();
        
        MrChecker.open('GET', CheckThisUrl, true);
        MrChecker.onreadystatechange = () => {
            if (MrChecker.readyState === 4) {
              if (MrChecker.status === 200 || MrChecker.status === 0) {
                  resolve(true);
              } else {
                  resolve(false);
              }
            }
        };

        MrChecker.onerror = () => {
            reject(new Error('An error occurred while checking the URL.'));
        };

        MrChecker.send(null);
    });
};

export const addUrlToDB = async (userData) => {
    let completed = {stat: ""}
    await api.post("/addURL", userData).then(res => {
        if (res.data.status == 200) {
            completed = {stat: "Added new url"}
        } else if (res.data.status == 12) {
            completed = {stat: "Unable to contact to the server. Try again later..."}
        } else {
            completed = {stat: "Unable to process your at moment. Try again later..."}
        }
    })
    return completed
} 

export const fetchData = async (uid) => {
    let fetchedDatas = {stat: "", urls: ""}
    try {
        let response = await api.post(`/getUserUrls`, {uid: uid});
        if (response.data.status == 200) {
            fetchedDatas = {stat: 200, urls: response.data.data}
        } else if (response.data.status == 12) {
            fetchedDatas = {stat: 12}
        } else if (response.data.status == 16) {
            fetchedDatas = {stat: 16}
        }
    } catch (error) {
        fetchedDatas = {stat: 500, urls: error}
    }
    return fetchedDatas
}

export const toggleUrlStatus = async (data) => {
    let status = {stat: "", msg: ""}
    try {
        let response = await api.post("/toggleUrlStatus", data)
        if (response.data.status === 200) {
            status = {stat: 200}
        } else {
            status = {stat: 12}
        }
    } catch (error) {
        status = {stat: 501, msg: error}
    }
    return status
}

export const deleteUserUrl = async (data) => {
    let status = {stat: "", msg: ""}
    try {
        let response = await api.post("/deleteURL", data)
        if (response.data.status == 200) {
            status = {stat: 200}
        } else if (response.data.status == 12) {
            status = {stat: 12}
        } else {
            status = {stat: 500}
        }
    } catch (error) {
        status = {stat: 501, msg: error}
    }
    return status
}

export const getProjects = async () => {
    let status = {stat: "", proj: []}
    try {
        let response = await api.post("/getProjects")
        if (response.data.status === 200) {
            status = {stat: 200, proj: response.data.proj}
        } else {
            status = {stat: 12, proj: response.data.err}
        }
    } catch (error) {
        status = {stat: 12, proj: error}
    }
    return status
}

export const getUrlForRedirect = async (id) => {
    let status = {stat: "", data: ""}
    try {
        let res = await api.post("/getOriginalUrl", {URLID: id})
        if (!res.data.data.available) {
            status = {stat: 12, data: "invalid is"}
        } else{
            status = {stat: 200, data: res.data.data.available}
        }
    } catch (error) {
        status = {stat: 500, data: error}
    }
    return status
}

export const generateUniqueIDForUrl = async () => {
    const timestamp = new Date().getTime();
    const random1 = Math.random().toString(36).substr(2, 5);
    const random2 = Math.random().toString(36).substr(2, 5);
    const uniqueID = `${timestamp}${random1}${random2}`;

    return uniqueID;
};