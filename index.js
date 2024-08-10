const express = require('express');
const db = require('./config/database'); 
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); 
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');

const app = express();
const port = 3001;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', forgotPasswordRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
