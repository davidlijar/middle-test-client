'use client'
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface UserFormData {
  name: string;
  tel: string;
  address: string;
  intro: string;
}

interface ApiResponse {
  success: boolean;
}

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    tel: '',
    address: '',
    intro: ''
  });

  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error' | null;
  }>({
    text: '',
    type: null
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setMessage({
          text: 'User created successfully!',
          type: 'success'
        });
        setFormData({
          name: '',
          tel: '',
          address: '',
          intro: ''
        });
      } else {
        setMessage({
          text: 'Failed to create user.',
          type: 'error'
        });
      }
      
    } catch (error) {
      setMessage({
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        type: 'error'
      });
    }

    
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create User</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tel" className="block font-medium mb-1">
            Telephone:
          </label>
          <input
            type="tel"
            id="tel"
            name="tel"
            value={formData.tel}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block font-medium mb-1">
            Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="intro" className="block font-medium mb-1">
            Introduction:
          </label>
          <textarea
            id="intro"
            name="intro"
            value={formData.intro}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>

      {message.type && (
        <div
          className={`mt-4 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default UserForm;