---
applyTo: '{src,app,server,api,lib,backend,services,models,database,db}/**/*.{ts,js,py,java,cs,go,rb,php,sql}'
description: 'Backend and database performance optimization: algorithms, concurrency, caching, APIs, databases, and language-specific patterns'
---

# Backend and Database Performance Optimization

## Core Principles

- **Measure First, Optimize Second:** Use profilers and monitoring tools to identify real bottlenecks
- **Optimize for the Common Case:** Focus on hot paths and frequently executed code
- **Avoid Premature Optimization:** Write clear code first; optimize when necessary
- **Minimize Resource Usage:** Efficiently use memory, CPU, network, and disk
- **Understand the Platform:** Know your language, framework, and runtime performance characteristics
- **Automate Performance Testing:** Integrate benchmarks into CI/CD to catch regressions

## Algorithm and Data Structure Optimization

### Data Structure Selection

- **Arrays:** Sequential access, cache-friendly for iteration
- **Hash Maps/Dictionaries:** O(1) average lookups, insertions, deletions
- **Sets:** Fast membership testing, uniqueness constraints
- **Trees:** Ordered data, range queries, hierarchical structures
- **Queues/Stacks:** FIFO/LIFO operations
- **Heaps:** Priority queues, finding min/max efficiently

### Algorithmic Complexity

- **Avoid O(n²) or Worse:** Profile nested loops and recursive calls. Refactor to reduce complexity
- **Use Binary Search:** O(log n) for sorted data instead of O(n) linear search
- **Hash-Based Algorithms:** O(1) average-case lookups instead of O(n) scans
- **Batch Processing:** Process data in batches to reduce overhead (e.g., bulk database inserts)
- **Streaming:** Use streaming APIs for large datasets to avoid loading everything into memory

### Common Optimizations

- **Memoization:** Cache expensive function results
- **Dynamic Programming:** Solve overlapping subproblems once
- **Lazy Evaluation:** Defer computation until results are needed
- **Early Termination:** Break loops/recursion when result is found

## Concurrency and Parallelism

### Asynchronous Programming

- **Async I/O:** Use async/await, callbacks, or event loops to avoid blocking threads
- **Non-Blocking Operations:** Never block on I/O in request handlers
- **Event-Driven Architecture:** Handle events asynchronously for high throughput

### Parallel Processing

- **Thread/Worker Pools:** Manage concurrency and avoid resource exhaustion
- **Parallelizable Tasks:** Identify independent operations that can run concurrently
- **CPU vs I/O Bound:** Use threads/processes for CPU-bound, async for I/O-bound

### Concurrency Safety

- **Avoid Race Conditions:** Use locks, semaphores, or atomic operations where needed
- **Immutable Data:** Prefer immutability to avoid synchronization issues
- **Thread-Safe Data Structures:** Use concurrent collections when available
- **Backpressure:** Implement backpressure in queues and pipelines to avoid overload

### Bulk Operations

- **Batch API Calls:** Reduce network round trips with bulk operations
- **Batch Database Operations:** Use bulk inserts/updates instead of individual queries
- **Request Coalescing:** Combine multiple identical requests into one

## Caching Strategies

### When to Cache

- **Expensive Computations:** Cache results of CPU-intensive operations
- **Database Queries:** Cache frequently accessed, slow-changing data
- **API Responses:** Cache responses from external services
- **Session Data:** Store user sessions in fast cache layer

### Cache Types

- **In-Memory Caching:** Redis, Memcached for hot data
- **Application-Level Cache:** LRU cache, memoization within the process
- **Distributed Caching:** For multi-server setups (Redis Cluster, Memcached)
- **CDN Caching:** For static assets and cacheable API responses

### Cache Invalidation

- **Time-Based (TTL):** Simplest, but can serve stale data
- **Event-Based:** Invalidate on data updates (most accurate)
- **Write-Through:** Update cache and database together
- **Write-Behind:** Update cache immediately, database asynchronously
- **Cache-Aside:** Application checks cache first, loads from DB on miss

### Cache Pitfalls

- **Cache Stampede:** Multiple requests for expired key overwhelm database
  - **Solution:** Use locks or request coalescing
- **Stale Data:** Outdated cache causing incorrect behavior
  - **Solution:** Proper invalidation strategy
- **Over-Caching:** Caching volatile or sensitive data
  - **Solution:** Be selective about what to cache

## API and Network Optimization

### Payload Optimization

- **Minimize Payloads:** Send only necessary data
- **Compression:** Use gzip or Brotli for responses
- **Efficient Serialization:** Use JSON for compatibility, Protocol Buffers/MessagePack for performance
- **Pagination:** Always paginate large result sets
- **Cursor-Based Pagination:** For real-time data and large datasets

### Connection Management

- **Connection Pooling:** Reuse connections for databases and external services
- **Keep-Alive:** Use persistent HTTP connections
- **Limit Concurrent Connections:** Avoid resource exhaustion
- **Timeouts:** Set appropriate timeouts for all external calls

### Protocol Selection

- **HTTP/2:** Multiplexing, header compression, server push
- **gRPC:** High-performance RPC with Protocol Buffers
- **WebSockets:** For real-time bidirectional communication
- **GraphQL:** Reduce over-fetching and under-fetching

### Rate Limiting

- **Protect from Abuse:** Implement rate limiting on APIs
- **Graceful Degradation:** Return 429 (Too Many Requests) with Retry-After header
- **Token Bucket / Leaky Bucket:** Common rate limiting algorithms

## Database Performance

### Query Optimization

- **Indexes:** Use indexes on columns frequently queried, filtered, or joined
  - Monitor index usage; drop unused indexes
  - Avoid over-indexing (slows writes)
- **Avoid SELECT \*:** Select only columns you need (reduces I/O and memory)
- **Parameterized Queries:** Prevent SQL injection and improve plan caching
- **Query Plans:** Analyze with `EXPLAIN` or `EXPLAIN ANALYZE`
- **Avoid N+1 Queries:** Use joins or batch queries instead of loops
- **Limit Result Sets:** Use `LIMIT`/`OFFSET` or cursors for large tables

### Schema Design

- **Normalization:** Reduce redundancy, improve data integrity
- **Denormalization:** Trade space for query speed in read-heavy workloads
- **Efficient Data Types:** Use smallest appropriate types
- **Partitioning:** Partition large tables for scalability
- **Archiving:** Regularly archive or purge old data
- **Foreign Keys:** Use for integrity, but be aware of performance cost in high-write scenarios

### Transaction Management

- **Short Transactions:** Minimize transaction duration to reduce lock contention
- **Isolation Levels:** Use lowest level that meets consistency needs
  - Read Uncommitted < Read Committed < Repeatable Read < Serializable
- **Avoid Long-Running Transactions:** Can block operations and increase deadlocks
- **Optimize Commit Frequency:** Batch commits when appropriate

### Caching and Replication

- **Read Replicas:** Scale read-heavy workloads; monitor replication lag
- **Query Result Caching:** Cache frequent queries in Redis/Memcached
- **Materialized Views:** Pre-compute expensive aggregations
- **Sharding:** Distribute data across multiple servers for horizontal scaling
- **Write-Ahead Logging:** Ensure durability without blocking writes

### NoSQL Optimization

- **Design for Access Patterns:** Model data for how you'll query it
- **Avoid Hot Partitions:** Distribute reads/writes evenly across partitions
- **Unbounded Growth:** Watch for unbounded arrays or documents
- **Consistency Models:** Understand eventual vs strong consistency trade-offs
- **Indexing:** Create indexes on frequently queried fields

### Common Database Pitfalls

- Missing or unused indexes
- `SELECT *` in production queries
- Not monitoring slow queries
- Ignoring replication lag
- Not archiving old data
- N+1 query problems

### Database Troubleshooting

- Use slow query logs to identify bottlenecks
- Use `EXPLAIN` to analyze query plans
- Monitor cache hit/miss ratios
- Use database-specific monitoring (pg_stat_statements, MySQL Performance Schema)
- Check for table/index bloat
- Monitor connection pool usage

## Language-Specific Optimization

### Node.js

- **Async APIs:** Never use synchronous APIs in production (e.g., avoid `fs.readFileSync`)
- **Event Loop:** Don't block the event loop with CPU-intensive work
- **Clustering:** Use cluster module for multi-core utilization
- **Worker Threads:** For CPU-bound tasks
- **Streams:** Use for large file/network operations
- **Connection Limits:** Limit concurrent open connections
- **Profiling:** Use `clinic.js`, `node --inspect`, or Chrome DevTools

### Python

- **Built-in Data Structures:** Use `dict`, `set`, `deque` for performance
- **List Comprehensions:** Faster than traditional loops
- **Generators:** Use for lazy evaluation and memory efficiency
- **Multiprocessing:** For CPU-bound parallelism (avoids GIL)
- **Asyncio:** For I/O-bound concurrency
- **NumPy/Pandas:** For numerical operations
- **Caching:** Use `@lru_cache` decorator for memoization
- **Profiling:** Use `cProfile`, `line_profiler`, or `py-spy`

### Java

- **Efficient Collections:** `ArrayList`, `HashMap`, `HashSet`
- **Thread Pools:** Use `Executors` for managed concurrency
- **CompletableFuture:** For async programming
- **Streams API:** For functional-style operations
- **JVM Tuning:** Configure heap size (`-Xmx`, `-Xms`) and GC (`-XX:+UseG1GC`)
- **Connection Pooling:** HikariCP for database connections
- **Profiling:** VisualVM, JProfiler, YourKit

### .NET/C#

- **Async/Await:** For I/O-bound operations
- **Span<T> and Memory<T>:** For efficient memory access without allocations
- **ValueTask:** For hot paths to avoid allocations
- **Object Pooling:** ArrayPool, ObjectPool for high-frequency allocations
- **IAsyncEnumerable<T>:** For streaming data
- **Profiling:** dotTrace, Visual Studio Profiler, PerfView

### Go

- **Goroutines:** Lightweight concurrency
- **Channels:** For communication between goroutines
- **Defer Statements:** Clean up resources efficiently
- **Sync Package:** Mutexes, WaitGroups for synchronization
- **Context:** For cancellation and timeouts
- **Profiling:** pprof built-in profiler

### Ruby

- **Avoid N+1 Queries:** Use `includes`, `joins`, `preload`
- **Background Jobs:** Sidekiq, Resque for async processing
- **Caching:** Fragment caching, Russian Doll caching
- **GC Tuning:** Configure Ruby's garbage collector
- **Profiling:** ruby-prof, stackprof, rack-mini-profiler

## Logging and Monitoring

### Efficient Logging

- **Minimize Logging in Hot Paths:** Excessive logging slows critical code
- **Structured Logging:** Use JSON or key-value format for easier parsing
- **Log Levels:** Use appropriate levels (DEBUG, INFO, WARN, ERROR)
- **Async Logging:** Log asynchronously to avoid blocking

### Monitoring

- **Metrics:** Track latency, throughput, error rates, resource usage
- **Tools:** Prometheus, Grafana, Datadog, New Relic
- **Distributed Tracing:** OpenTelemetry, Jaeger, Zipkin for microservices
- **Alerting:** Set up alerts for performance regressions and resource exhaustion

## Advanced Topics

### Memory Management

- **Resource Cleanup:** Always release resources (files, sockets, DB connections) promptly
- **Object Pooling:** Reuse expensive objects (DB connections, threads)
- **Heap Monitoring:** Monitor heap usage and GC; tune GC for workload
- **Memory Leaks:** Use profilers and leak detection tools

### Scalability

- **Horizontal Scaling:** Design stateless services, use load balancers
- **Auto-Scaling:** Use cloud auto-scaling with sensible thresholds
- **Sharding/Partitioning:** Distribute data and load
- **Circuit Breakers:** Prevent cascade failures in distributed systems
- **Idempotency:** Design operations to be safely retried

### Security and Performance

**Performance-Specific Security Notes**:

- **Efficient Crypto:** Use hardware-accelerated cryptographic libraries
- **Input Validation:** Validate efficiently; avoid complex regexes that can cause ReDoS
- **Rate Limiting:** Protect against DoS without harming legitimate users

## Practical Examples

### Efficient SQL Query

```sql
-- BAD: Selects all columns, no index
SELECT * FROM users WHERE email = 'user@example.com';

-- GOOD: Selects only needed columns, uses index
SELECT id, name FROM users WHERE email = 'user@example.com';
```

### Caching in Python

```python
# BAD: Recomputes every time
result = expensive_function(x)

# GOOD: Cache result
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function(x):
    # expensive computation
    return result

result = expensive_function(x)
```

### Async I/O in Node.js

```javascript
// BAD: Blocking file read
const data = fs.readFileSync('file.txt');

// GOOD: Non-blocking file read
fs.readFile('file.txt', (err, data) => {
	if (err) throw err;
	// process data
});

// BETTER: Promise-based async
const data = await fs.promises.readFile('file.txt');
```

### Redis Caching Pattern

```javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedData(key, fetchFunction) {
	const cached = await client.get(key);
	if (cached) return JSON.parse(cached);

	const result = await fetchFunction();
	await client.setex(key, 3600, JSON.stringify(result));
	return result;
}
```

### Connection Pooling (Python)

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

# BAD: Create new connection for each query
engine = create_engine('postgresql://...')

# GOOD: Use connection pooling
engine = create_engine(
    'postgresql://...',
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20
)
```

## Performance Checklist

- [ ] Are algorithms and data structures optimized for the use case?
- [ ] Are there unnecessary computations or repeated work?
- [ ] Is caching used appropriately with proper invalidation?
- [ ] Are database queries indexed and free of N+1 issues?
- [ ] Are payloads minimized and paginated?
- [ ] Is connection pooling used for databases and external services?
- [ ] Are there any blocking operations in hot paths?
- [ ] Is logging in hot paths minimized?
- [ ] Are resources properly cleaned up (no leaks)?
- [ ] Is monitoring and alerting in place for performance regressions?

## References

- [PostgreSQL Performance Optimization](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Python Performance Tips](https://docs.python.org/3/library/profile.html)
- [Java Performance Tuning](https://www.oracle.com/java/technologies/javase/performance.html)
- [.NET Performance Guide](https://learn.microsoft.com/en-us/dotnet/standard/performance/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [OpenTelemetry](https://opentelemetry.io/)
- [k6 Load Testing](https://k6.io/)

## Summary

Backend and database performance is about:

- Choosing the right algorithms and data structures
- Efficient concurrency and asynchronous I/O
- Strategic caching with proper invalidation
- Optimized database queries and schema design
- Monitoring, profiling, and continuous improvement

Always measure first, optimize second, and test under realistic load!
