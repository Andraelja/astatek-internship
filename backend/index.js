const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const database = require('./config/database');
database();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Port dari environment variable atau default 3000
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const parkingLotRoutes = require('./routes/parkingLotRoutes');
app.use('/api/parking-lot', parkingLotRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});