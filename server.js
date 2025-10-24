const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT||3000;
const MONGO_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

// Define a simple schema for weight entries


// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const weightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  weight: { type: Number, required: true },
});

const weightModel = mongoose.model('Weight', weightSchema);

// Protected route - get user weights
app.get('/weights', auth, async (req, res) => {
  try {
    const weights = await weightModel.find({ userId: req.user.id });
    res.json(weights);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weights' });
  }
});

// Protected route - add weight
app.post('/weights', auth, async (req, res) => {
  const { date, weight } = req.body;
  if (!date || !weight) {
    return res.status(400).json({ error: 'Date and weight are required urgently' });
  }

  try {
    const newWeight = new weightModel({ userId: req.user.id, date, weight });
    const savedWeight = await newWeight.save();
    res.status(201).json(savedWeight);
  } catch (err) {
    res.status(500).json({ error: 'Error saving weight' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});