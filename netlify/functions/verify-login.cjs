const jwt = require('jsonwebtoken');

function makeCookie(name, value, opts = {}) {
  const parts = [`${name}=${value}`];
  if (opts.httpOnly) parts.push('HttpOnly');
  if (opts.secure) parts.push('Secure');
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  if (opts.path) parts.push(`Path=${opts.path}`);
  if (typeof opts.maxAge === 'number') parts.push(`Max-Age=${opts.maxAge}`);
  return parts.join('; ');
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { password } = JSON.parse(event.body || '{}');
    const accessCode = process.env.ACCESS_CODE;
    const jwtSecret = process.env.JWT_SECRET;

    if (!accessCode) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ ok: false, error: 'ACCESS_CODE is not set' }),
      };
    }
    if (!jwtSecret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ ok: false, error: 'JWT_SECRET is not set' }),
      };
    }

    const ok = typeof password === 'string' && password === accessCode;
    if (!ok) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ ok: false }),
      };
    }

    const token = jwt.sign({ v: 1 }, jwtSecret, { expiresIn: '30d' });
    const secure = process.env.NODE_ENV === 'production';
    const cookie = makeCookie('havlin_session', token, {
      httpOnly: true,
      secure,
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Set-Cookie': cookie,
      },
      body: JSON.stringify({ ok: true }),
    };
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'Bad request' }),
    };
  }
};


