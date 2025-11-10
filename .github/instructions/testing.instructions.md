---
description: 'Universal testing principles, test types, organization, and best practices for all testing frameworks and languages'
applyTo: '**/{*test*,*spec*,*Test*,*Spec*,__tests__}/*.{js,ts,jsx,tsx,py,java,cs,go,rb,php}'
---

# Testing Guidelines

## Core Testing Principles

- **Write tests first or alongside code**: Tests document intent and prevent regressions
- **Test behavior, not implementation**: Focus on what the code does, not how it does it
- **Keep tests simple and readable**: Tests should be easier to understand than the code they test
- **One assertion concept per test**: Tests should verify one logical concept, though multiple assertions may be needed
- **Tests must be deterministic**: Same input always produces same output; no flaky tests
- **Fast feedback**: Unit tests should run in milliseconds, integration tests in seconds

## Test Types and When to Use Them

### Unit Tests

**Purpose**: Test individual functions, methods, or classes in isolation

**Characteristics**:

- Fast execution (milliseconds)
- No external dependencies (databases, APIs, file system)
- Use mocks/stubs for dependencies
- High code coverage target (70-90%)

**When to write**:

- For pure functions and business logic
- For utility functions and helpers
- For individual class methods
- For validation and transformation logic

**Guidance**:

- Mock all external dependencies
- Test edge cases and error conditions
- Use descriptive test names that explain the scenario
- Follow Arrange-Act-Assert (AAA) pattern

### Integration Tests

**Purpose**: Test interactions between components, modules, or services

**Characteristics**:

- Slower than unit tests (seconds)
- May use real databases, message queues, or services
- Test actual integration points
- Focus on critical paths

**When to write**:

- For API endpoints that touch databases
- For service-to-service communication
- For data access layer operations
- For third-party API integrations

**Guidance**:

- Use test databases or containers for isolation
- Clean up test data after each test
- Test realistic scenarios and data flows
- Verify both success and failure paths

### End-to-End (E2E) Tests

**Purpose**: Test complete user workflows from UI to backend

**Characteristics**:

- Slowest tests (seconds to minutes)
- Test entire application stack
- Simulate real user behavior
- Focus on critical business flows

**When to write**:

- For critical user journeys (login, checkout, etc.)
- For multi-step workflows
- For UI interactions that trigger backend logic
- For regression testing of key features

**Guidance**:

- Keep E2E tests minimal (test happy paths primarily)
- Use Page Object Model for maintainability
- Run against staging/test environments

## Test Organization and Structure

### File Naming Conventions

**JavaScript/TypeScript**:

- `feature.test.ts`, `feature.spec.ts` (co-located with source)
- `__tests__/feature.test.ts` (separate directory)

**Python**:

- `test_feature.py`, `feature_test.py`
- Organized in `tests/` directory

**Java**:

- `FeatureTest.java` (suffix convention)
- Mirror source structure in `src/test/java`

**C#**:

- `FeatureTests.cs`, `FeatureTest.cs`
- Separate test project

**Go**:

- `feature_test.go` (same package as source)

**Ruby**:

- `feature_test.rb`, `feature_spec.rb`
- `test/` or `spec/` directory

### Directory Structure

```
project/
├── src/
│   └── feature/
│       ├── module.ts
│       └── module.test.ts        # Co-located unit tests
├── tests/
│   ├── unit/                     # Separated unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
└── __tests__/                    # Alternative test directory
```

### Test Structure Pattern (AAA)

```typescript
// Arrange-Act-Assert Pattern
describe('Feature: User Authentication', () => {
	it('should authenticate user with valid credentials', () => {
		// Arrange: Set up test data and dependencies
		const user = { username: 'test', password: 'valid123' };
		const mockAuthService = createMockAuthService();

		// Act: Execute the code under test
		const result = authenticateUser(user, mockAuthService);

		// Assert: Verify the expected outcome
		expect(result.isAuthenticated).toBe(true);
		expect(result.token).toBeDefined();
	});
});
```

## Mocking and Test Isolation

### When to Mock

- External APIs and services
- Database connections
- File system operations
- Network requests
- Time-dependent operations (dates, timers)
- Random number generation

### When NOT to Mock

- Simple data structures or DTOs
- Pure utility functions
- Configuration objects
- Code under test itself

### Mocking Strategies

**Dependency Injection**:

```typescript
// Good: Dependencies injected, easy to mock
class UserService {
	constructor(private db: Database, private api: ExternalAPI) {}

	async getUser(id: string) {
		return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
	}
}

// Test with mocks
const mockDb = createMockDatabase();
const mockApi = createMockAPI();
const service = new UserService(mockDb, mockApi);
```

**Stub Responses**:

```python
# Python example with unittest.mock
from unittest.mock import Mock, patch

def test_fetch_user_data():
    # Arrange
    mock_response = Mock()
    mock_response.json.return_value = {'id': 1, 'name': 'Test'}

    with patch('requests.get', return_value=mock_response):
        # Act
        result = fetch_user_data(1)

        # Assert
        assert result['name'] == 'Test'
```

## Test Data Management

### Principles

- **Use factories or builders** for creating test data
- **Keep test data minimal** - only what's needed for the test
- **Avoid magic values** - use constants or clear variable names
- **Isolate test data** - each test should have independent data
- **Clean up after tests** - reset state, delete test records

### Test Data Patterns

**Factory Functions**:

```typescript
function createTestUser(overrides = {}) {
	return {
		id: 'test-123',
		username: 'testuser',
		email: 'test@example.com',
		createdAt: new Date('2025-01-01'),
		...overrides,
	};
}

// Usage
const user = createTestUser({ username: 'customuser' });
```

**Fixtures (Python)**:

```python
import pytest

@pytest.fixture
def sample_user():
    return {
        'id': 1,
        'username': 'testuser',
        'email': 'test@example.com'
    }

def test_user_validation(sample_user):
    assert validate_user(sample_user) == True
```

## Test Naming Conventions

### Descriptive Test Names

Tests should clearly describe what they're testing and expected behavior:

**Good Examples**:

```typescript
// Describes: condition + action + expected result
it('should return 401 when user provides invalid credentials');
it('should calculate total price including tax for cart items');
it('should throw ValidationError when email format is invalid');
it('should retry API call up to 3 times on network failure');
```

**Bad Examples**:

```typescript
// Too vague
it('works');
it('test user login');
it('should be valid');
```

### Convention Patterns

**BDD Style (Given-When-Then)**:

```typescript
describe('Shopping Cart', () => {
	it('given empty cart, when item added, then cart contains one item', () => {
		// Test implementation
	});
});
```

**Should Style**:

```typescript
describe('UserValidator', () => {
	it('should reject emails without @ symbol', () => {
		// Test implementation
	});
});
```

## Common Testing Anti-Patterns

### ❌ Avoid These

**Testing Implementation Details**:

```typescript
// Bad: Tests internal private method
it('should call _internalValidation method', () => {
	const spy = jest.spyOn(service, '_internalValidation');
	service.validateUser(user);
	expect(spy).toHaveBeenCalled();
});

// Good: Tests public behavior
it('should reject user with invalid email format', () => {
	const result = service.validateUser({ email: 'invalid' });
	expect(result.isValid).toBe(false);
	expect(result.errors).toContain('Invalid email format');
});
```

**Overly Complex Test Setup**:

```typescript
// Bad: Too much setup obscures intent
it('should process order', () => {
	const db = createDatabase();
	const cache = createCache();
	const logger = createLogger();
	const notifier = createNotifier();
	const paymentGateway = createPaymentGateway();
	const inventory = createInventoryService(db, cache);
	const orderService = new OrderService(
		db,
		cache,
		logger,
		notifier,
		paymentGateway,
		inventory
	);
	// ... actual test buried below
});

// Good: Extract setup to helper or beforeEach
beforeEach(() => {
	orderService = createTestOrderService(); // Factory handles complexity
});

it('should process order', () => {
	const result = orderService.processOrder(testOrder);
	expect(result.status).toBe('completed');
});
```

**Testing Multiple Concerns in One Test**:

```typescript
// Bad: Tests too many things
it('should handle user registration', () => {
	const user = registerUser(data);
	expect(user).toBeDefined();
	expect(emailService.sendWelcomeEmail).toHaveBeenCalled();
	expect(analyticsService.trackEvent).toHaveBeenCalled();
	expect(database.users.count()).toBe(1);
	expect(cache.get('user:1')).toBeDefined();
});

// Good: Split into focused tests
it('should create user record in database', () => {
	/* ... */
});
it('should send welcome email after registration', () => {
	/* ... */
});
it('should track registration event in analytics', () => {
	/* ... */
});
```

**Flaky Tests (Time-Dependent)**:

```typescript
// Bad: Relies on actual time
it('should expire session after 1 hour', async () => {
	const session = createSession();
	await sleep(3600000); // Wait 1 hour!
	expect(session.isExpired()).toBe(true);
});

// Good: Mock time or use fake timers
it('should expire session after 1 hour', () => {
	jest.useFakeTimers();
	const session = createSession();
	jest.advanceTimersByTime(3600000);
	expect(session.isExpired()).toBe(true);
	jest.useRealTimers();
});
```

## Code Coverage Guidelines

### Coverage Targets

- **Unit Tests**: Aim for 70-90% coverage
- **Integration Tests**: Focus on critical paths, 50-70%
- **E2E Tests**: Cover happy paths and critical workflows only

### Coverage is Not a Goal

- **100% coverage does not mean bug-free code**
- **Focus on meaningful tests, not coverage metrics**
- **Cover edge cases and error conditions**
- **Some code doesn't need tests** (simple getters/setters, trivial logic)

### What to Prioritize

1. Business logic and algorithms
2. Error handling and edge cases
3. Data validation and transformation
4. Security-critical code
5. Bug-prone areas identified in production

## Quality Checklist

Before committing tests, ensure:

- [ ] Tests are independent and can run in any order
- [ ] Tests have clear, descriptive names
- [ ] Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] External dependencies are mocked appropriately
- [ ] Test data is isolated and cleaned up
- [ ] Tests run quickly (unit tests < 100ms each)
- [ ] No flaky tests (consistent pass/fail)
- [ ] Error cases and edge cases are covered
- [ ] Tests document expected behavior clearly

## Summary

Effective testing requires:

- **Right test at the right level** (unit vs integration vs E2E)
- **Clear test structure** (AAA pattern, descriptive names)
- **Proper isolation** (mocking, test data management)
- **Fast feedback** (optimize for speed)
- **Maintainability** (avoid implementation details, keep tests simple)

Well-written tests are an investment that pays dividends through faster development, fewer bugs, and confident refactoring.
