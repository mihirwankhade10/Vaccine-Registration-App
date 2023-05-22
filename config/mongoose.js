
const mongoose = require('mongoose');

// MongoDB Atlas connection URI
mongoose.Promise = global.Promise;

// aquire connection if it is succesful
const db = 'mongodb+srv://wankhadeabhi3:mihir123@cluster0.duv7med.mongodb.net/?retryWrites=true&w=majority';
// connect from mongodb
// mongoose.connect('mongodb://127.0.0.1:27017/Vaccine-Registration-Database');
   mongoose.connect(db).then(() => {
    console.log(`Connection is succesfull`);
   }).catch((err) => console.log(`no Connection`));
module.exports = db;
