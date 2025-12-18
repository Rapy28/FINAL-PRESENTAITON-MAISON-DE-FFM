
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);


async function sendPaymentReceiptSMS(smsDetails) {
  const message = `Maison De FFM\nPayment Received!\nService: ${smsDetails.serviceName}\nDate: ${smsDetails.date}\nTime: ${smsDetails.time}\nBeautician: ${smsDetails.beautician}\nTotal: ₱${smsDetails.totalPrice}\nTransaction ID: ${smsDetails.transactionId}`;
  await client.messages.create({
    body: message,
    from: fromNumber,
    to: smsDetails.to,
  });
}

module.exports = { sendPaymentReceiptSMS };