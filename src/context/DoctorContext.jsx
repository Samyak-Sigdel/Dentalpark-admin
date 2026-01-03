import { useState, createContext } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKENDURL;
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dToken }
      });
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Unknown error occurred");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, {
        headers: { dToken }
      });
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Cancellation failed");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, {
        headers: { dToken }
      });
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Completion failed");
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { dToken }
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { dToken }
      });
      if (data.success) {
        setProfileData(data.doctor);
        return data.doctor;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPatientHistory = async (userId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/patient-history/${userId}`, {
        headers: { dToken }
      });
      if (data.success) {
        setPatientHistory(data.history || []);
      } else {
        toast.error(data.message || "No history found.");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching patient history.");
    }
  };

  const fetchFullPatientHistory = async (userId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/patient-full-history/${userId}`, {
        headers: { dToken }
      });
      if (data.success) {
        setPatientHistory(data.history || []);
      } else {
        toast.error(data.message || "No history found.");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching full patient history.");
    }
  };

  return (
    <DoctorContext.Provider value={{
      dToken, setDToken, backendUrl,
      getAppointments, appointments,
      cancelAppointment, completeAppointment,
      dashData, setDashData, getDashData,
      profileData, setProfileData, getProfileData,
      fetchPatientHistory,
      fetchFullPatientHistory,
      patientHistory
    }}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
