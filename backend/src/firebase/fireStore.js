const { admin } = require("./config")


const firestoreDB = admin.firestore()


const getProjectsData = async () => {
    let result = {status: "", err: "", data: []}
    try {
        const querySnapshot = await firestoreDB.collection('projects').get();
        const projects = [];
    
        querySnapshot.forEach((doc) => {
            const projectData = doc.data();
            projects.push(projectData);
        });
        result = {status: "success",err: "", data: projects}
    } catch (error) {
        result = {status: "failed", err: error, data: ""}
    }
    return result
}


module.exports = {
    getProjectsData
}