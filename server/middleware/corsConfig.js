const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  /\.vercel\.app$/   // Regex: allow any subdomain of vercel.app
];

module.exports = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman

    if (
      allowedOrigins.some(o =>
        o instanceof RegExp ? o.test(origin) : o === origin
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});
