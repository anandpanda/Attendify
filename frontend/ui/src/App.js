import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./component/auth/SignIn";
import SignUp from "./component/auth/SignUp";
import UploadImage from "./component/upload/UploadImage";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";
import FetchStudent from "./pages/FetchStudent";
import UploadPage from "./pages/UploadPage";
import PreviewPage from "./pages/PreviewPage";
import AddStudent from "./pages/AddStudent";
import Attendance from "./pages/Attendance";
import { ToastContainer, Bounce } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Nested Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/takeattendance" element={<FetchStudent />} />
              <Route path="/uploadImage" element={<UploadPage />} />
              <Route path="/previewDetection" element={<PreviewPage />} />
              <Route path="/addStudent" element={<AddStudent />} />
              <Route path="/attendance" element={<Attendance />} />
              {/* <Route path="/upload" element={<UploadImage/>}/> */}
            </Route>

            {/* <Route path="/sign_in" element={<SignIn/>} />  
        <Route path="/sign_up" element={<SignUp/>} />  
        <Route path="upload_image" element={<UploadImage/>} />  */}
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
