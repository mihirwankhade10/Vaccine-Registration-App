// Import necessary dependencies and models

const User = require('../models/User');
const Slot = require('../models/TimeSlot');
const VaccineSlot = require('../models/VaccineSlot');
const moment = require('moment');

// User registration
const registerUser = async (req, res) => {
  try {
    // Get the request body data
    const { name, phoneNumber, age, pincode, aadharNo, password } = req.body;

    // Validation logic
    if (!name || !phoneNumber || !age || !pincode || !aadharNo || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'User with the provided phone number already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      phoneNumber,
      age,
      pincode,
      aadharNo,
      password,
    });

    // Save the user to the database
    await newUser.save();

    // Return a JSON response
    return res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle errors and return an appropriate JSON response
    console.log(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};
  
  // User login
const loginUser = async (req, res) => {
  try {
    // Get the request body data
    const { phoneNumber, password } = req.body;

    // Validation logic
    if (!phoneNumber || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    // Find the user in the database
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Return a JSON response
    return res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    // Handle errors and return an appropriate JSON response
    console.log(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};

// Add dummy slots
const addDummySlots = async (req, res) => {
  try {
    // Specify the date range for the slots
    const startDate = new Date('2023-06-01');
    const endDate = new Date('2023-06-30');

    // Specify the time range for the slots
    const startTime = 10; // 10 AM
    const endTime = 17; // 5 PM

    // Specify the slot duration in minutes
    const slotDuration = 30;

    // Specify the number of available doses per slot
    const availableDoses = 10;

    // Iterate through the date range and create slots for each day
    const slots = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const currentDateTime = new Date(currentDate);
      let currentHour = startTime;
      while (currentHour < endTime) {
        const slotStart = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), currentHour);
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000); // Convert minutes to milliseconds

        slots.push({
          date: currentDate,
          startTime: slotStart,
          endTime: slotEnd,
          availableDoses,
        });

        currentHour += 1; // Increment by 1 hour
      }
      currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
    }

    // Insert the slots into the database
    await VaccineSlot.insertMany(slots);

    // Return a JSON response indicating successful insertion
    return res.status(200).json({ message: 'Dummy slots added successfully' });
  } catch (error) {
    // Handle errors and return an appropriate JSON response
    console.error('Error adding dummy slots:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};


// Get available slots
const getAvailableSlots = async (req, res) => {
  try {
    // Get the requested date
    const { date } = req.query;

    // Validation logic
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Convert the requested date to a Date object
    const requestedDate = new Date(date);

    // Find available slots in the database for the requested date
    const availableSlots = await VaccineSlot.find({
      date: {
        $gte: new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate()),
        $lt: new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate() + 1),
      },
      availableDoses: { $gt: 0 },
    });

    // Return a JSON response with the available slots
    return res.status(200).json({ slots: availableSlots });
  } catch (error) {
    // Handle errors and return an appropriate JSON response
    console.error('Error fetching available slots:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};
  
// Register a slot
const registerSlot = async (req, res) => {
  try {
    const { userId, slotId } = req.body;

    // Validation logic
    if (!userId || !slotId) {
      return res.status(400).json({ error: 'User ID and Slot ID are required' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the slot exists and has available doses
    const slot = await VaccineSlot.findById(slotId);
    if (!slot || slot.availableDoses === 0) {
      return res.status(404).json({ error: 'Slot not found or no available doses' });
    }

    // Register the slot for the user
    user.registeredSlots.push(slotId);
    await user.save();

    // Decrement the available doses for the slot
    slot.availableDoses -= 1;
    await slot.save();

    // Return a JSON response indicating successful registration
    return res.status(200).json({ message: 'Slot registered successfully' });
  } catch (error) {
    // Handle errors and return an appropriate JSON response
    console.error('Error registering slot:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};
  
// update slot
const updateRegisteredSlot = async (req, res) => {
  try {
    const { userId, slotId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the slot exists
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    // Check if the user has a registered slot
    if (!user.slotId) {
      return res.status(400).json({ error: 'No registered slot found for the user' });
    }

    // Calculate the time difference between the current time and the registered slot time
    const currentTime = moment();
    const slotTime = moment(slot.startTime);
    const timeDiff = slotTime.diff(currentTime, 'hours');

    // Check if it is within the allowed time frame for slot update (24 hours prior)
    if (timeDiff <= 24) {
      return res.status(400).json({ error: 'Cannot update slot within 24 hours of the registered slot time' });
    }

    // Update the user's registered slot
    user.slotId = slotId;
    await user.save();

    return res.status(200).json({ message: 'Registered slot updated successfully' });
  } catch (error) {
    console.error('Error updating registered slot:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};
  
  module.exports = {
    registerUser,
    loginUser,
    getAvailableSlots,
    registerSlot,
    updateRegisteredSlot,
    addDummySlots
  };
  