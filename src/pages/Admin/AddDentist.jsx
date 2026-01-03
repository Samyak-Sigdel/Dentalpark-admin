import React, { useState, useContext } from "react";

import { CiUser } from "react-icons/ci";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDentist = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General");
  const [address, setAddress] = useState("");
  const [phone_no, setPhoneno] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmithandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image not selected");
      }

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("address", address);
      formData.append("phone_no", phone_no);

      formData.forEach((value, key) => {
        console.log(`${key} :${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/adddoctor",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setAbout("");
        setAddress("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
      <form onSubmit={onSubmithandler}>
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-zinc-200 text-zinc-500  rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
              {docImg ? (
                <img
                  src={URL.createObjectURL(docImg)}
                  alt="Doctor"
                  className=" w-full h-full rounded-full"
                />
              ) : (
                <CiUser size={24} />
              )}
            </div>

            <label
              htmlFor="profilePicture"
              className="text-zinc-400 text-medium cursor-pointer"
            >
              Upload doctor picture
            </label>

            <input
              type="file"
              className="hidden"
              id="profilePicture"
              name="profilePicture"
              onChange={(e) => setDocImg(e.target.files[0])}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-500  mb-1"
              >
                Doctor name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-zinc-400 "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="speciality"
                className="block text-sm font-medium text-neutral-500 mb-1"
              >
                Speciality
              </label>
              <select
                id="speciality"
                name="speciality"
                className="w-full px-3 py-2 border border-gray-300 text-neutral-500 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                <option value="General">General Doctor</option>
                <option value="Orthodontist">Orthodontist</option>
                <option value="Oral and maxillofacial surgeon">Oral and maxillofacial surgeon</option>
                <option value="Periodontist">Periodontist</option>
                 <option value="Prosthodontist">Prosthodontist</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-500 mb-1"
              >
                Doctor Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-neutral-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-neutral-500 mb-1"
              >
                Experience
              </label>
              <select
                id="experience"
                name="experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-neutral-500"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Experience</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-500 mb-1"
              >
                Doctor Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-zinc-500 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address "
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone_no"
                className="block text-sm font-medium text-zinc-500 mb-1"
              >
                Phone No
              </label>
              <input
                type="text"
                id="phone_no"
                name="phone_no"
                placeholder="phone_no "
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                value={phone_no}
                onChange={(e) => setPhoneno(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="about"
              className="block text-sm font-normal text-zinc-500 mb-1"
            >
              About Dentist
            </label>
            <textarea
              id="about"
              name="about"
              placeholder="write about yourself"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white font-normal rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Add doctor
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDentist;
