import React, { useEffect, useState } from 'react';
import { myAxios } from "../Services/helper";
import { doLogout } from '../auth/Auth';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const Dashboard=(props)=> {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("/nodp.jpg");
  const navigate = useNavigate();

  const capFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  document.title = `${capFirstLetter(props.category)} - Attendance Management System`;

  useEffect(() => {
    myAxios.get('/dashboard/user-details')
      .then(response => {
        if (response.data.loginTime) {
          const formattedDate1 = new Date(response.data.loginTime).toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
          });
          response.data.loginTime = formattedDate1;
        }
        if (response.data.logoutTime) {
          const formattedDate2 = new Date(response.data.logoutTime).toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
          });

          response.data.logoutTime = formattedDate2; // Replace ISO format with formatted date
        }
        setUserData(response.data);
        setName(response.data.name || "");
        setAddress(response.data.address || "");
        setPosition(response.data.position || "");
        setPreviewImage(response.data.profilePicture
          ? `http://localhost:8080${response.data.profilePicture}`
          : "/nodp.jpg");


      })
      .catch(error => console.error("Error fetching dashboard data:", error));
  }, []);


  const handleLogout = () => {
    doLogout(() => navigate("/"));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview of the new image
    }
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("position", position);
    if (profilePicture) {
      formData.append("file", profilePicture);
    }

    try {

      const token = localStorage.getItem("authToken");
      const response = await myAxios.post("/profile/update", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Only update the profile related fields and preserve attendance data
      setUserData(prevUserData => ({
        ...prevUserData,  // Keep all existing data
        name: response.data.updatedUser.name,
        address: response.data.updatedUser.address,
        position: response.data.updatedUser.position,
        profilePicture: response.data.updatedUser.profilePicture,
      }));

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };



  const handleMarkIn = async () => {
    try {
      const response = await myAxios.post('/Attendance/markIn', {}); // Send an empty body
      toast.success(response.data.message);

      // Ensure `loginTime` is stored as a string
      setUserData(prev => ({
        ...prev,
        loginTime: response.data.loginTime ? String(response.data.loginTime) : prev?.loginTime
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      // console.error("Mark In Error:", error);
    }
  };




  const handleMarkOut = async () => {
    try {
      const response = await myAxios.post('/Attendance/markOut', {});

      // Check if logoutTime and totalWorkingHours exist
      if (response.data.logoutTime || response.data.totalWorkingHours) {
        toast.success("Logged Out Successfully");

        setUserData(prev => ({
          ...prev,
          logoutTime: response.data.logoutTime,
          totalWorkingHours: response.data.totalWorkingHours
        }));
      }

      // Handle the "Already logged out today" message
      else if (response.data.message) {
        toast.info(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };



  return (
    <>

      <nav className="navbar navbar-expand-lg navbar-light shadow-sm px-3" style={{ backgroundColor: "#363636", opacity:"0.8" }}>
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-light">Dashboard</span>
          <div className="ms-auto d-flex">
            <span className="nav-item mx-3 text-white fw-bold px-3 py-1 rounded" onClick={() => setEditMode(true)} style={{ cursor: 'pointer', backgroundColor: "burlywood" }}>Edit Profile</span>
            <span className="nav-item text-white fw-bold px-3 py-1 rounded" onClick={handleLogout} style={{ cursor: 'pointer', backgroundColor: "#FF6865" }}>Logout</span>
          </div>
        </div>
      </nav>

      <video autoPlay loop muted playsInline preload="auto" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: '-1'
      }}>
        <source src="/background1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container-fluid d-flex flex-column align-items-center justify-content-center py-4">

        <div className="row w-100 d-flex flex-wrap justify-content-center align-items-start px-3">
          <div className="col-lg-4 col-md-6 col-12 p-4  shadow rounded-4 text-center mb-4" style={{
            minHeight: '535px', marginTop: "30px", background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(1px)',
            borderRadius: '10px'
          }}>
            <img
              src={previewImage}
              alt="Profile"
              className="rounded-circle border mx-auto mb-3"
              style={{ width: '150px', height: '150px', objectFit: "cover" }}
              onError={(e) => { e.target.src = "/nodp.jpg"; }} // Fallback if image not found
            />

            <h3 className="mb-2">{userData?.name || "John Doe"}</h3>
            <p className="text-muted fs-6">{userData?.position || "Software Engineer"}</p>
            <p className="text-muted fs-6">{userData?.email || "johndoe@example.com"}</p>
            <p className="text-muted fs-6">{userData?.address || "123 Street, City"}</p>
            <div className="container" style={{ marginTop: "70px" }}>
              <button onClick={handleMarkIn} className="btn btn-outline-success m-4">Mark In</button>
              <button onClick={handleMarkOut} className="btn btn-outline-danger m-4">Mark Out</button>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex flex-column align-items-center">
            <div className="p-4  shadow rounded-4 mb-4 w-100" style={{
              minHeight: '400px', marginLeft: "60px", marginTop: "30px", marginRight: "60px", background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(1px)',
              borderRadius: '10px'
            }}>
              <h2 className="mb-3 text-center">Login Details</h2>
              <p className="fs-6"><strong>Login Time:</strong> <span className="text-primary" style={{ fontWeight: "bold" }}>{userData?.loginTime === "Invalid Date" ? "--" : userData?.loginTime || "--"}</span></p>
              <p className="fs-6"><strong>Logout Time:</strong> <span className="text-primary" style={{ fontWeight: "bold" }}>{userData?.logoutTime === "Invalid Date" ? "--" : userData?.logoutTime || "--"}</span></p>
              <p className="fs-6"><strong>Total Working Hours:</strong> <span className="text-primary" style={{ fontWeight: "bold" }}>{userData?.totalWorkingHours || "-- Hours"}</span></p>
            </div>

            <div className="p-3  shadow rounded-4 text-center w-100" style={{
              marginLeft: "60px", marginRight: "60px", background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(1px)',
              borderRadius: '10px'
            }}>
              <h4 className="mb-2">Quote of the Day</h4>
              <p className="text-muted">"Success is not the key to happiness. Happiness is the key to success."</p>
            </div>
          </div>
        </div>
      </div>
      {editMode && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            width: "300px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)"
          }}>
            <h2>Edit Profile</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Enter position"
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button
              onClick={handleUpdateProfile}
              style={{ background: "green", color: "white", padding: "8px 12px", margin: "5px", borderRadius: "5px", cursor: "pointer", border: "none" }}
            >
              Update
            </button>
            <button
              onClick={() => setEditMode(false)}
              style={{ background: "gray", color: "white", padding: "8px 12px", margin: "5px", borderRadius: "5px", cursor: "pointer", border: "none" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </>
  );
}

export default Dashboard;
