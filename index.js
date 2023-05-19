const express = require('express');
const usersRoute = require('./routes/usersRoute');
const VaccineSlot = require('./models/VaccineSlot');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const bcrypt = require('bcrypt');

const db = require('./config/mongoose');

// Create the Express app
const app = express();

// Middleware
app.use(express.json());

 // Manually add initial slots
 const addInitialSlots = async () => {
  try {
    const initialSlots = [
      {
        date: new Date('2023-06-01'),
        startTime: new Date('2023-06-01T10:00:00'),
        endTime: new Date('2023-06-01T10:30:00'),
        availableDoses: 10,
      },
      {
        date: new Date('2023-06-01'),
        startTime: new Date('2023-06-01T11:00:00'),
        endTime: new Date('2023-06-01T11:30:00'),
        availableDoses: 10,
      },
      // Add more slots as needed
    ];

    await VaccineSlot.insertMany(initialSlots);
    console.log('Initial slots added successfully');
  } catch (error) {
    console.error('Error adding initial slots:', error);
  }
};


// Call the function to add initial slots
addInitialSlots();

// Hash the admin password
const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }

  console.log('Hashed password:', hash);
});

// Routes
app.use('/', require('./routes/usersRoute'));
app.use('/admin', adminRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
