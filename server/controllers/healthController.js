
const getHealth = (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
};

const getApiHealth = (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        apiVersion: '1.0.0',
        endpoints: ['/api/generate', '/api/publish/netlify', '/api/publish/github']
    });
};

module.exports = { getHealth, getApiHealth };