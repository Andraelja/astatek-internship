const mongoose = require('mongoose');

module.exports = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database Running!');
    } catch (error) {
        console.log('Database error!', error);
    }
}