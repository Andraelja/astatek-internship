const mongoose = require('mongoose');

module.exports = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database Running!');
    } catch (error) {
        console.log('Database error!', error);
    }
}
