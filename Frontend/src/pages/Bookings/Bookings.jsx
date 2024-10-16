import React from 'react'
import { useUser } from '../../context/userContext';

const Bookings = () => {
    const { state } = useUser();
  return (
    <div>
      {
        state.user ? (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center">Bookings</h2>
                    <div className="mt-4">
                        <p className="text-gray-600">Name: {state.user.name}</p>
                        <p className="text-gray-600">Email: {state.user.email}</p>
                        <p className="text-gray-600">Country: {state.user.country}</p>
                        <p className="text-gray-600">State: {state.user.state}</p>
                        <p className="text-gray-600">City: {state.user.city}</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center">Bookings</h2>
                    <p className="text-gray-600">Please login to view your bookings</p>
                </div>
            </div>
        )

      }
    </div>
  )
}

export default Bookings
