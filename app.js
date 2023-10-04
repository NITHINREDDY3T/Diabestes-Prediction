const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Set up MongoDB connection
mongoose.connect('mongodb+srv://nikky:ammanana@cluster0.mh5azvu.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

// Define a mongoose schema and model for user data with additional fields
const userSchema = new mongoose.Schema({
  username: String,
  age: Number,
  glucose: Number,
  bmi: Number, // Add more fields as needed
  familyHistory: Boolean,
  bloodPressure: Number,
});

const User = mongoose.model('User', userSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/predict', async (req, res) => {
  const { username, age, glucose, bmi, familyHistory, bloodPressure } = req.body;

  // For simplicity, we use a basic rule-based prediction.
  let prediction = 'Negative';
  if (glucose >= 140) {
    prediction = 'Positive';
  }

  try {
    // Create a new User document
    const newUser = new User({
      username,
      age,
      glucose,
      bmi,
      familyHistory,
      bloodPressure,
    });

    // Save the new user to the database using await
    await newUser.save();

    res.render('result', { username, prediction });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data to the database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
