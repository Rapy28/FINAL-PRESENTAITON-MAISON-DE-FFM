const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/MaisonDeFFM';

(async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB host:', conn.connection.host);

    const admin = conn.connection.db.admin();
    const result = await admin.ping();
    console.log('Ping result:', result);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Test connection failed:', err.message || err);
    process.exit(1);
  }
})();
