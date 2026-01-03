import React, { useContext } from 'react'
import Login from './pages/Login'

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDentist from './pages/Admin/AddDentist';
import DentistList from './pages/Admin/DentistList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorsAppointments from './pages/Doctor/DoctorsAppointments';
import DoctorsProfile from './pages/Doctor/DoctorsProfile';
import ContactList from './pages/Doctor/ContactList';
import FeedBackList from './pages/Doctor/FeedBackList';
import DoctorPatientHistory from './pages/Doctor/DoctorPatientHistory';
import DoctorCalendar from './pages/Doctor/DoctorCalendar';

const App = () => {

  const {aToken} =useContext(AdminContext)
   const {dToken} =useContext(DoctorContext)

  return aToken  || dToken ? (
    <div>

      <ToastContainer />
      <Navbar/>
      <Sidebar />

<div className="ml-64 pt-28 p-4 bg-gradient-to-br from-gray-50 to-white">


        <Routes>
          <Route path='/' element = {<> </>}/>
          
          <Route path='/admin-dashboard' element ={<Dashboard />} />
          <Route path='/all-appointments' element ={<AllAppointments/>}/>
          <Route path='/add-dentist' element ={<AddDentist/>}/>
          <Route path='/dentist-list' element ={<DentistList/>}/>

          <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
          <Route path="/doctor-appointments" element={<DoctorsAppointments/>} />
          <Route path="/doctor-profile" element={<DoctorsProfile/>} />
          <Route path='/contact-list' element={<ContactList/>}/>
          <Route path='/feedback-list' element={<FeedBackList/>}/>

          <Route path="/doctor/patient/:userId" element={ <DoctorPatientHistory />} />
          <Route path='/appointments-by-date' element={<DoctorCalendar/>}/>

      
        </Routes>
         </div>
     
    </div>
  ): (
    <>
       <Login />
       <ToastContainer />
    
    </>
  )
}

export default App
