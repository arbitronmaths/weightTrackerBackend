const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// Define a simple schema for weight entries

const MONGO_URI = 'mongodb+srv://utakarsh15904:Iuf0InW8x6Wn9wdZ@weightcluster.jcqehem.mongodb.net/Weights?retryWrites=true&w=majority&appName=WeightCluster';

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const weightSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  weight: { type: Number, required: true },
});

const weightModel = mongoose.model('Weight', weightSchema);

app.get('/weights', async (req, res) => {
  try {
    const weights = await weightModel.find();
    res.json(weights);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weights' });
  }
});

app.post('/weights', async (req, res) => {
  console.log('Received POST request:', req.body);
  const { date, weight } = req.body;
  console.log('Received:', { date, weight });
  if (!date || !weight) {
    return res.status(400).json({ error: 'Date and weight are required urgently' });
  }

  try {
    const newWeight = new weightModel({ date, weight });
    const savedWeight = await newWeight.save();
    res.status(201).json(savedWeight);
  } catch (err) {
    res.status(500).json({ error: 'Error saving weight' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});