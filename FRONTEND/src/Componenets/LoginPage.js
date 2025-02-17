import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { login } from '../Services/User-Service';
import { Link } from 'react-router-dom'
import { doLogin } from '../auth/Auth';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Login = (props) => {
    // const width = "50vh";

    const capFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
      document.title = `${capFirstLetter(props.category)} - Attendance Management System`;

    const [loginDetail, setLoginDetail] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (event, field) => {
        let actualValue = event.target.value
        setLoginDetail({
            ...loginDetail,
            [field]: actualValue
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (loginDetail.username.trim() === '' || loginDetail.password.trim() === '') {
            toast.error("Valid Username and Password required!");
            return;
        }

        login(loginDetail)
            .then((data) => {
                doLogin(data, () => navigate("/dashboard"));
                toast.success("Login successful!");
            })
            .catch((errorMessage) => {
                toast.error(errorMessage); // Show backend error message
            });
    };

    const inputStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.47)',
        outline: 'none', 
        boxShadow: 'none' 
    };


    return (

        <>
            <video autoPlay loop muted playsInline preload="auto" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}>
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div
                className="container-fluid d-flex justify-content-center align-items-center vh-100"
                style={{ backgroundColor: "#f8f9fa" }} // Optional background color
            >
                <div className="card p-4 shadow" style={{
                    width: "60vh",
                    height: 'auto',
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(1px)',
                    borderRadius: '10px'
                }}>
                    <h2 className="text-center">Welcome Back!</h2>
                    <p className="text-center">Login to your account</p>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3" style={{ width: "100%" }}>
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address:</label>
                            <input type="email" style={inputStyle} value={loginDetail.username} onChange={(e) => handleChange(e, 'username')} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3" style={{ width: "100%" }}>
                            <label htmlFor="exampleInputPassword1" className="form-label">Password:</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    style={inputStyle}
                                    value={loginDetail.password}
                                    onChange={(e) => handleChange(e, 'password')}
                                    className="form-control"
                                    id="exampleInputPassword1"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-check mb-3">
                            <input type="checkbox" style={inputStyle} className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    <p className="mt-3 text-center">
                        Don't have an account? <Link className="link" to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;
