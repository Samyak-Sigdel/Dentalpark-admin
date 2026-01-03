import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slotDateFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const DoctorsAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(appointmentId);
        await getAppointments();
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-center mb-4">All Appointments</h1>

      <div className="bg-gray-50 rounded-lg shadow-sm overflow-x-auto hide-scrollbar">
        <table className="min-w-full text-base">
          <thead className="text-gray-600 uppercase tracking-wide text-xs">
            <tr>
              <th className="py-4 px-6 text-left">Sno</th>
              <th className="py-4 px-6 text-left">Patient</th>
              <th className="py-4 px-6 text-left">Note</th>
              <th className="py-4 px-6 text-left">Date</th>
              <th className="py-4 px-6 text-left">Time</th>
              <th className="py-4 px-6 text-center">Status / Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {appointments.map((item, index) => (
              <tr key={item._id} className="hover:bg-white transition">
                <td className="py-4 px-6 text-gray-500">{index + 1}</td>
                <td className="py-4 px-6 truncate">
                  {item.userData?.name || 'N/A'}
                </td>
                <td className="py-4 px-6 truncate">
                  {item.userData?.note || 'N/A'}
                </td>
                <td className="py-4 px-6">{slotDateFormat(item.slotDate)}</td>
                <td className="py-4 px-6">{item.slotTime}</td>
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center items-center gap-3 flex-wrap">
                    {item.cancelled ? (
                      <span className="text-red-500 font-semibold">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="text-green-500 font-semibold">Completed</span>
                    ) : (
                      <>
                        <button
                          onClick={() => completeAppointment(item._id)}
                          title="Mark as Completed"
                          className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => handleCancel(item._id)}
                          title="Cancel Appointment"
                          className="p-2 rounded-full hover:bg-red-100 transition"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                    {/* View History Button */}
                    <button
                      onClick={() => navigate(`/doctor/patient/${item.userId}`)}
                      className="ml-5 text-sm text-white bg-teal-600 px-4 py-1.5 rounded-md hover:bg-teal-700 transition duration-200 shadow-sm"
                    >
                      View History
                    </button>

                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsAppointments;
