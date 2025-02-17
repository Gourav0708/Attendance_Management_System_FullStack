//isLoggedIn =>

export const isLoggedIn = ()=>{
    let data = localStorage.getItem("data")
    if(data == null){
        return false;
    }
    else{
        return true;
    }
}

//doLogin => data = set to local Storage


export const doLogin =(token, next) =>{
    localStorage.setItem("token",JSON.stringify(token))
    next()

}


//doLogout=> Remove from local Storage

// export const doLogout = (next) =>{
//     localStorage.removeItem("data")
//     next()

// }
export const doLogout = (next) => {
    localStorage.removeItem("data"); // Remove stored user data
    localStorage.removeItem("token"); // remove token
    localStorage.removeItem("authToken");  
    sessionStorage.clear(); //  Clear session storage if used
    next(); 
};

