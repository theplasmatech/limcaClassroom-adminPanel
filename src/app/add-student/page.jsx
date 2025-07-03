'use client';

import { useState } from 'react';

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    last_qualification: '',
    location: '',
    joining_date: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === 'email') {
      updatedValue = value.toLowerCase();
    }

    if (name === 'phone') {
      updatedValue = value.replace(/\D/g, '').slice(0, 10); // Keep only digits, max 10
    }

    setFormData({ ...formData, [name]: updatedValue });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage('Phone number must be exactly 10 digits');
      return;
    }

    setShowConfirmation(true);
  };


  const confirmSubmission = async () => {
    try {
      setLoading(true);
      setShowConfirmation(false);

      const response = await fetch('https://limca-classroom-backend.vercel.app/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      setMessage('Student registered successfully');
      setFormData({
        name: '',
        phone: '',
        email: '',
        gender: '',
        last_qualification: '',
        location: '',
        joining_date: '',
      });
    } catch (error) {
      setMessage('Registration failed. Please try again');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubmission = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-light tracking-wide text-black">
            Student Registration
          </h1>
          <div className="w-12 h-0.5 bg-black mt-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={['Male', 'Female', 'Other']}
            />
          </div>

          {/* Academic Information Section */}
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Academic Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Last Qualification"
                name="last_qualification"
                value={formData.last_qualification}
                onChange={handleChange}
                placeholder="e.g., Bachelor's Degree"
              />
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>

            <Input
              label="Joining Date"
              name="joining_date"
              type="date"
              value={formData.joining_date}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black text-white py-4 px-8 font-light tracking-wide 
                       hover:bg-gray-800 transition-all duration-300 disabled:opacity-50
                       disabled:cursor-not-allowed border-2 border-black hover:border-gray-800"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                'Register Student'
              )}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 text-center font-light ${message.includes('successfully')
                ? 'text-black bg-gray-50'
                : 'text-gray-700 bg-gray-50'
              }`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-8 border-2 border-black">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📧</span>
              </div>

              <h3 className="text-xl font-light mb-4 text-black">
                Confirm Email Address
              </h3>

              <p className="text-gray-600 mb-2 font-light">
                Please verify your email address:
              </p>

              <div className="bg-gray-50 p-4 mb-6 border border-gray-200">
                <span className="font-medium text-black">{formData.email}</span>
              </div>

              <p className="text-sm text-gray-500 mb-8 font-light">
                This email will be used for all communication regarding your registration.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={cancelSubmission}
                  className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 
                           hover:border-gray-400 transition-colors font-light"
                >
                  Edit Email
                </button>
                <button
                  onClick={confirmSubmission}
                  className="flex-1 py-3 px-6 bg-black text-white border-2 border-black
                           hover:bg-gray-800 hover:border-gray-800 transition-colors font-light"
                >
                  Confirm & Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quirky Footer */}
      <div className="border-t border-gray-100 mt-16">
        <div className="max-w-2xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-400 font-light">
            Made with minimal effort, maximum style ✨
          </p>
        </div>
      </div>
    </div>
  );
}

// Input Component
function Input({ label, name, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-black
                 focus:border-black focus:outline-none transition-colors
                 placeholder-gray-400 font-light"
        required
      />
    </div>
  );
}

// Select Component
function Select({ label, name, value, onChange, options = [] }) {
  return (
    <div className="group relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-black
                 focus:border-black focus:outline-none transition-colors font-light
                 appearance-none cursor-pointer"
        required
      >
        <option value="" className="text-gray-400">Choose an option</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-black">{opt}</option>
        ))}
      </select>
    </div>
  );
}