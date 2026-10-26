const mongoose = require('mongoose');
const Food = require('./models/Food');
require('dotenv').config();

const foods = [
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, cheese and special sauce',
    price: 199,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    name: 'Chicken Burger',
    description: 'Crispy fried chicken with mayo and fresh veggies',
    price: 179,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400'
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella and fresh basil',
    price: 299,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni, cheese and tangy tomato sauce',
    price: 349,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'
  },
  {
    name: 'Veg Fried Rice',
    description: 'Wok tossed rice with vegetables and soy sauce',
    price: 149,
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400'
  },
  {
    name: 'Chicken Hakka Noodles',
    description: 'Stir fried noodles with chicken and crunchy vegetables',
    price: 179,
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400'
  },
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in rich creamy tomato gravy, served with naan',
    price: 269,
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400'
  },
  {
    name: 'Paneer Tikka Masala',
    description: 'Soft paneer cubes in spiced onion tomato masala',
    price: 239,
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400'
  },
  {
    name: 'Mango Lassi',
    description: 'Chilled yogurt drink blended with fresh mango pulp',
    price: 89,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400'
  },
  {
    name: 'Cold Coffee',
    description: 'Creamy blended coffee with ice cream and chocolate drizzle',
    price: 119,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'
  },
  {
    name: 'Chocolate Brownie',
    description: 'Warm fudgy brownie served with vanilla ice cream',
    price: 149,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in rose flavoured sugar syrup',
    price: 99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1601303516534-bf4c3e209f9e?w=400'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Food.deleteMany({});
    console.log('Old food data cleared');

    await Food.insertMany(foods);
    console.log('✅ 12 food items seeded successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();