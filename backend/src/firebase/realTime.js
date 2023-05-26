const { admin } = require("./config");


const realtimeDB = admin.database()


const addURL = async (uid, url, urlID, urlName) => {
    try {
      let data = {URLID: urlID, active: "enable", originalURL: url, name: urlName};
      await realtimeDB.ref(`urls/${uid}/${urlName}`).set(data);
      return { status: "success" };
    } catch (error) {
      console.error("Error adding URL:", error);
      return { status: "failed" };
    }
  };

const deleteURL = async (uid, urlName) => {
  try {
    await realtimeDB.ref(`urls/${uid}/${urlName}`).remove();
    return { status: "success" };
  } catch (error) {
    console.error("Error deleting URL:", error);
    return { status: "failed" };
  }
};

const userUrls = async (uid) => {
  try {
    let snapshot = await admin.database().ref(`urls/${uid}`).once('value');
    if (snapshot.exists()) {
      let userData = snapshot.val();
      return {status: "success", data: userData};
    } else {
      return {status: "no data"}
    }
  } catch (error) {
    return { status: "failed" };
  }
};

const toggleUrlVisibility = async (uid, urlName, status) => {
  try {
    await admin.database().ref(`urls/${uid}/${urlName}/active`).set(status);
    return {status: "success"}
  } catch (error) {
    return {status: "failed"}
  }
}

const getOriginalUrl = async (id) => {
  try {
    let snapshot = await admin.database().ref(`urls`).once('value');
    if (snapshot.exists()) {
      let userData = snapshot.val();
      return {status: "success", data: userData};
    } else {
      return {status: "no data"}
    }
  } catch (error) {
    return { status: "failed" };
  }
}

const filterURL = async (id, datas) => {
  let resp = {available: false}
  for (let userID in datas.data) {
    let user = datas.data[userID]
    for (let key in user) {
      let nestedObj = user[key]
      if (nestedObj.URLID === id) {
        nestedObj.active === "disable" ? resp = {available: {active: false}} : nestedObj.active === "enable" ? resp = {available: {url: nestedObj.originalURL, active: nestedObj.active}} : ""
      }
    }
  }
  return resp
}
  

module.exports = {
    addURL,
    deleteURL,
    userUrls,
    toggleUrlVisibility,
    getOriginalUrl,
    filterURL
}