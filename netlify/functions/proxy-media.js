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
        // Simplify the Dropbox URL handling
        let processedUrl = url;
        
        if (url.includes('dropbox.com')) {
            // Replace dropbox.com with dl.dropboxusercontent.com and add raw=1
            processedUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
            
            // Add raw=1 parameter if not already present
            if (!processedUrl.includes('raw=1')) {
                processedUrl += processedUrl.includes('?') ? '&raw=1' : '?raw=1';
            }
            
            // If URL contains '/scl/fi/', handle the special format
            if (processedUrl.includes('/scl/fi/')) {
                // This converts new-style Dropbox links to dl links
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/');
                // Extract the file ID and name
                const fileId = pathParts[pathParts.indexOf('scl') + 2];
                const fileName = pathParts[pathParts.length - 1];
                
                // Construct the raw content URL
                processedUrl = `https://dl.dropboxusercontent.com/scl/fi/${fileId}/${fileName}?raw=1`;
                
                // Add rlkey if present in original URL
                const params = new URLSearchParams(urlObj.search);
                const rlkey = params.get('rlkey');
                if (rlkey) {
                    processedUrl += `&rlkey=${rlkey}`;
                }
            }
        }

        console.log('Processed URL:', processedUrl);

        // Fetch the media with expanded timeout and better error handling
        const response = await fetch(processedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            },
            redirect: 'follow',
            timeout: 30000 // 30 second timeout
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Media fetch error:', {
                status: response.status,
                statusText: response.statusText,
                url: processedUrl,
                errorText: errorText.substring(0, 500), // Limit error text size
                headers: Object.fromEntries(response.headers.entries())
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText.substring(0, 100)}`);
        }

        // Get content as array buffer instead of buffer for better compatibility
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        console.log('Successfully fetched media:', {
            originalUrl: url,
            processedUrl: processedUrl,
            contentType: contentType,
            size: buffer.length
        });

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': contentType,
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
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to fetch media',
                details: error.message,
                url: url
            })
        };
    }
};