import { auth, app } from ".";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signOut, getAuth
 } from "firebase/auth";


const testEmail = "test@gmail.com"
const testPswd = "test12345"

export const handleSignUp = async()=>{
    try{
        const credentials = await createUserWithEmailAndPassword(auth, testEmail, testPswd)
        console.log(credentials.user);
    }
    catch (error){
        console.log(error.message)
    }
}

export const handleSignIn = async ()=>{
    try{
        await signInWithEmailAndPassword(auth, testEmail, testPswd) 
    }
    catch(error){
        console.log(error.message);
    }
} 

export const handleSignOut = async()=>{
    await signOut(auth)
}

handleSignIn()
onAuthStateChanged(auth, (user)=>{
    if (user !== null){
        console.log("Logged In user", user.email)
    }
    else{
        console.log("No is Logged In user")
    }
    
})

