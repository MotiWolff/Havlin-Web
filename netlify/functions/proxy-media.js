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
        // First try to get the direct download URL from Dropbox
        let processedUrl = url;
        
        if (url.includes('dropbox.com')) {
            const urlObj = new URL(url);
            let path = urlObj.pathname;
            const params = new URLSearchParams(urlObj.search);
            const rlkey = params.get('rlkey');

            console.log('Processing Dropbox URL:', {
                originalUrl: url,
                path: path,
                rlkey: rlkey
            });

            // Try to get the shared link first
            try {
                const sharedLinkResponse = await fetch(url, {
                    method: 'HEAD',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)'
                    },
                    redirect: 'follow'
                });

                if (sharedLinkResponse.ok) {
                    processedUrl = sharedLinkResponse.url;
                    console.log('Got shared link URL:', processedUrl);
                }
            } catch (error) {
                console.log('Failed to get shared link, falling back to direct URL:', error.message);
            }

            // If we still have the original URL, try to convert it
            if (processedUrl === url) {
                if (path.includes('/scl/fi/')) {
                    const parts = path.split('/');
                    const fileId = parts[parts.length - 2];
                    const fileName = parts[parts.length - 1];
                    path = `/${fileId}/${fileName}`;
                }

                processedUrl = `https://dl.dropboxusercontent.com${path}`;
                
                const queryParams = [];
                if (rlkey) {
                    queryParams.push(`rlkey=${rlkey}`);
                }
                queryParams.push('raw=1');
                processedUrl += `?${queryParams.join('&')}`;
            }

            console.log('Final processed URL:', processedUrl);
        }

        // Fetch the media
        const response = await fetch(processedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Media fetch error:', {
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