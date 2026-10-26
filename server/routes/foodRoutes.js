const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// GET /api/foods — get all foods
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category, isAvailable: true } : { isAvailable: true };
    const foods = await Food.find(filter);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/foods/:id — get single food
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/foods — add new food (admin use)

router.post('/', async (req, res) => {
  try {
    const food = new Food(req.body);
    const savedFood = await food.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/foods/:id — delete a food
router.delete('/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;