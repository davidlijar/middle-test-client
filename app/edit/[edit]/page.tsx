// pages/edit/[id].tsx
'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';

interface UserData {
  id: number;
  name: string;
  tel: string;
  address: string;
  intro: string;
}

interface EditUserPageProps {
  user: UserData;
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/users');
    const users: UserData[] = await response.json();

    // Create paths for each user
    const paths = users.map((user) => ({
      params: { id: user.id.toString() }
    }));

    return {
      paths,
      fallback: 'blocking' // Show a loading state while generating new pages
    };
  } catch (error) {
    // If there's an error fetching users, return empty paths
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
};

export const getStaticProps: GetStaticProps<EditUserPageProps> = async ({ params }) => {
  try {
    if (!params?.id) {
      return {
        notFound: true
      };
    }

    const response = await fetch(`http://localhost:8080/api/user/${params.id}`);
    
    if (!response.ok) {
      return {
        notFound: true
      };
    }

    const user: UserData = await response.json();

    return {
      props: {
        user
      },
      revalidate: 60 // Revalidate page every 60 seconds
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};

const EditUserPage: React.FC<EditUserPageProps> = ({ user }) => {
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserData>(user);

  // Handle if the page is being generated
  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    setSubmitLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/update/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Show success message
      alert('User updated successfully!');
      // Redirect back to users list
      router.push('/users');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      alert('Failed to update user. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-100 border-b">
          <h1 className="text-xl font-bold text-gray-900">Edit User</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
              Telephone
            </label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="intro" className="block text-sm font-medium text-gray-700">
              Introduction
            </label>
            <textarea
              id="intro"
              name="intro"
              value={formData.intro}
              onChange={handleInputChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="p-3 text-red-700 bg-red-100 rounded">
              {error}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={submitLoading}
              className={`px-4 py-2 text-white rounded-md ${
                submitLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update User'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/users')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;