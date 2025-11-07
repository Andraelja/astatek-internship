const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('./models/userModel');
const ParkingLot = require('./models/parkingLotModel');
const ParkingSlot = require('./models/parkingSlotModel');
const Booking = require('./models/bookingModel');

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to database for seeding');

    // Read seed data
    const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf-8'));

    // Clear existing data
    await User.deleteMany({});
    await ParkingLot.deleteMany({});
    await ParkingSlot.deleteMany({});
    await Booking.deleteMany({});

    // Insert users
    if (seedData.users && seedData.users.length > 0) {
      await User.insertMany(seedData.users);
      console.log('Users seeded');
    }

    // Insert parking lots
    if (seedData.parkingLots && seedData.parkingLots.length > 0) {
      await ParkingLot.insertMany(seedData.parkingLots);
      console.log('Parking lots seeded');
    }

    // Insert parking slots
    if (seedData.parkingSlots && seedData.parkingSlots.length > 0) {
      await ParkingSlot.insertMany(seedData.parkingSlots);
      console.log('Parking slots seeded');
    }

    // Insert bookings
    if (seedData.bookings && seedData.bookings.length > 0) {
      await Booking.insertMany(seedData.bookings);
      console.log('Bookings seeded');
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();
