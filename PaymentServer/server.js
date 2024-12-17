const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_2dGyiOUDkgEtw2",
  key_secret: "rYH6XevoTvWxDeZCFMVppzHf",
});

app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});
app.listen(4000, () => {
    console.log("Server running on http://localhost:5000");
});
