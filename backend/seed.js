// seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Beautician = require('./models/Beautician');
const User = require('./models/User');

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/MaisonDeFFM');
    console.log('Database connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed services
const seedServices = async () => {
  const services = [
    // Massage services
    { name: 'Ventosa Massage', category: 'MASSAGE', description: 'Traditional cupping therapy for pain relief', price: 500, duration: '1 Hour' },
    { name: 'Swedish Massage', category: 'MASSAGE', description: 'Relaxing full body massage', price: 400, duration: '1 Hour' },
    { name: 'Traditional Hilot', category: 'MASSAGE', description: 'Traditional Filipino healing massage', price: 400, duration: '1 Hour' },
    { name: 'Half Body Massage', category: 'MASSAGE', description: 'Upper or lower body massage', price: 300, duration: '1 Hour' },
    { name: 'Foot Massage', category: 'MASSAGE', description: 'Reflexology foot massage', price: 250, duration: '1 Hour' },
    { name: 'Back Massage', category: 'MASSAGE', description: 'Focused back and shoulder massage', price: 250, duration: '30 mins' },
    { name: 'Facial Massage', category: 'MASSAGE', description: 'Relaxing facial massage', price: 250, duration: '30 mins' },

    // Nail services
    { name: 'Regular Manicure', category: 'NAILS', description: 'Basic manicure with polish', price: 1500, duration: '1 Hour' },
    { name: 'Manicure with Nail Extensions', category: 'NAILS', description: 'Manicure with acrylic or gel extensions', price: 3500, duration: '2 Hours' },
    { name: 'Manicure (18 & below)', category: 'NAILS', description: 'Special pricing for minors', price: 1000, duration: '1 Hour' },
    { name: 'Regular Pedicure', category: 'NAILS', description: 'Basic pedicure with polish', price: 1500, duration: '1 Hour' },
    { name: 'Pedicure (18 & below)', category: 'NAILS', description: 'Special pricing for minors', price: 1000, duration: '1 Hour' },

    // Waxing services
    { name: 'Eyebrows & Mouth', category: 'WAXING', description: 'Eyebrow and upper lip waxing', price: 2000, duration: '45 mins' },
    { name: 'Arms', category: 'WAXING', description: 'Full arm waxing', price: 2500, duration: '1 Hour' },
    { name: 'Legs', category: 'WAXING', description: 'Full leg waxing', price: 3500, duration: '1.5 Hours' },
    { name: 'Full Face', category: 'WAXING', description: 'Complete facial waxing', price: 2613, duration: '1 Hour' },
    { name: 'Full Body + Massage', category: 'WAXING', description: 'Full body waxing with massage', price: 8000, duration: '3 Hours' },

    // Threading services
    { name: 'Eyebrows', category: 'THREADING', description: 'Eyebrow threading', price: 3000, duration: '30 mins' },
    { name: 'Chin', category: 'THREADING', description: 'Chin threading', price: 1500, duration: '20 mins' },
    { name: 'Neck', category: 'THREADING', description: 'Neck threading', price: 2000, duration: '25 mins' },
    { name: 'Upper Lip', category: 'THREADING', description: 'Upper lip threading', price: 1500, duration: '15 mins' },
    { name: 'Side Burns', category: 'THREADING', description: 'Sideburns threading', price: 2000, duration: '20 mins' },
    { name: 'Forehead', category: 'THREADING', description: 'Forehead threading', price: 2678, duration: '25 mins' },
    { name: 'Full Face Threading', category: 'THREADING', description: 'Complete facial threading', price: 6000, duration: '1.5 Hours' },
  ];

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log('Services seeded successfully');
};

// Seed beauticians
const seedBeauticians = async () => {
  const beauticians = [
    { name: 'Anna', specialization: 'Massage Specialist', phone: '09123456789', email: 'anna@maisondeffm.com' },
    { name: 'Marie', specialization: 'Massage Therapist', phone: '09123456790', email: 'marie@maisondeffm.com' },
    { name: 'Jessa', specialization: 'Hilot Expert', phone: '09123456791', email: 'jessa@maisondeffm.com' },
    { name: 'Clara', specialization: 'Nail Artist', phone: '09123456792', email: 'clara@maisondeffm.com' },
    { name: 'Sophia', specialization: 'Nail Technician', phone: '09123456793', email: 'sophia@maisondeffm.com' },
    { name: 'Rica', specialization: 'Waxing Specialist', phone: '09123456794', email: 'rica@maisondeffm.com' },
    { name: 'Ella', specialization: 'Threading Specialist', phone: '09123456795', email: 'ella@maisondeffm.com' },
  ];

  await Beautician.deleteMany({});
  await Beautician.insertMany(beauticians);
  console.log('Beauticians seeded successfully');
};

// Seed users (admin, client, beautician)
const seedUsers = async () => {
  const users = [
    {
      name: 'Admin Mary',
      email: 'adminMary@maisonffm.com',
      password: 'adminMary2025',
      role: 'admin'
    },
    {
      name: 'Client Mary',
      email: 'marytalian18@gmail.com',
      password: 'Maryclient',
      role: 'client'
    },
    {
      name: 'Beautician Mary',
      email: 'beauticianMary@maisonffm.com',
      password: 'beauticianMary',
      role: 'beautician'
    }
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email.toLowerCase() });
    if (exists) {
      console.log(`User already exists: ${u.email}`);
      continue;
    }
    await User.create(u); // pre-save hook hashes password
    console.log(`User created: ${u.email}`);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();

    await seedServices();
    await seedBeauticians();
    await seedUsers();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
