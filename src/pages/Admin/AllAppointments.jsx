import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { XCircle } from 'lucide-react';

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'N/A';

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken, getAllAppointments]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-center mb-4">
        All Appointments
      </h1>

      <div className="bg-gray-50 rounded-lg shadow-sm overflow-x-auto hide-scrollbar">
        <table className="min-w-full text-base">
          <thead className="text-gray-600 uppercase tracking-wide text-xs">
            <tr>
              <th className="py-4 px-6 text-left">Sno</th>
              <th className="py-4 px-6 text-left">Doctor</th>
              <th className="py-4 px-6 text-left">Date</th>
              <th className="py-4 px-6 text-left">Time</th>
              <th className="py-4 px-6 text-left">Notes</th>
              <th className="py-4 px-6 text-left">Patient</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {appointments.map((item, i) => (
              <tr key={i} className="hover:bg-white transition">
                <td className="py-4 px-6 text-gray-500">{i + 1}</td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.docData?.image || '/placeholder-avatar.png'}
                      alt={item.docData?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <p className="truncate">{item.docData?.name || 'N/A'}</p>
                  </div>
                </td>

                <td className="py-4 px-6">{formatDate(item.slotDate)}</td>
                <td className="py-4 px-6">{item.slotTime}</td>
                <td className="py-4 px-6 truncate">{item.userData?.note || 'N/A'}</td>
                <td className="py-4 px-6 truncate">{item.userData?.name || 'N/A'}</td>

                <td className="py-4 px-6 text-center">
                  {item.cancelled ? (
                    <span className="text-red-500 font-semibold">Cancelled</span>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      title="Cancel appointment"
                      className="text-red-500 hover:text-red-600"
                    >
                      {/* <XCircle className="w-5 h-5 mx-auto" /> */}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAppointments;
