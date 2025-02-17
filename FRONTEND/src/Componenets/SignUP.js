import React, { useState, useEffect } from 'react';
import { signUp } from '../Services/User-Service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'


const SignUP = (props) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        position: '',
        address: '',
    });

    const [errors, setErrors] = useState({});

    const capFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
      document.title = `${capFirstLetter(props.category)} - Attendance Management System`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {}; // this is th empty object which have key value pair dynamically.
        if (!formData.name.trim()) newErrors.name = 'Name is required.'; //// Dynamically add a key ('name') with a value ('Name is required.') in all
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address.';
        }
        if (!formData.password.trim()) newErrors.password = 'Password is required.';
        if (!formData.position.trim()) newErrors.position = 'Position is required.';
        if (!formData.address.trim()) newErrors.address = 'Address is required.';
        setErrors(newErrors); //Updates the errors state with the new error messages found during validation.
        return Object.keys(newErrors).length === 0; // Return true if no errors and gives an array of all keys in the newErrors object
    };

    const submitForm = (event) => {
        event.preventDefault(); //method in JavaScript that prevents the default behavior of an event from occurring
        if (validateForm()) {
            signUp(formData)
                .then((response) => {
                    // console.log(response);
                    toast.success('Registered Successfully');
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        position: '',
                        address: '',
                    });
                    setErrors({});
                    navigate('/');
                })
                .catch((error) => {
                    // console.error(error);
                    toast.error('Registration failed.');
                });
        } else {
            toast.error('Please fill all details.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            position: '',
            address: '',
        });
        setErrors({});
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
                zIndex: '-1'
            }}>
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="container my-5">
                <div className="container-fluid d-flex justify-content-center align-items-center vh-auto" style={{}}>
                    <div className="card p-3 shadow"
                        style={{
                            width: '80vh',
                            height: 'auto',
                            background: 'rgba(255, 255, 255, 0.75)',
                            backdropFilter: 'blur(1px)',
                            borderRadius: '10px'
                        }}>

                        <h2 className="text-center my-1">Create an Account</h2>
                        <p className="text-center my-1">Sign up to continue</p>
                        <form onSubmit={submitForm}>
                            <div className="mb-3" style={{ width: '100%'}}>
                                <label htmlFor="name" className="form-label">
                                    Enter your Name:
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="mb-3" style={{ width: '100%' }}>
                                <label htmlFor="email" className="form-label">
                                    Email address:
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    aria-describedby="emailHelp"
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                <div id="emailHelp" className="form-text">
                                    We'll never share your email with anyone else.
                                </div>
                            </div>
                            <div className="mb-3" style={{ width: '100%' }}>
                                <label htmlFor="password" className="form-label">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            <div className="mb-3" style={{ width: '100%' }}>
                                <label htmlFor="position" className="form-label">
                                    Position:
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.position ? 'is-invalid' : ''}`}
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                                {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                            </div>
                            <div className="mb-3" style={{ width: '100%' }}>
                                <label htmlFor="address" className="form-label">
                                    Address:
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Submit
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm my-2"
                                onClick={resetForm}
                            >
                                Reset
                            </button>
                            <p className="text-center">
                                Already have an account? <Link className="link" to="/">Sign in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUP;
