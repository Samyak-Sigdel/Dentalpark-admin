import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorsProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phone_no: "",
    about: "",
    fees: "",
  });

  const toggleAvailability = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/doctor/change-availability",
        { docId: profileData._id },
        { headers: { dToken } }
      );
      if (data.success) {
        setProfileData((prev) => ({
          ...prev,
          available: !prev.available,
        }));
        toast.success(
          `You are now ${!profileData.available ? "available" : "unavailable"}`
        );
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setFormData({
      address: profileData.address,
      phone_no: profileData.phone_no,
      about: profileData.about,
      fees: profileData.fees,
      experience: profileData.experience
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        { ...formData, available: profileData.available },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success("Profile updated!");
        await getProfileData();
        setIsEditing(false);
      } else {
        toast.error("Update failed.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData().finally(() => setIsLoading(false));
    }
  }, [dToken]);

  if (!profileData || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 md:flex md:gap-8">
        {/* Profile Image and Availability */}
        <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
          <img
            src={profileData.image}
            alt="Doctor"
            className="w-48 h-48 object-cover rounded-xl border shadow"
          />

          {/* Availability Toggle */}
          <button
            onClick={toggleAvailability}
            disabled={isLoading}
            className={`mt-6 w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
              profileData.available
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg
                  className={`w-5 h-5 mr-2 ${
                    profileData.available ? "text-green-600" : "text-red-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {profileData.available ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
                {profileData.available ? "Available" : "Not Available"}
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {profileData.available
                ? "Patients can book appointments with you"
                : "Patients cannot book appointments currently"}
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="md:flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {profileData.name}
            </h2>
            <p className="text-sm text-gray-500">{profileData.speciality}</p>
            <span className="inline-block bg-teal-100 text-teal-700 px-2 py-0.5 text-xs rounded mt-1">
              {profileData.experience} years experience
            </span>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Address:</label>
            <p className="text-gray-700">{profileData.address}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone:</label>
            <p className="text-gray-700">{profileData.phone_no}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Fees:</label>
            <p className="text-gray-700">Rs. {profileData.fees}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">About:</label>
            <p className="text-gray-700 whitespace-pre-line">
              {profileData.about}
            </p>
          </div>

          <button
            onClick={handleEditClick}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Edit Profile
          </button>

         {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center ">
              <div className="w-full max-w-lg space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fees</label>
                  <input
                    name="fees"
                    value={formData.fees}
                    onChange={handleChange}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    Cancel
                  </button>
                  
                </div>
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  );
};

export default DoctorsProfile;
