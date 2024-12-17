// Cart.jsx
import React, { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { toast } from "sonner";
import { Trash2, PlusCircle, MinusCircle, X } from "lucide-react";

const Cart = ({ isOpen, onClose }) => {
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
      const response = await fetch("https://projectg-1.onrender.com/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, currency: "INR" }),
      });

      const data = await response.json();

      if (!data.orderId) {
        throw new Error("Failed to create Razorpay order.");
      }

      const options = {
        key: "rzp_test_2dGyiOUDkgEtw2", // Replace with your Razorpay Key ID
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
            onClose(); // Close the cart after successful payment
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
      onClick={onClose}
      className={`fixed inset-0 bg-black bg-opacity-30 ${isOpen ? 'block' : 'hidden'}`}
      style={{ zIndex: 100 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 right-0 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        bg-white shadow-2xl w-[450px] h-full overflow-hidden z-50`}
      >
        <div className="bg-slate-700 text-white p-6 flex justify-between items-center h-16">
          <h2 className="text-3xl font-bold">Your Lobby</h2>
          <button
            onClick={() => onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100vh-250px)]">
          {activities.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-2xl mb-4">Your lobby is empty</p>
              <p>Explore our game venues and start booking!</p>
            </div>
          ) : (
            activities.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center space-x-4 ">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div>
                    <h3 className="font-bold text-xl">{item.title}</h3>
                    <p className="text-gray-600">₹{item.price} per session</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-20" >
                  <div className="flex items-center border rounded-full">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="p-2 hover:bg-blue-100 rounded-l-full"
                    >
                      <MinusCircle size={20} className="text-blue-600" />
                    </button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="p-2 hover:bg-blue-100 rounded-r-full"
                    >
                      <PlusCircle size={20} className="text-blue-600" />
                    </button>
                  </div>

                  <div className="text-right w-24">
                    <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {activities.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xl font-bold">Total:</p>
                <p className="text-gray-600">Includes all taxes and fees</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-blue-700">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={handleRazorpayPayment}
              className="w-full bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
              disabled={activities.length === 0}
            >
              Pay with Razorpay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;