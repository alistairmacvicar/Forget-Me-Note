---
description: 'Python coding conventions following PEP 8, type hints, docstrings, testing, security, and performance best practices'
applyTo: '**/*.py'
---

# Python Coding Conventions

## Python Instructions

- Write clear and concise comments for each function.
- Ensure functions have descriptive names and include type hints.
- Provide docstrings following PEP 257 conventions.
- Use the `typing` module for type annotations (e.g., `List[str]`, `Dict[str, int]`).
- Break down complex functions into smaller, more manageable functions.

## General Instructions

- Always prioritize readability and clarity.
- For algorithm-related code, include explanations of the approach used.
- Write code with good maintainability practices, including comments on why certain design decisions were made.
- Handle edge cases and write clear exception handling.
- For libraries or external dependencies, mention their usage and purpose in comments.
- Use consistent naming conventions and follow language-specific best practices.
- Write concise, efficient, and idiomatic code that is also easily understandable.

## Code Style and Formatting

- Follow the **PEP 8** style guide for Python.
- Maintain proper indentation (use 4 spaces for each level of indentation).
- Ensure lines do not exceed 79 characters.
- Place function and class docstrings immediately after the `def` or `class` keyword.
- Use blank lines to separate functions, classes, and code blocks where appropriate.

## Testing

**Python-Specific Testing Notes**:

- Use pytest for testing with fixtures and parametrized tests
- Follow naming convention: `test_*.py` or `*_test.py`
- Use type hints in tests for clarity
- Document test cases with clear docstrings

## Security

**Python-Specific Security Notes**:

- Never use `pickle` for untrusted data; use JSON instead
- Use `secrets` module for cryptographic randomness, not `random`
- Avoid `eval()`, `exec()`, and dynamic code execution
- Use parameterized queries with database libraries (SQLAlchemy, psycopg2)

## Performance

**Python-Specific Performance Notes**:

- Use built-in data structures (`dict`, `set`, `deque`) for optimal performance
- Use `@lru_cache` decorator for memoization of expensive functions
- Use list comprehensions and generator expressions over traditional loops
- Profile with `cProfile`, `line_profiler`, or `py-spy` to identify bottlenecks
- Consider `multiprocessing` for CPU-bound tasks (avoid GIL limitations)
- Use `asyncio` for I/O-bound concurrent operations
- Prefer `join()` for string concatenation over repeated `+` operations

## Edge Cases and Error Handling

- Always include test cases for critical paths of the application
- Account for common edge cases like empty inputs, invalid data types, and large datasets
- Include comments for edge cases and the expected behavior
- Use specific exception types rather than bare `except:` clauses
- Provide clear error messages that help diagnose issues

## Example of Proper Documentation

```python
def calculate_area(radius: float) -> float:
    """
    Calculate the area of a circle given the radius.

    Parameters:
    radius (float): The radius of the circle.

    Returns:
    float: The area of the circle, calculated as π * radius^2.
    """
    import math
    return math.pi * radius ** 2
```
