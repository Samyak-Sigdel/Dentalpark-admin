import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorPatientHistory = () => {
  const { userId } = useParams();
  const {
    fetchPatientHistory,
    fetchFullPatientHistory,
    patientHistory = [],
    profileData,
    getProfileData,
    dToken,
    backendUrl
  } = useContext(DoctorContext);

  const [showAllHistory, setShowAllHistory] = useState(true);
  const [showPrescriptionFormId, setShowPrescriptionFormId] = useState(null);
  const [prescriptionInput, setPrescriptionInput] = useState("");

  useEffect(() => {
    if (userId) {
      if (showAllHistory) {
        fetchFullPatientHistory(userId);
      } else {
        fetchPatientHistory(userId);
      }
    }
    if (!profileData) {
      getProfileData();
    }
  }, [userId, showAllHistory]);

  const handleSubmitPrescription = async (e, appointmentId) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/add-prescription`,
        {
          appointmentId,
          prescription: prescriptionInput
        },
        {
          headers: { dToken }
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchPatientHistory(userId);
        setPrescriptionInput("");
        setShowPrescriptionFormId(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add prescription");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">🩺 Patient History</h2>
        <label className="flex items-center space-x-2 text-sm text-gray-700">
          <span>Only My Records</span>
          <input
            type="checkbox"
            className="form-checkbox text-blue-600"
            checked={!showAllHistory}
            onChange={() => setShowAllHistory(prev => !prev)}
          />
        </label>
      </div>

      {patientHistory.length === 0 ? (
        <div className="text-center text-gray-600 bg-white rounded-md shadow p-6">
          No history found for this patient.
        </div>
      ) : (
        <ul className="space-y-6">
          {patientHistory.map((item) => (
            <li
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="grid grid-cols-2 gap-4 text-gray-800 text-sm">
                <p><span className="font-medium">Doctor:</span> {item.docData?.name || "N/A"}</p>
                <p><span className="font-medium">Date:</span> {item.slotDate}</p>
                <p><span className="font-medium">Time:</span> {item.slotTime}</p>
                <p><span className="font-medium">Status:</span> {
                  item.cancelled ? (
                    <span className="text-red-500 font-medium">Cancelled</span>
                  ) : item.isCompleted ? (
                    <span className="text-green-600 font-medium">Completed</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )
                }</p>
                <p className="col-span-2"><span className="font-medium">Note:</span> {item.note || "N/A"}</p>
                <p className="col-span-2"><span className="font-medium">Prescription:</span> {
                  item.prescription ? JSON.stringify(item.prescription) : "N/A"
                }</p>
              </div>

            
              {!item.prescription && item.isCompleted && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowPrescriptionFormId(item._id)}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                  >
                    Add Prescription
                  </button>

                  {showPrescriptionFormId === item._id && (
                    <form
                      onSubmit={(e) => handleSubmitPrescription(e, item._id)}
                      className="mt-4 space-y-3"
                    >
                      <textarea
                        rows={4}
                        placeholder="Enter prescription details..."
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        value={prescriptionInput}
                        onChange={(e) => setPrescriptionInput(e.target.value)}
                      ></textarea>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPrescriptionFormId(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorPatientHistory;
