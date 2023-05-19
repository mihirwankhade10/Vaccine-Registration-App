const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

//admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the admin in the database
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ adminId: admin._id }, 'mihirwankhade');

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};


const getTotalRegisteredUsers = async (req, res) => {
  try {
    const { age, pincode, vaccinationStatus } = req.query;

    // Prepare the filter criteria
    const filter = {};

    if (age) {
      filter.age = age;
    }

    if (pincode) {
      filter.pincode = pincode;
    }

    if (vaccinationStatus) {
      filter.vaccinationStatus = vaccinationStatus;
    }

    // Count the users based on the filter
    const totalUsers = await User.countDocuments(filter);

    return res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Error while fetching total registered users:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};

exports.getTotalRegisteredUsers = async (req, res) => {
    try {
      const count = await User.countDocuments();
      res.json({ count });
    } catch (error) {
      console.error('Error fetching total registered users count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
  adminLogin,
  getTotalRegisteredUsers,
};
