// src/components/Cart.jsx
import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const initialCartItems = [
  {
    id: 1,
    name: 'Item 1',
    price: 20,
    quantity: 1,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Item 2',
    price: 30,
    quantity: 1,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Item 3',
    price: 40,
    quantity: 1,
    image: 'https://via.placeholder.com/150',
  },
];

const Cart = ({ isOpen, closeCart }) => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleIncrease = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((items) => items.filter(item => item.id !== id));
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-y-0 right-0 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} bg-gray-100 shadow-lg w-80 p-4 z-50 opacity-90`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Cart</h2>
        <button onClick={closeCart} className="text-gray-500 hover:text-gray-800">
          <span className="sr-only">Close cart</span>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center border-b py-2 hover:scale-105 transition-transform">
            <img src={item.image} alt={item.name} className="h-16 w-16 rounded mr-4" />
            <div className="flex-grow">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">Price: ₹{item.price}</p>
              <div className="flex items-center mt-1">
                <button onClick={() => handleDecrease(item.id)} className="text-gray-500 hover:text-gray-800">
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => handleIncrease(item.id)} className="text-gray-500 hover:text-gray-800">
                  <PlusIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleRemove(item.id)} className="ml-4 text-red-500 hover:text-red-800">
                  Remove
                </button>
              </div>
            </div>
            <span className="ml-4">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Total: ₹{totalAmount}</h3>
      </div>
      <button className="mt-4 w-full font-bold bg-slate-700 text-white py-2 rounded hover:bg-slate-800">Buy Now</button>
    </div>
  );
};

export default Cart;
