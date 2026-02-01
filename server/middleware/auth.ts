import { createRemoteJWKSet, jwtVerify } from 'jose';
import { getRequestHeader, setResponseStatus, sendError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const { pathname } = new URL(event.node.req.url || '', 'http://localhost');

  // Only apply middleware to /api/** routes
  if (!pathname.startsWith('/api/')) {
    return;
  }

  const config = useRuntimeConfig();
  const authority = config.public.authority as string;

  if (!authority) {
    console.error('OIDC authority is not configured in runtime config.');
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: OIDC authority not configured.'
    }));
  }

  const authHeader = getRequestHeader(event, 'authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Unauthorized: No bearer token provided.');
    setResponseStatus(event, 401);
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No bearer token provided.'
    }));
  }


  const token = authHeader.substring(7);


  // const jwksUri = new URL('/protocol/openid-connect/certs', authority);
  const jwksUri = new URL('http://localhost:8080/realms/master/protocol/openid-connect/certs');
  const JWKS = createRemoteJWKSet(jwksUri);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: authority,
      audience: config.public.clientId,
      requiredClaims: ["openid"]
    });

    // Optionally, attach user info to the event context
    event.context.auth = { user: payload };

  } catch (error) {
    console.error('Token validation failed:', error);
    setResponseStatus(event, 401);
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid token.'
    }));
  }
});
