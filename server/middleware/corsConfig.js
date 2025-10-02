const cors = require('cors');

const allowedOrigins = [
    'http://localhost:3000', // local frontend
    'http://localhost:5000',
     // another local port
     'http://localhost:5173',
];

const corsOptions = {
    origin: (origin, callback) => {
        // allow requests from localhost
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // allow any Vercel frontend
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // block others
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;

