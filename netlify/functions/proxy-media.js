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
            const urlObj = new URL(url);
            let path = urlObj.pathname;
            const params = new URLSearchParams(urlObj.search);
            const rlkey = params.get('rlkey');

            // Log original URL components
            console.log('Original URL components:', {
                fullUrl: url,
                path: path,
                rlkey: rlkey
            });

            // Handle /scl/fi/ format
            if (path.includes('/scl/fi/')) {
                // Extract the file ID and name
                const parts = path.split('/');
                const fileId = parts[parts.length - 2];
                const fileName = parts[parts.length - 1];
                
                // Construct the new path
                path = `/${fileId}/${fileName}`;
            }

            // Convert to dl.dropboxusercontent.com format
            processedUrl = `https://dl.dropboxusercontent.com${path}`;

            // Add parameters
            const queryParams = [];
            if (rlkey) {
                queryParams.push(`rlkey=${rlkey}`);
            }
            queryParams.push('raw=1');
            processedUrl += `?${queryParams.join('&')}`;

            // Log processed URL
            console.log('Processed URL:', processedUrl);
        }

        console.log('Attempting to fetch from URL:', processedUrl);

        const response = await fetch(processedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            },
            redirect: 'follow'
        });

        // Log response headers for debugging
        console.log('Response headers:', {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Dropbox response error:', {
                status: response.status,
                statusText: response.statusText,
                url: processedUrl,
                errorText: errorText,
                headers: Object.fromEntries(response.headers.entries())
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type');

        console.log('Successfully proxied media:', {
            originalUrl: url,
            processedUrl: processedUrl,
            contentType: contentType,
            size: buffer.length,
            responseHeaders: Object.fromEntries(response.headers.entries())
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