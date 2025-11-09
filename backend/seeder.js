const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/userModel');
const ParkingLot = require('./models/parkingLotModel');
const ParkingSlot = require('./models/parkingSlotModel');
const Booking = require('./models/bookingModel');

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database for seeding');

    // Read seed data
    const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf-8'));

    // Clear existing data
    await User.deleteMany({});
    await ParkingLot.deleteMany({});
    await ParkingSlot.deleteMany({});
    await Booking.deleteMany({});

    // Insert users with hashed passwords
    if (seedData.users && seedData.users.length > 0) {
      const usersWithHashedPasswords = await Promise.all(seedData.users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      }));
      await User.insertMany(usersWithHashedPasswords);
      console.log('Users seeded');
    }

    // Insert parking lots
    if (seedData.parkingLots && seedData.parkingLots.length > 0) {
      const insertedLots = await ParkingLot.insertMany(seedData.parkingLots);
      console.log('Parking lots seeded');

      // Map lot names to IDs for slots
      const lotMap = {};
      insertedLots.forEach((lot, index) => {
        lotMap[`LOT_ID_${index + 1}`] = lot._id;
      });

      // Insert parking slots with correct lot_ids
      if (seedData.parkingSlots && seedData.parkingSlots.length > 0) {
        const slotsWithCorrectIds = seedData.parkingSlots.map(slot => ({
          ...slot,
          lot_id: lotMap[slot.lot_id]
        }));
        await ParkingSlot.insertMany(slotsWithCorrectIds);
        console.log('Parking slots seeded');
      }
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
