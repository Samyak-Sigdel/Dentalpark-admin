import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DentistList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken, getAllDoctors]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-center mb-4">
        All Doctors List
      </h1>

      {/* card */}
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-x-auto hide-scrollbar">
        <table className="min-w-full text-base">
          {/* table head */}
          <thead className="text-gray-600 uppercase tracking-wide text-xs">
            <tr>
              <th className="py-4 px-6 text-left">Image</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Address</th>
              <th className="py-4 px-6 text-left">Experience</th>
              <th className="py-4 px-6 text-left">Speciality</th>
              <th className="py-4 px-6 text-left">Phone</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Available</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {doctors.map((d, i) => (
              <tr
                key={i}
                className="hover:bg-white transition "
              >
                <td className="py-4 px-6">
                  <img
                    src={d.image || '/placeholder-avatar.png'}
                    alt={d.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-4 px-6 ">{d.name}</td>
                <td className="py-4 px-6">{d.address || '-'}</td>
                <td className="py-4 px-6">{d.experience || '-'}</td>
                <td className="py-4 px-6">{d.speciality || '-'}</td>
                <td className="py-4 px-6">{d.phone_no || '-'}</td>
                <td className="py-4 px-6">{d.email || '-'}</td>
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    checked={d.available}
                    onChange={() => changeAvailability(d._id)}
                    className="accent-indigo-600 h-5 w-5"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DentistList;
