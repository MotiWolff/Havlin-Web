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
        
        // Handle different Dropbox URL formats
        if (url.includes('www.dropbox.com')) {
            // Extract the file path and any additional parameters
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            const params = new URLSearchParams(urlObj.search);
            const rlkey = params.get('rlkey'); // Get the rlkey if it exists
            
            // Convert to dl.dropboxusercontent.com format
            processedUrl = `https://dl.dropboxusercontent.com${path}`;
            
            // Add necessary parameters
            if (rlkey) {
                processedUrl += `?rlkey=${rlkey}&raw=1`;
            } else {
                processedUrl += '?raw=1';
            }
        }

        console.log('Fetching from URL:', processedUrl);

        const response = await fetch(processedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)'
            }
        });
        
        if (!response.ok) {
            console.error('Dropbox response error:', {
                status: response.status,
                statusText: response.statusText,
                url: processedUrl
            });
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type');

        // Log successful response
        console.log('Successfully proxied media:', {
            originalUrl: url,
            processedUrl: processedUrl,
            contentType: contentType,
            size: buffer.length
        });

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
        console.error('Proxy error:', {
            error: error.message,
            originalUrl: url,
            stack: error.stack
        });
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to fetch media',
                details: error.message,
                url: url
            })
        };
    }
};