import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import {
  UserRound,
  CalendarCheck,
  Users,
  ClipboardList,
  X
} from 'lucide-react';

const Dashboard = () => {
  const { dashData, getDashData } = useContext(AdminContext);

  useEffect(() => {
    getDashData();
  }, [getDashData]);

  const cancelAppointment = (id) => {
    console.log("Cancelling appointment:", id);
  };

  const slotDateFormat = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  if (!dashData) return null; 

  return (
    <div className="m-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mb-6">
          {/* Doctors Card */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="w-14 h-14 flex items-center justify-center text-blue-500">
              <UserRound size={36} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-700">{dashData.doctors || 0}</p>
              <p className="text-gray-500">Doctors</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="w-14 h-14 flex items-center justify-center text-green-500">
              <CalendarCheck size={36} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-700">{dashData.appointments || 0}</p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="w-14 h-14 flex items-center justify-center text-purple-500">
              <Users size={36} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-700">{dashData.patients || 0}</p>
              <p className="text-gray-500">Patients</p>
            </div>
          </div>
        </div>

      <div className="bg-white rounded-lg shadow-lg mt-8">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <ClipboardList size={20} className="text-gray-600" />
          <p className="font-semibold">Latest Appointments</p>
        </div>

        <div className="pt-4">
          {dashData.latestAppointments?.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border-b">
                {item.docData?.image ? (
                  <img
                    src={item.docData.image}
                    alt="Doctor"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserRound size={24} className="text-gray-500" />
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-semibold">{item.docData?.name || 'Unknown Doctor'}</p>
                  <p className="text-sm text-gray-500">
                    Booking on {item.slotDate ? slotDateFormat(item.slotDate) : 'Unknown date'}
                  </p>
                </div>

                {item.cancelled ? (
                  <p className="text-red-500 text-sm font-medium">Cancelled</p>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-red-400 hover:text-red-600"
                    aria-label="Cancel appointment"
                  >
              
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No appointments found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
