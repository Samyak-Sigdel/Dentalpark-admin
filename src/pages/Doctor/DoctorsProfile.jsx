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
    experience: "", // ✅ added
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
      address: profileData.address || "",
      phone_no: profileData.phone_no || "",
      about: profileData.about || "",
      fees: profileData.fees || "",
      experience: profileData.experience || "", // ✅ added
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
        {
          ...formData,
          available: profileData.available,
        },
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

          <button
            onClick={toggleAvailability}
            disabled={isLoading}
            className={`mt-6 w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
              profileData.available
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {profileData.available ? "Available" : "Not Available"}
          </button>
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
            <p>{profileData.address}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone:</label>
            <p>{profileData.phone_no}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Fees:</label>
            <p>Rs. {profileData.fees}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">About:</label>
            <p className="whitespace-pre-line">{profileData.about}</p>
          </div>

          <button
            onClick={handleEditClick}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Edit Profile
          </button>

          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="w-full max-w-lg space-y-4 bg-white p-6 rounded-xl border shadow-lg">

                {/* Experience Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Fees
                  </label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    About
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleUpdateProfile}
                    className="px-5 py-2 bg-teal-600 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 bg-gray-300 rounded-lg"
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
