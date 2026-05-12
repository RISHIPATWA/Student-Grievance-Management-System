const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  destinationName: {
    type: String,
    required: true
  },
  travelDate: {
    type: String,
    required: true
  },
  numberOfTravelers: {
    type: Number,
    required: true
  },
  packageType: {
    type: String,
    enum: ['Silver', 'Gold', 'Platinum'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Confirmed'
  },
  contactAddress: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
