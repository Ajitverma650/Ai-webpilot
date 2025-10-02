import cors from 'cors';

const allowedOrigins = [
    'http://localhost:3000', // <-- I've added this line
    'http://localhost:5000',
    'https://ai-webpilot.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;