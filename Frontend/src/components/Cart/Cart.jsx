// Cart.jsx
import React, { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { toast } from "sonner";

const Cart = ({ isOpen, closeCart }) => {
  const [cartItems, setCartItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const user = auth.currentUser;

  // Fetch user's cart from Firestore
  const fetchActivities = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const cart = userData.cart || [];
        setCartItems(cart);

        const activityPromises = cart.map(async (item) => {
          const activityRef = doc(db, "activities", item.activityId);
          const activityDoc = await getDoc(activityRef);

          if (activityDoc.exists()) {
            return {
              ...activityDoc.data(),
              id: item.activityId,
              quantity: item.count,
            };
          }
        });

        const activitiesDetails = await Promise.all(activityPromises);
        setActivities(activitiesDetails.filter(Boolean));
      }
    } catch (error) {
      console.error("Error fetching cart or activities:", error.message);
      toast.error("Failed to fetch cart items");
    }
  };

  useEffect(() => {
    if (user && isOpen) {
      fetchActivities();
    }
  }, [user, isOpen]);

  // Update cart in Firestore
  const updateCartInFirestore = async (updatedCartItems) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { cart: updatedCartItems });
      } catch (error) {
        toast.error("Error updating cart");
        console.error("Error updating cart in Firestore:", error.message);
      }
    }
  };

  const handleIncrease = async (id) => {
    const updatedItems = cartItems.map((item) =>
      item.activityId === id ? { ...item, count: item.count + 1 } : item
    );

    setCartItems(updatedItems);
    await updateCartInFirestore(updatedItems);
    await fetchActivities();
  };

  const handleDecrease = async (id) => {
    const updatedItems = cartItems.map((item) =>
      item.activityId === id && item.count > 1
        ? { ...item, count: item.count - 1 }
        : item
    );

    setCartItems(updatedItems);
    await updateCartInFirestore(updatedItems);
    await fetchActivities();
  };

  const handleRemove = async (id) => {
    const updatedItems = cartItems.filter((item) => item.activityId !== id);

    setCartItems(updatedItems);
    await updateCartInFirestore(updatedItems);
    await fetchActivities();
  };

  // Calculate total amount
  const totalAmount = activities.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Razorpay Payment Integration
  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK is not loaded");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, currency: "INR" }),
      });

      const data = await response.json();

      if (!data.orderId) {
        throw new Error("Failed to create Razorpay order.");
      }

      const options = {
        key: "rzp_test_mat6Yl4N53bNuY", // Replace with your Razorpay Key ID
        amount: totalAmount * 100,
        currency: "INR",
        name: "Ziplay",
        description: "Purchase Description",
        image: "https://your-logo-url.com/logo.png",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const bookingData = {
              userId: user?.uid,
              userEmail: user?.email || "guest@example.com",
              activities: activities.map((item) => ({
                activityId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
              })),
              totalAmount: totalAmount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              paymentStatus: "success",
              createdAt: new Date().toISOString(),
            };

            const bookingsRef = collection(db, "bookings");
            await addDoc(bookingsRef, bookingData);

            // Clear cart after successful payment
            setCartItems([]);
            setActivities([]);
            await updateCartInFirestore([]);

            toast.success("Payment successful! Booking saved.");
            closeCart(); // Close the cart after successful payment
          } catch (error) {
            console.error("Error saving booking to Firestore:", error.message);
            toast.error("Payment successful, but booking save failed");
          }
        },
        prefill: {
          name: user?.displayName || "Guest",
          email: user?.email || "guest@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        console.error("Payment Failed", response.error);
        toast.error("Payment Failed: " + response.error.description);
      });
    } catch (error) {
      console.error("Error in Razorpay payment:", error);
      toast.error("Failed to initiate payment");
    }
  };

  // Prevent cart from closing when clicking inside the cart
  const handleCartClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={closeCart}
      className={`fixed inset-0 ${isOpen ? 'block' : 'hidden'}`}
      style={{ zIndex: 100 }}
    >
      <div
        onClick={handleCartClick}
        className={`fixed inset-y-0 right-0 transform transition-transform 
          ${isOpen ? "translate-x-0" : "translate-x-full"} 
          bg-gray-100 shadow-lg w-80 p-4 z-50 opacity-90`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Cart</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-gray-800">
            <span className="sr-only">Close cart</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4">
          {activities.length > 0 ? (
            activities.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b py-2 hover:scale-105 transition-transform"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-16 w-16 rounded mr-4"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-600">Price: ₹{item.price}</p>
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="ml-4 text-red-500 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span className="ml-4">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Your cart is empty</p>
          )}
        </div>

        <div className="mt-4">
          <h3 className="font-bold">Total: ₹{totalAmount.toFixed(2)}</h3>
          <button
            onClick={handleRazorpayPayment}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4 w-full"
            disabled={activities.length === 0}
          >
            Pay with Razorpay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;