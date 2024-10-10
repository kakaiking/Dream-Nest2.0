// Use the default import if node-fetch version is ESM compatible
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const router = express.Router();
const moment = require('moment');

// Helper function to get access token
async function getAccessToken() {
  const consumer_key = process.env.MPESA_CONSUMER_KEY;
  const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = "Basic " + Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: auth,
      },
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

// C2B Payment route
router.post('/c2bpayment', async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    const accessToken = await getAccessToken();
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = "Bearer " + accessToken;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE +
      process.env.MPESA_PASSKEY +
      timestamp
    ).toString("base64");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.BASE_URL}/mpesa/callback`,
        AccountReference: "File Returns Payment",
        TransactionDesc: "Payment for filing returns",
      }),
    });

    const data = await response.json();
    res.status(200).json({ message: "STK push initiated", data: data });
  } catch (error) {
    console.error('Error in C2B payment:', error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

// Callback route
router.post('/callback', (req, res) => {
  console.log("M-PESA Callback received:", req.body);
  // Process the callback data and update the payment status in your database
  // You may want to emit a socket event or use some other method to update the client
  res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
});

module.exports = router;