import { myAxios } from "./helper";


export const signUp =async (user)=>{
    const response = await myAxios
        .post('/Employee/signup', user);
    return response.data;

};

// export const login= (loginDetail)=>{
//     return myAxios.post('/Employee/login',loginDetail)
//     .then((response)=>response.data)
// }
export const login = (loginDetail) => {
    const fixedLoginDetail = {
        email: loginDetail.username,
        password: loginDetail.password
    };

    return myAxios.post('/Employee/login', fixedLoginDetail)
        .then((response) => {
            if (response.data.token) {  // Assuming the backend sends a JWT token
                localStorage.setItem("authToken", response.data.token);
            }
            return response.data;
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.error) {
                return Promise.reject(error.response.data.error);
            } else {
                return Promise.reject("Something went wrong. Please try again.");
            }
        });
};



// export const fetchDashboardData = async () => {
//     return myAxios.get("/dashboard/user-details")
//         .then(response => response.data)
//         .catch(error => {
//             console.error("Error fetching dashboard data:", error);
//             return null; // Return null in case of an error
//         });
// };




