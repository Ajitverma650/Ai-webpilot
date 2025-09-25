const axios = require('axios');
const JSZip = require('jszip');
const FormData = require('form-data');


const publishToNetlify = async (req, res) => {
    try {
        const { files, projectName, apiToken } = req.body;
        const netlifyToken = apiToken || process.env.NETLIFY_API_TOKEN;

        if (!netlifyToken) {
            return res.status(400).json({ error: 'Netlify API token is required' });
        }
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ error: 'No files provided' });
        }
        if (!files['index.html']) {
            return res.status(400).json({ error: 'index.html is required for Netlify deployment' });
        }

        const zip = new JSZip();
        for (const [filename, content] of Object.entries(files)) {
            zip.file(filename, content);
        }
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        const createSiteResponse = await axios.post(
            'https://api.netlify.com/api/v1/sites',
            { name: `${projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')}-${Date.now()}` },
            { headers: { 'Authorization': `Bearer ${netlifyToken}`, 'Content-Type': 'application/json' } }
        );
        const site = createSiteResponse.data;

        await axios.post(
            `https://api.netlify.com/api/v1/sites/${site.id}/deploys`,
            zipBuffer,
            { headers: { 'Authorization': `Bearer ${netlifyToken}`, 'Content-Type': 'application/zip' } }
        );

        res.json({
            id: site.id,
            name: projectName,
            url: site.ssl_url || site.url,
            adminUrl: site.admin_url,
            service: 'netlify',
            timestamp: new Date().toISOString(),
            status: 'published',
            files: Object.keys(files)
        });

    } catch (error) {
        console.error('Netlify publish error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        res.status(500).json({
            error: `Failed to publish to Netlify: ${error.response?.data?.message || error.message}`
        });
    }
};

const publishToGithub = async (req, res) => {
    try {
        const { files, projectName, token, username } = req.body;

        if (!token || !username) {
            return res.status(400).json({ error: 'GitHub token and username are required' });
        }
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ error: 'No files provided' });
        }

        const repoName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        const createRepoResponse = await axios.post(
            'https://api.github.com/user/repos',
            {
                name: repoName,
                description: `AI Generated Web Project: ${projectName}`,
                public: true,
                auto_init: true
            },
            { headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' } }
        );
        const repo = createRepoResponse.data;

        for (const [filename, content] of Object.entries(files)) {
            await axios.put(
                `https://api.github.com/repos/${username}/${repoName}/contents/${filename}`,
                {
                    message: `Add ${filename}`,
                    content: Buffer.from(content).toString('base64'),
                    branch: 'main'
                },
                { headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' } }
            );
        }

        try {
            await axios.post(
                `https://api.github.com/repos/${username}/${repoName}/pages`,
                { source: { branch: 'main', path: '/' } },
                { headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' } }
            );
        } catch (pagesError) {
            console.warn('Pages might already be enabled or repo is too new');
        }

        res.json({
            id: repo.id,
            name: projectName,
            url: `https://${username}.github.io/${repoName}`,
            githubUrl: repo.html_url,
            service: 'github-pages',
            timestamp: new Date().toISOString(),
            status: 'published',
            files: Object.keys(files)
        });
    } catch (error) {
        console.error('GitHub publish error:', error.response?.data || error.message);
        res.status(500).json({
            error: `Failed to publish to GitHub Pages: ${error.response?.data?.message || error.message}`
        });
    }
};

module.exports = { publishToNetlify, publishToGithub };