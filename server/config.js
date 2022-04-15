module.exports = {
  port: process.env.PORT || 1234,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    apiKey: process.env.TWILIO_API_KEY,
    apiSecret: process.env.TWILIO_API_SECRET,
  },
};
