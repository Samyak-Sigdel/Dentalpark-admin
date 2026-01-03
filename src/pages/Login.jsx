import React, { useContext, useState } from 'react'
import { MdEmail, MdLock, MdPerson } from 'react-icons/md'
import { AdminContext } from '../context/AdminContext'
import axios from "axios"
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Login = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (userType === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success("Login successful!")
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success("Doctor Login successful!")
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* User Type Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative bg-white p-1 rounded-full shadow-inner">
          <div className="relative bg-white p-1 rounded-full shadow-inner">
  {/* Replaced motion.div with regular div + Tailwind transition */}
  <div 
    className={`absolute top-1 bottom-1 w-1/2 bg-teal-600 rounded-full z-0 transition-all duration-300 ${
      userType === 'Admin' ? 'left-1' : 'left-1/2'
    }`}
  />
  <button
    type="button"
    className={`relative z-10 w-32 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
      userType === 'Admin' ? 'text-white' : 'text-gray-600'
    }`}
    onClick={() => setUserType('Admin')}
  >
    Admin
  </button>
  <button
    type="button"
    className={`relative z-10 w-32 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
      userType === 'Doctor' ? 'text-white' : 'text-gray-600'
    }`}
    onClick={() => setUserType('Doctor')}
  >
    Doctor
  </button>
</div>
          </div>
        </div>

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                <MdPerson className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {userType} Login
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Please sign in to your account
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our <a href="#" className="text-teal-600 hover:text-teal-500">Terms of Service</a> and <a href="#" className="text-teal-600 hover:text-teal-500">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login