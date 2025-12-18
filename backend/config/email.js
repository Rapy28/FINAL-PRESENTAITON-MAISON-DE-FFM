const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendPaymentReceipt = async (receiptDetails) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Maison De FFM <noreply@maisondeffm.com>',
    to: receiptDetails.email,
    subject: 'Payment Receipt - Maison De FFM',
    html: `
      <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #833a70, #a64d8a); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #ffdc5a; font-size: 32px; margin-bottom: 10px;">Payment Received!</h1>
          <p>Your payment has been successfully processed.</p>
        </div>
        <div style="background: rgba(131, 58, 112, 0.1); padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #ffdc5a; margin-bottom: 20px;">Receipt</h2>
          <div style="display: grid; gap: 15px;">
            <div><strong>Service:</strong> ${receiptDetails.serviceName}</div>
            <div><strong>Date:</strong> ${new Date(receiptDetails.date).toLocaleDateString()}</div>
            <div><strong>Time:</strong> ${receiptDetails.time}</div>
            <div><strong>Beautician:</strong> ${receiptDetails.beautician}</div>
            <div><strong>Address:</strong> ${receiptDetails.address}</div>
            <div><strong>Total:</strong> ₱${receiptDetails.totalPrice}</div>
            <div><strong>Payment Method:</strong> ${receiptDetails.paymentMethod}</div>
            <div><strong>Transaction ID:</strong> ${receiptDetails.transactionId}</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>Thank you for your payment!</p>
          <p>Contact us: customercare@FFM.com | 09123456789</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendBookingConfirmation = async (bookingDetails) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Maison De FFM <noreply@maisondeffm.com>',
    to: bookingDetails.email,
    subject: 'Booking Confirmation - Maison De FFM',
    html: `
      <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #833a70, #a64d8a); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #ffdc5a; font-size: 32px; margin-bottom: 10px;">Booking Confirmed!</h1>
          <p>Your appointment has been successfully booked.</p>
        </div>
        
        <div style="background: rgba(131, 58, 112, 0.1); padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #ffdc5a; margin-bottom: 20px;">Booking Summary</h2>
          <div style="display: grid; gap: 15px;">
            <div><strong>Service:</strong> ${bookingDetails.serviceName}</div>
            <div><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</div>
            <div><strong>Time:</strong> ${bookingDetails.time}</div>
            <div><strong>Beautician:</strong> ${bookingDetails.beautician}</div>
            <div><strong>Address:</strong> ${bookingDetails.address}</div>
            <div><strong>Total:</strong> ₱${bookingDetails.totalPrice}</div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>Thank you for choosing Maison De FFM!</p>
          <p>Contact us: customercare@FFM.com | 09123456789</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendBookingAndPaymentConfirmation = async (details) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Maison De FFM <noreply@maisondeffm.com>',
    to: details.email,
    subject: 'Booking and Payment Confirmation - Maison De FFM',
    html: `
      <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #833a70, #a64d8a); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #ffdc5a; font-size: 32px; margin-bottom: 10px;">Booking Confirmed & Payment Received!</h1>
          <p>Your appointment has been booked and payment has been successfully processed.</p>
        </div>
        <div style="background: rgba(131, 58, 112, 0.1); padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #ffdc5a; margin-bottom: 20px;">Appointment & Payment Details</h2>
          <div style="display: grid; gap: 15px;">
            <div><strong>Service:</strong> ${details.serviceName}</div>
            <div><strong>Date:</strong> ${new Date(details.date).toLocaleDateString()}</div>
            <div><strong>Time:</strong> ${details.time}</div>
            <div><strong>Beautician:</strong> ${details.beautician}</div>
            <div><strong>Address:</strong> ${details.address}</div>
            <div><strong>Total:</strong> ₱${details.totalPrice}</div>
            <div><strong>Payment Method:</strong> ${details.paymentMethod}</div>
            <div><strong>Transaction ID:</strong> ${details.transactionId}</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>Thank you for choosing Maison De FFM!</p>
          <p>Contact us: customercare@FFM.com | 09123456789</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation, sendPaymentReceipt, sendBookingAndPaymentConfirmation };