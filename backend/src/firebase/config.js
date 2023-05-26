const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
const env = require("dotenv")


env.config()


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});


module.exports = {
    admin
}