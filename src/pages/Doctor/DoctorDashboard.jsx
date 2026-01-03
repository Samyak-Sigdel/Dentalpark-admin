import React, { useContext, useEffect } from 'react';
import { Calendar, Users, List, Check, X, CheckCircle } from 'lucide-react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    setDashData,
    getDashData,
    completeAppointment,
    cancelAppointment
  } = useContext(DoctorContext);

  const slotDateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="w-full max-w-8xl mx-auto p-4">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Appointments Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-full">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.appointments}
              </p>
              <p className="text-gray-500 text-sm">Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-50 rounded-full">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.patients}
              </p>
              <p className="text-gray-500 text-sm">Patients</p>
            </div>
          </div>

          {/* Completed Appointments Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-50 rounded-full">
              <CheckCircle className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.completedAppointments}
              </p>
              <p className="text-gray-500 text-sm">Completed</p>
            </div>
          </div>
        </div>

        {/* Latest Appointments */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <List className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Latest Appointments</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors">
                <div className="md:col-span-4">
                  <p className="font-medium text-gray-800">{item.userData.name}</p>
                  <p className="text-sm text-gray-500">
                    {slotDateFormat(item.slotDate)} at {item.slotTime}
                  </p>
                </div>

                <div className="md:col-span-5">
                  <p className="text-sm text-gray-500">
                    {item.note || 'No notes provided'}
                  </p>
                </div>

                <div className="md:col-span-3 flex items-center justify-end">
                  {item.cancelled ? (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="p-2 rounded-full  transition-colors"
                        title="Cancel Appointment"
                      >
                        {/* <X size={18} className="text-red-600" /> */}
                      </button>
                      <button
                        onClick={() => completeAppointment(item._id)}
                        className="p-2 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
                        title="Complete Appointment"
                      >
                        <Check size={18} className="text-green-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;