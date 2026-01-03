import React, { useContext } from 'react';
import logo from '../../src/assets/logoside.jpg';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
    }

    if (dToken) {
      setDToken('');
      localStorage.removeItem('dToken');
    }

    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 w-full z-10  h-20 bg-white">
      <div className="container mx-10 px-4 ">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Dental Park Logo"
              className="rounded w-64 h-20"
            />
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-teal-600 font-medium">
              <p>{aToken ? 'Admin' : dToken ? 'Doctor' : ''} Panel</p>
            </div>
            <button
              onClick={logout}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
