// netlify/functions/proxy-media.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const url = event.queryStringParameters.url;
    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'URL parameter is required' })
        };
    }

    // Validate URL is from allowed domains (Dropbox)
    if (!url.includes('dropbox.com') && !url.includes('dropboxusercontent.com')) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Invalid domain' })
        };
    }

    try {
        // Process Dropbox URL
        let processedUrl = url;
        if (url.includes('www.dropbox.com')) {
            processedUrl = url
                .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
                .split('?')[0] + '?raw=1';
        }

        const response = await fetch(processedUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
                'Content-Disposition': 'inline'
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to fetch media',
                details: error.message
            })
        };
    }
};