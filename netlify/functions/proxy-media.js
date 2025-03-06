// netlify/functions/proxy-media.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    // Handle OPTIONS request (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const url = event.queryStringParameters.url;
    if (!url) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'URL parameter is required' })
        };
    }

    console.log('Original URL:', url);

    try {
        // Simple URL transformation for Dropbox - just add dl=1 if not present
        let fetchUrl = url;
        
        if (url.includes('dropbox.com')) {
            // Add dl=1 parameter if not already present
            if (!fetchUrl.includes('dl=1')) {
                fetchUrl += fetchUrl.includes('?') ? '&dl=1' : '?dl=1';
            }
        }

        console.log('Fetching URL:', fetchUrl);

        // Fetch the media
        const response = await fetch(fetchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            redirect: 'follow',
            timeout: 30000
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        console.log('Successfully fetched media:', {
            contentType,
            size: buffer.length
        });

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000'
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        console.error('Proxy error:', error.message);
        
        return {
            statusCode: 500,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to fetch media',
                details: error.message,
                url
            })
        };
    }
};