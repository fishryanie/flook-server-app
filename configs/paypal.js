require('dotenv/config')
const paypal = require('paypal-rest-sdk');
const models = require('../models')

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
}).payment;

