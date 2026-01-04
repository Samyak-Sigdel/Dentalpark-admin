import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FeedBackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('dToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('https://dentalpark-server.onrender.com/api/user-contact/feedbacks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const feedbacksData = Array.isArray(response.data?.data) 
          ? response.data.data 
          : Array.isArray(response.data) 
            ? response.data 
            : [];
            
        setFeedbacks(feedbacksData);
        setError(null);
      } catch (error) {
        setError(error);
        if (error.response?.status === 401) {
          toast.error('Please login to view feedbacks');
          navigate('/login');
        } else if (error.message === 'No authentication token found') {
          toast.error('Please login to continue');
          navigate('/login');
        } else {
          toast.error('Failed to fetch feedbacks');
          console.error('Fetch error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  if (loading) return <div className="text-center py-8">Loading feedbacks...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading feedbacks</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Customer Feedbacks</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div key={feedback._id} className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="font-semibold text-lg">
                    {feedback.userData?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {feedback.userData?.name || 'Anonymous User'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {feedback.userData?.email || 'No email provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <span className="mr-2 text-gray-700">Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600 text-sm">
                  ({feedback.rating}/5)
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 p-3 bg-gray-50 rounded-lg">
                "{feedback.comment}"
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span>
                  {new Date(feedback.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No feedbacks found
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedBackList;