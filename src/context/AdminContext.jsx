import { createContext, useCallback, useState } from "react";
import axios from 'axios'
import {toast }from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) =>{

    const [aToken,setAToken] =useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors,setDoctors] = useState([]);
    const[appointments,setAppointments] = useState([]);
    const[dashData ,setDashData] = useState(null)


    const backendUrl = import.meta.env.VITE_BACKENDURL

    const getAllDoctors =async () =>{
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/listdoctor', {}, {headers:{aToken}})
            if (data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
                
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }


    const changeAvailability = async (docId)=>{
        try {
            const { data } = await axios.post( backendUrl + '/api/admin/change-availability', {docId},{ headers:{aToken}});
           
            if (data.success) {

              toast.success(data.message)
              getAllDoctors()
            } else {
                toast.error(data.message);
            }

            
        } catch (error) {
            toast.error(error.message);
        }
    }


    //to get all appointment 

       
const getAllAppointments = async ()=>{
    try {
        const { data } = await axios.get(`${backendUrl}/api/admin/appointments`,
             { headers: { aToken } }
        );
        
        if(data.success){
            setAppointments(data.appointments)
            console.log(data.appointments)

        }else{
            toast.error(data.message)
        }

  
    } catch (error) {
        toast.error(error.message);

    }
}

        const cancelAppointment = async (appointmentId)=>{
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`,
                { appointmentId },

                  { headers: { aToken } }
            );    
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {

                    toast.error(error.message);

        }
        }

    
    //to get dashboard Data 
    
     const getDashData = useCallback(async () => {
  try {
    const { data } = await axios.get(
      `${backendUrl}/api/admin/dashboard`,
      { headers: { aToken } }
    );  

     if (data.success) {
        setDashData(data.dashData);
        console.log("Fetched dash data:", data.dashData); 
        } else {
        toast.error(data.message);
        }

  } catch (error) {
    toast.error(error.message);
  }
}, [aToken, backendUrl]);







    const value ={
        aToken,setAToken,backendUrl,doctors,getAllDoctors,changeAvailability,getAllAppointments,cancelAppointment,  appointments,getDashData,dashData
    }

  

    return (
        <AdminContext.Provider value ={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider