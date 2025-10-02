const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;

const corsMiddleware = require('./middleware/corsConfig'); // use the middleware properly

const generateRoute = require('./routes/generateRoute');
const publishRoutes = require('./routes/publishRoutes');
const healthRoutes = require('./routes/healthRoutes');
app.use(corsMiddleware);


app.use(express.json({ limit: '10mb' }));

app.use('/api/generate', generateRoute);
app.use('/api/publish', publishRoutes);
app.use('/health', healthRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error("Server error:", err);
});
