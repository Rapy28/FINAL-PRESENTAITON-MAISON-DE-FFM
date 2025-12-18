require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// ✅ FIXED CORS - This solves network error!
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const promoRoutes = require('./routes/promoRoutes');
const beauticianRoutes = require('./routes/beauticianRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const safetyReportRoutes = require('./routes/safetyReportRoutes');
const fileRoutes = require('./routes/fileRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const healthRoutes = require('./routes/health');

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Maison De FFM Beauty Salon API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      services: '/api/services',
      promos: '/api/promos',
      beauticians: '/api/beauticians',
      inventory: '/api/inventory',
      safetyReports: '/api/safety-reports',
      files: '/api/files',
      notifications: '/api/notifications',
      reviews: '/api/reviews',
      payments: '/api/payments',
      health: '/health',
    },
  });
});

// API routes (removed duplicate authRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/beauticians', beauticianRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/safety-reports', safetyReportRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/health', healthRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  errorHandler(res, err.status || 500, err.message || 'Internal Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Test: http://localhost:${PORT}/`);
});
