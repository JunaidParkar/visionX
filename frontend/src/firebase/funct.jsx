import { EmailAuthProvider, createUserWithEmailAndPassword, deleteUser, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { api } from "../api/axios";
import { auth } from "./config";

export const loginUsr = async (data) => {
    let msgg = {err: "", msg: ""}
    try {
        let dataa = await signInWithEmailAndPassword(auth, data.email, data.password)
        msgg = {err: 0, msg: dataa.user}
    } catch (error) {
        msgg = {err: 1, msg: "Unable to Log In at moment. Please try again later."}
    }
    return msgg
}

export const signOutUser = async () => {
    let response = {stat: "", msg: ""}
    try {
        await signOut(auth)
        response = {stat: 0, msg: "Logged Out"}
    } catch (error) {
        response = {stat: 1, msg: error.message}
    }
}

export const createUserByEmail = async (regData) => {
    let response = {stat: "" , msg: ""}
    try {
        await createUserWithEmailAndPassword(auth, regData.email, regData.password).then(async data => {
            await sendEmailVerification(data.user).then(() => {
                response = {stat: 0, msg: `Account created and Email verification link has been sent to your Email. Kindly verify to access your account. Check in "Spam" if you didn't see any email`}
            }).catch((e) => {
                response = {stat: 0, msg: "Account created but unable to send Email verification link at moment. Kindly De-register your email and register again later."}
            })
        }).catch(e => {
            response = {stat: 1, msg: e}
        })
    } catch (error) {
        response = {stat: 1, msg: error}
    }
    return response
}

export const sendPasswordReset = async (email) => {
    let response = {stat: "", msg: ""}
    try {
        await sendPasswordResetEmail(auth, email).then(() => {
            response = {stat: 200, msg: `Password Reset Link has been sent to your E-Mail. Kindly check your email. Check in "Spam" if you didn't see any email.`}
        }).catch(e => {
            response = {stat: 12, msg: e}
        })
    } catch (error) {
        response = {stat: 500, msg: error}
    }
    return response
}

export const deleteUserAccount = async (email, password) => {
    let response = {stat: "", msg: ""}
    try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await deleteUser(auth.currentUser);
    } catch (error) {
        if (error.code === 'auth/wrong-password') {
            response = {stat: "Wrong Password", msg: 'Invalid password. Please try again.'}
        } else {
            response = {stat: 500, msg: error}
        }
    }
    return response
}