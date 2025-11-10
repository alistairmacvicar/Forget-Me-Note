---
applyTo: '{src,app,server,api,lib,backend,services,models,controllers,routes}/**/*.{ts,js,py,java,cs,go,rb,php}'
description: 'Backend security: SQL injection prevention, authentication, authorization, SSRF, secrets management, input validation, and server-side OWASP guidance'
---

# Backend Security Guidelines

## Core Principles

- **Security by Default:** All code must be secure from the start; security is not optional
- **Defense in Depth:** Layer multiple security controls for comprehensive protection
- **Least Privilege:** Grant minimum necessary permissions to users, services, and code
- **Fail Securely:** Errors should not reveal sensitive information or grant unintended access
- **Trust Nothing:** Validate all input, authenticate all requests, authorize all operations

## Mandatory Endpoint Input Validation

**Every API endpoint MUST validate all parameters and request body values using a schema validator (e.g., Zod, Joi, Yup).**

### Implementation Requirements

- Define schemas for expected input
- Parse and validate incoming data before business logic
- Reject invalid requests with clear error responses
- Never trust client-side validation

### Example (TypeScript/Nuxt 3)

```typescript
import { z } from 'zod';

const schema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	age: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const result = schema.safeParse(body);

	if (!result.success) {
		return createError({
			statusCode: 400,
			message: 'Invalid input',
			data: result.error.format(),
		});
	}

	// Business logic with validated data
	const validatedData = result.data;
});
```

### Python Example (FastAPI)

```python
from pydantic import BaseModel, EmailStr, conint

class UserInput(BaseModel):
    id: str
    email: EmailStr
    age: conint(gt=0)

@app.post("/users")
async def create_user(user: UserInput):
    # Pydantic automatically validates input
    # user.id, user.email, user.age are validated
    pass
```

## A01: Broken Access Control

### Principle of Least Privilege

```javascript
// BAD: Default to full access
if (user.isAdmin || user.isEditor || user.isViewer) {
	return resource;
}

// GOOD: Default to deny, explicitly grant
if (user.hasPermission('resource:read', resourceId)) {
	return resource;
}
```

### Authorization Checks

```python
# BAD: No authorization check
@app.get("/users/{user_id}/orders")
def get_orders(user_id: int):
    return db.query(Order).filter(Order.user_id == user_id).all()

# GOOD: Verify requesting user can access this user's orders
@app.get("/users/{user_id}/orders")
def get_orders(user_id: int, current_user: User = Depends(get_current_user)):
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    return db.query(Order).filter(Order.user_id == user_id).all()
```

### Horizontal Privilege Escalation

```javascript
// BAD: Only check authentication, not ownership
app.delete('/api/posts/:id', authenticateUser, async (req, res) => {
	await Post.delete(req.params.id);
	res.sendStatus(204);
});

// GOOD: Verify user owns the resource
app.delete('/api/posts/:id', authenticateUser, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.sendStatus(404);
	if (post.authorId !== req.user.id && !req.user.isAdmin) {
		return res.sendStatus(403);
	}
	await post.delete();
	res.sendStatus(204);
});
```

## A02: Cryptographic Failures

### Password Hashing

```python
# BAD: Weak hashing
import hashlib
hashed = hashlib.md5(password.encode()).hexdigest()

# BAD: No salt
hashed = hashlib.sha256(password.encode()).hexdigest()

# GOOD: Use Argon2 or bcrypt
from argon2 import PasswordHasher
ph = PasswordHasher()
hashed = ph.hash(password)

# Verification
try:
    ph.verify(hashed, password)
except:
    # Invalid password
    pass
```

```javascript
// Node.js: Use bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Hash password
const hashed = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashed);
```

### Secret Management

```javascript
// BAD: Hardcoded secrets
const apiKey = 'sk_live_1234567890abcdef';
const dbPassword = 'MyP@ssw0rd';

// GOOD: Load from environment variables
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;

if (!apiKey || !dbPassword) {
	throw new Error('Required secrets not configured');
}
```

**Best Practices:**

- Use environment variables or secret management services (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault)
- Never commit secrets to version control
- Rotate secrets regularly
- Use different secrets for different environments

### Data Encryption

```python
# Encrypt sensitive data at rest
from cryptography.fernet import Fernet

# Generate key (store securely, not in code)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt
encrypted = cipher.encrypt(plaintext.encode())

# Decrypt
decrypted = cipher.decrypt(encrypted).decode()
```

### HTTPS Enforcement

```javascript
// Express middleware: Redirect HTTP to HTTPS
app.use((req, res, next) => {
	if (
		req.header('x-forwarded-proto') !== 'https' &&
		process.env.NODE_ENV === 'production'
	) {
		res.redirect(`https://${req.header('host')}${req.url}`);
	} else {
		next();
	}
});
```

## A03: Injection

### SQL Injection Prevention

```python
# BAD: String concatenation
user_id = request.args.get('id')
query = f"SELECT * FROM users WHERE id = {user_id}"
cursor.execute(query)  # SQL injection vulnerable!

# GOOD: Parameterized query
user_id = request.args.get('id')
query = "SELECT * FROM users WHERE id = %s"
cursor.execute(query, (user_id,))
```

```javascript
// BAD: String concatenation with raw SQL
const userId = req.query.id;
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query); // SQL injection!

// GOOD: Parameterized query
const userId = req.query.id;
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// BETTER: Use an ORM
const user = await User.findByPk(userId);
```

### NoSQL Injection

```javascript
// BAD: Direct object from user input
const user = await User.findOne({ username: req.body.username });

// GOOD: Validate and sanitize
const schema = z.object({ username: z.string().regex(/^[a-zA-Z0-9_]+$/) });
const { username } = schema.parse(req.body);
const user = await User.findOne({ username });
```

### Command Injection Prevention

```python
# BAD: Shell command with user input
filename = request.args.get('file')
os.system(f'cat {filename}')  # Command injection!

# GOOD: Use safe APIs that don't invoke shell
import subprocess
filename = request.args.get('file')
# Validate filename first!
if not re.match(r'^[a-zA-Z0-9_.-]+$', filename):
    raise ValueError('Invalid filename')
result = subprocess.run(['cat', filename], capture_output=True, shell=False)
```

### LDAP and XPath Injection

- Always use parameterized queries or safe APIs
- Escape special characters if concatenation is unavoidable
- Validate input against strict allowlists

## A04: Insecure Design

### Secure by Default

```javascript
// BAD: Opt-in security
const config = {
	enableEncryption: false,
	requireAuth: false,
};

// GOOD: Opt-out security (secure by default)
const config = {
	enableEncryption: true,
	requireAuth: true,
};
```

### Rate Limiting

```javascript
// Express: Use express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests, please try again later',
});

app.use('/api/', limiter);
```

```python
# FastAPI: Use slowapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/data")
@limiter.limit("5/minute")
async def get_data(request: Request):
    return {"data": "value"}
```

### Account Lockout

```javascript
// Track failed login attempts
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

async function handleLogin(username, password) {
	const user = await User.findOne({ username });

	if (user.lockedUntil && user.lockedUntil > Date.now()) {
		throw new Error('Account locked. Try again later.');
	}

	const isValid = await bcrypt.compare(password, user.passwordHash);

	if (!isValid) {
		user.failedAttempts++;
		if (user.failedAttempts >= MAX_ATTEMPTS) {
			user.lockedUntil = Date.now() + LOCKOUT_TIME;
		}
		await user.save();
		throw new Error('Invalid credentials');
	}

	// Reset on successful login
	user.failedAttempts = 0;
	user.lockedUntil = null;
	await user.save();

	return createSession(user);
}
```

## A05: Security Misconfiguration

### Disable Debug Mode in Production

```javascript
// BAD: Verbose errors in production
app.use((err, req, res, next) => {
	res.status(500).json({ error: err.stack });
});

// GOOD: Generic errors in production, detailed in logs
app.use((err, req, res, next) => {
	console.error(err.stack); // Log for debugging

	if (process.env.NODE_ENV === 'production') {
		res.status(500).json({ error: 'Internal server error' });
	} else {
		res.status(500).json({ error: err.message, stack: err.stack });
	}
});
```

### Security Headers

```javascript
// Express: Use helmet
const helmet = require('helmet');
app.use(helmet());

// Or manually set headers
app.use((req, res, next) => {
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader(
		'Strict-Transport-Security',
		'max-age=31536000; includeSubDomains'
	);
	res.setHeader('Content-Security-Policy', "default-src 'self'");
	next();
});
```

### CORS Configuration

```javascript
// BAD: Allow all origins
app.use(cors({ origin: '*', credentials: true }));

// GOOD: Allowlist specific origins
const allowedOrigins = ['https://app.example.com', 'https://www.example.com'];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);
```

## A06: Vulnerable and Outdated Components

### Dependency Management

```bash
# Audit dependencies regularly
npm audit
npm audit fix

# Use tools like Snyk or Dependabot
snyk test
```

**Best Practices:**

- Pin dependency versions in production
- Regularly update dependencies
- Review security advisories
- Use automated scanning in CI/CD

## A07: Identification and Authentication Failures

### Session Management

```javascript
// Express: Use express-session with secure settings
const session = require('express-session');

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: true, // HTTPS only
			sameSite: 'strict',
			maxAge: 3600000, // 1 hour
		},
	})
);
```

### JWT Best Practices

```javascript
const jwt = require('jsonwebtoken');

// Create token with expiration
const token = jwt.sign(
	{ userId: user.id, role: user.role },
	process.env.JWT_SECRET,
	{ expiresIn: '1h', algorithm: 'HS256' }
);

// Verify token
function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}
```

**JWT Security:**

- Always set expiration (`exp` claim)
- Use strong signing algorithm (HS256, RS256)
- Store JWT in HttpOnly cookies (not localStorage)
- Implement refresh token rotation
- Validate all claims on each request

### Multi-Factor Authentication

```javascript
// Generate TOTP secret
const speakeasy = require('speakeasy');

const secret = speakeasy.generateSecret({ length: 20 });
// Store secret.base32 securely with user record

// Verify TOTP token
const verified = speakeasy.totp.verify({
	secret: user.totpSecret,
	encoding: 'base32',
	token: req.body.token,
	window: 2, // Allow 2-step drift
});

if (!verified) {
	throw new Error('Invalid 2FA token');
}
```

## A08: Software and Data Integrity Failures

### Insecure Deserialization

```python
# BAD: Pickle deserialization from untrusted source
import pickle
data = pickle.loads(untrusted_data)  # Arbitrary code execution!

# GOOD: Use JSON for untrusted data
import json
data = json.loads(untrusted_data)

# If you must deserialize complex objects, validate strictly
from pydantic import BaseModel
class SafeData(BaseModel):
    id: int
    name: str

data = SafeData.parse_obj(json.loads(untrusted_data))
```

### Dependency Integrity

```json
// package-lock.json and integrity hashes
{
	"dependencies": {
		"express": {
			"version": "4.18.2",
			"resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
			"integrity": "sha512-..."
		}
	}
}
```

Use `npm ci` in production to enforce exact versions and integrity checks.

## A09: Security Logging and Monitoring Failures

### Logging Best Practices

```javascript
const winston = require('winston');

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
	],
});

// Log security events
logger.info('User login attempt', {
	userId: user.id,
	ip: req.ip,
	success: true,
});
logger.warn('Failed login attempt', {
	username,
	ip: req.ip,
	attempts: user.failedAttempts,
});
logger.error('Unauthorized access attempt', {
	userId: req.user?.id,
	resource: req.path,
});
```

**What to Log:**

- Authentication attempts (success and failure)
- Authorization failures
- Input validation failures
- Critical errors and exceptions
- Sensitive operations (password changes, privilege escalations)

**What NOT to Log:**

- Passwords or tokens
- Credit card numbers or PII
- Session IDs or secrets

### Monitoring and Alerting

- Use centralized logging (ELK, Splunk, Datadog)
- Set up alerts for suspicious patterns (brute force, repeated 403s, etc.)
- Implement anomaly detection for unusual behavior
- Regularly review logs

## A10: Server-Side Request Forgery (SSRF)

### URL Validation

```javascript
// BAD: No validation on user-provided URL
const response = await fetch(req.body.url);

// GOOD: Allowlist-based validation
const allowedHosts = ['api.trusted.com', 'cdn.trusted.com'];

const url = new URL(req.body.url);

if (!['http:', 'https:'].includes(url.protocol)) {
	throw new Error('Invalid protocol');
}

if (!allowedHosts.includes(url.hostname)) {
	throw new Error('Host not allowed');
}

// Prevent internal network access
const ip = await dns.resolve4(url.hostname);
if (isPrivateIP(ip[0])) {
	throw new Error('Access to private IPs not allowed');
}

const response = await fetch(url.href);
```

### Prevent SSRF to Internal Services

```python
import ipaddress
import socket

def is_private_ip(hostname):
    try:
        ip = socket.gethostbyname(hostname)
        return ipaddress.ip_address(ip).is_private
    except:
        return True  # Fail closed

def validate_url(url):
    parsed = urlparse(url)

    # Check protocol
    if parsed.scheme not in ['http', 'https']:
        raise ValueError('Invalid protocol')

    # Check host isn't private
    if is_private_ip(parsed.hostname):
        raise ValueError('Access to private IPs not allowed')

    # Allowlist check
    allowed_hosts = ['api.trusted.com']
    if parsed.hostname not in allowed_hosts:
        raise ValueError('Host not allowed')

    return url
```

## Path Traversal Prevention

```javascript
// BAD: User-controlled file path
const filePath = req.query.file;
const content = fs.readFileSync(filePath);

// GOOD: Validate and sanitize
const path = require('path');

const basePath = '/var/app/uploads';
const fileName = path.basename(req.query.file); // Remove directory components
const filePath = path.join(basePath, fileName);

// Ensure resolved path is within basePath
if (!filePath.startsWith(basePath)) {
	throw new Error('Invalid file path');
}

const content = fs.readFileSync(filePath);
```

## API Security

### API Key Management

```javascript
// Validate API key
function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // Check against database (with rate limiting)
  const key = await ApiKey.findOne({ key: apiKey, active: true });

  if (!key) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  // Attach key info to request
  req.apiKey = key;
  next();
}
```

### Input Size Limits

```javascript
// Limit request body size
app.use(express.json({ limit: '1mb' }));

// Limit URL length
app.use((req, res, next) => {
	if (req.url.length > 2048) {
		return res.status(414).send('URI Too Long');
	}
	next();
});
```

## Security Checklist

- [ ] All endpoints validate input with schema validators
- [ ] Authentication required for protected endpoints
- [ ] Authorization checks verify user permissions
- [ ] Passwords hashed with Argon2 or bcrypt
- [ ] Secrets loaded from environment variables (never hardcoded)
- [ ] Parameterized queries used for all database operations
- [ ] Security headers set (CSP, HSTS, X-Frame-Options, etc.)
- [ ] Rate limiting implemented on all public endpoints
- [ ] CORS configured with allowlist (not wildcard)
- [ ] Error messages don't leak sensitive information
- [ ] Logging configured for security events (no PII/secrets logged)
- [ ] Dependencies audited and up-to-date
- [ ] HTTPS enforced in production
- [ ] Session cookies configured with HttpOnly, Secure, SameSite

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

## Summary

Backend security is about:

- **Validating all input** with schema validators
- **Preventing injection** with parameterized queries
- **Securing authentication** with strong hashing and session management
- **Enforcing authorization** with least privilege and ownership checks
- **Protecting secrets** with environment variables and secret management
- **Monitoring and logging** security events without exposing sensitive data

Security is not optional—it must be built into every layer of your backend!
