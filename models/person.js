/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
// console.log(`connecting to ${url}`);
mongoose.connect(url)
  .then(() => {
    // console.log('connected to MongoDB');
  })
  .catch(() => {
    // console.log('error connecting to MongoDB:', error.message);
  });
function validateNumber(value) {
  const regex = /^[0-9]{2,3}-[0-9]{6,10}$/;
  return regex.test(value);
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: validateNumber,
  },
});
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
