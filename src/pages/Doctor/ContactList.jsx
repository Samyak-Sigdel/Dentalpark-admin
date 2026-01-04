import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://dentalpark-server.onrender.com/api/user-contact/contactlist');
      const contactsData = Array.isArray(response.data) ? response.data : [];
      setContacts(contactsData);
    } catch (error) {
      toast.error('Failed to fetch contacts');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (contactId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'replied' ? 'pending' : 'replied';
      
     await axios.patch(`https://dentalpark-server.onrender.com/api/user-contact/contact/update-status/${contactId}`, {
      status: newStatus
    });

      setContacts(contacts.map(contact => 
        contact._id === contactId ? {...contact, status: newStatus} : contact
      ));

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Update error:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading contacts...</div>;

  return (
    <div className="w-full max-w-8xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-center mb-6">Contact Messages</h1>

      <div className="bg-gray-50 rounded-lg shadow-sm overflow-x-auto hide-scrollbar">
        <table className="min-w-full text-base">
          <thead className="text-gray-600 uppercase tracking-wide text-xs">
            <tr>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Phone</th>
              <th className="py-4 px-6 text-left">Message</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Date</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-white transition">
                  <td className="py-4 px-6 whitespace-nowrap">{contact.name}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{contact.email}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{contact.phoneNo}</td>
                  <td className="py-4 px-6 max-w-xs truncate">{contact.message}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span 
                      onClick={() => handleStatusUpdate(contact._id, contact.status)}
                      className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                        contact.status === 'replied' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      } transition-colors`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                  No contact messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;