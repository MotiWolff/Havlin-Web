const jwt = require('jsonwebtoken');

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const [k, ...rest] = part.trim().split('=');
    out[k] = decodeURIComponent(rest.join('='));
  });
  return out;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'JWT_SECRET is not set' }) };
  }

  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie);
  const token = cookies.havlin_session;
  if (!token) return { statusCode: 401, headers, body: JSON.stringify({ ok: false }) };

  try {
    jwt.verify(token, jwtSecret);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch {
    return { statusCode: 401, headers, body: JSON.stringify({ ok: false }) };
  }
};


