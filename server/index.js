const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root route to prevent 404
app.get('/', (req, res) => {
  res.send('LMS API is running');
});

async function start() {
  try {
    await initializeDatabase();
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
