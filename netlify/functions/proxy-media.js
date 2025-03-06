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

    try {
        // Process Dropbox URL
        let processedUrl = url;
        
        if (url.includes('dropbox.com')) {
            // Extract the file path and parameters
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            const params = new URLSearchParams(urlObj.search);
            const rlkey = params.get('rlkey');
            
            // Remove /scl/fi/ from path if present
            const cleanPath = path.replace('/scl/fi/', '/');
            
            // Convert to dl.dropboxusercontent.com format
            processedUrl = `https://dl.dropboxusercontent.com${cleanPath}`;
            
            // Add necessary parameters
            const queryParams = [];
            if (rlkey) queryParams.push(`rlkey=${rlkey}`);
            queryParams.push('raw=1');
            
            processedUrl += `?${queryParams.join('&')}`;
        }

        console.log('Attempting to fetch from URL:', processedUrl);

        const response = await fetch(processedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
                'Accept': '*/*'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Dropbox response error:', {
                status: response.status,
                statusText: response.statusText,
                url: processedUrl,
                errorText: errorText
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type');

        console.log('Successfully proxied media:', {
            originalUrl: url,
            processedUrl: processedUrl,
            contentType: contentType,
            size: buffer.length
        });

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': contentType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000',
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
            headers,
            body: JSON.stringify({
                error: 'Failed to fetch media',
                details: error.message,
                url: url
            })
        };
    }
};