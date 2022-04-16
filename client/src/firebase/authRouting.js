

const signUpRouter = document.querySelector(".sign-in-btn .btn")
const signUpRouter2 = document.querySelector(".signup-route")
const signInRouter = document.querySelector(".login-route")
const signUpPage = document.querySelector(".sign-up")
const signInPage = document.querySelector(".sign-in")
const mainPage = document.querySelector("main")

const RouteToSignUpPage = ()=>{
    mainPage.style.display = "none";
    signUpPage.style.display = "flex"
    signInPage.style.display = "none"
}

const RouteToSignInPage = ()=>{
    signInPage.style.display = "flex"
    mainPage.style.display = "none";
    signUpPage.style.display = "none";
}

signUpRouter2.addEventListener("click", RouteToSignUpPage)
signUpRouter.addEventListener("click", RouteToSignUpPage)
signInRouter.addEventListener("click", RouteToSignInPage)
