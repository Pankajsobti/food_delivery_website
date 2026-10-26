const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Burgers', 'Pizza', 'Chinese', 'Indian', 'Drinks', 'Desserts']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Food'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);