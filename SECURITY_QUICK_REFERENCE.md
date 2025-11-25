# Security Quick Reference Guide

## Installation

After pulling the security fixes, install the new dependency:

```bash
cd drepadata_backend
npm install
```

This will install the `compression` package and its types.

## Security Features Enabled

### ✅ Active Protections

1. **NoSQL Injection Prevention** - All MongoDB queries sanitized
2. **XSS Prevention** - Input sanitization removes dangerous scripts
3. **CORS Protection** - Only whitelisted origins allowed
4. **Rate Limiting** - 100 requests/15min general, 20/15min for writes
5. **Request Timeout** - 30 second timeout prevents DoS
6. **Input Validation** - All endpoints validate input
7. **Error Handling** - No sensitive data in error messages
8. **Security Headers** - HSTS, CSP, X-Frame-Options, etc.
9. **Request Logging** - All requests tracked with unique IDs
10. **Content-Type Validation** - Prevents content type confusion

### ⚠️ Still Needed for Production

1. **Authentication** - JWT tokens required
2. **HTTPS** - SSL/TLS certificates
3. **CSRF Protection** - CSRF tokens for state changes

## Environment Variables

```env
# Required
MONGODB_URI=mongodb+srv://...
PORT=4000
NODE_ENV=development|production

# Optional (for production)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

## Testing Security

### Test NoSQL Injection Protection
```bash
curl -X POST http://localhost:4000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"nom": {"$ne": null}, "prenom": "Test"}'
# Should sanitize the $ne operator
```

### Test XSS Protection
```bash
curl -X POST http://localhost:4000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"nom": "<script>alert(1)</script>", "prenom": "Test"}'
# Script tags should be removed
```

### Test Rate Limiting
```bash
# Make 101 requests - should be rate limited
for i in {1..101}; do curl http://localhost:4000/api/patients; done
```

### Check Security Headers
```bash
curl -I http://localhost:4000/api/health
# Should see security headers in response
```

## Request ID Tracking

Every request gets a unique ID in the `X-Request-ID` header. Use this for:
- Debugging issues
- Tracking security events
- Correlating logs

Example:
```bash
curl -v http://localhost:4000/api/patients
# Look for X-Request-ID in response headers
```

## Security Logging

The following events are logged:
- All errors (4xx, 5xx)
- Slow requests (>1 second)
- Request timeouts
- CORS blocked requests
- MongoDB operator sanitization
- Invalid Content-Type

Check console output for security warnings (⚠️) and errors (❌).

## Common Issues

### CORS Errors
**Problem:** Frontend can't connect
**Solution:** Add your frontend URL to `ALLOWED_ORIGINS` or use development mode

### Rate Limit Errors
**Problem:** Too many requests
**Solution:** Wait 15 minutes or increase limits in `app.ts`

### Timeout Errors
**Problem:** Request takes >30 seconds
**Solution:** Optimize your queries or increase timeout in `requestTimeout.ts`

## Next Steps

1. ✅ Security fixes applied
2. ⏳ Install dependencies: `npm install`
3. ⏳ Test the application
4. ⏳ Implement authentication (see `src/middleware/auth.ts`)
5. ⏳ Deploy with HTTPS

## Files Modified

- `drepadata_backend/app.ts` - Main security middleware stack
- `drepadata_backend/src/config/corsSetup.ts` - CORS configuration
- `drepadata_backend/src/middleware/errorHandler.ts` - Secure error handling
- `drepadata_backend/src/middleware/sanitizeInput.ts` - XSS prevention (NEW)
- `drepadata_backend/src/middleware/requestLogger.ts` - Request tracking (NEW)
- `drepadata_backend/src/middleware/requestTimeout.ts` - DoS prevention (NEW)
- `drepadata_backend/src/middleware/validateContentType.ts` - Content type validation (NEW)
- `drepadata_backend/src/config/db.ts` - Secure logging
- `drepadata/utils/api.ts` - Frontend error sanitization
- `drepadata_backend/package.json` - Added compression dependency

