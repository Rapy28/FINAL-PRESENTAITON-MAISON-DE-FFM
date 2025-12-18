const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
	booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
	amount: { type: Number, required: true },
	method: { type: String, enum: ['cash', 'card', 'gcash', 'other'], required: true },
	status: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
	transactionId: { type: String },
	paymentScreenshot: { type: String },
	cardDetails: { type: Object },
	paidAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
