// Use the default import if node-fetch version is ESM compatible
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
const moment = require("moment");
const fs = require("fs");

const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");
const updateRoutes = require("./routes/update.js");
const commentRoutes = require("./routes/comment.js");
const returnRoutes = require("./routes/return.js");
const withdrawalRoutes = require("./routes/withdrawal.js");
const topupRoutes = require("./routes/topup.js");


app.use(cors());
app.use(express.json());


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static("public"));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/withdrawals", withdrawalRoutes);
app.use("/topups", topupRoutes);
app.use("/users", userRoutes);
app.use("/updates", updateRoutes);
app.use("/comments", commentRoutes);
app.use("/returns", returnRoutes);

// Function to get access token
const getAccessToken = async () => {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = 'Basic ' + Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: auth,
    },
  });

  const data = await response.json();
  return data.access_token;
};

// MPESA STK PUSH ROUTE
app.post("/mpesa/stkpush", async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body; // Get phone number and amount from request body
    const accessToken = await getAccessToken();

    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      `${process.env.BUSINESS_SHORT_CODE}${process.env.PASSWORD}${timestamp}`
    ).toString("base64");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber, // Phone number to receive the STK push
        PartyB: process.env.BUSINESS_SHORT_CODE,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: "UMESKIA PAY",
        TransactionDesc: "Mpesa Daraja API STK push test",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate STK push");
    }

    res.send("😀 Request is successful done ✔✔. Please enter MPesa pin to complete the transaction");
  } catch (error) {
    console.log(error);
    res.status(500).send("❌ Request failed");
  }
});

// STK PUSH CALLBACK ROUTE
app.post("/mpesa/callback", (req, res) => {
  console.log("STK PUSH CALLBACK");
  const CheckoutRequestID = req.body.Body.stkCallback.CheckoutRequestID;
  const ResultCode = req.body.Body.stkCallback.ResultCode;
  
  var json = JSON.stringify(req.body);
  fs.writeFile("stkcallback.json", json, "utf8", function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("STK PUSH CALLBACK JSON FILE SAVED");
  });
  
  console.log(req.body);
  res.send("Callback received");
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URL, { dbName: "CrowdFund_Project" })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
