---
description: 'Comprehensive project architecture blueprint generator that analyzes codebases to create detailed architectural documentation. Automatically detects technology stacks and architectural patterns, generates visual diagrams, documents implementation patterns, and provides extensible blueprints for maintaining architectural consistency and guiding new development.'
mode: 'agent'
---

# Comprehensive Project Architecture Blueprint Generator

## Configuration

Before proceeding, I need to gather configuration preferences. If you haven't provided these values, I will ask you for each one:

**PROJECT_TYPE**: Primary technology (Auto-detect | .NET | Java | React | Angular | Python | Node.js | Flutter | Other)
**ARCHITECTURE_PATTERN**: Primary architectural pattern (Auto-detect | Clean Architecture | Microservices | Layered | MVVM | MVC | Hexagonal | Event-Driven | Serverless | Monolithic | Other)
**DIAGRAM_TYPE**: Architecture diagram type (C4 | UML | Flow | Component | None)
**DETAIL_LEVEL**: Level of detail (High-level | Detailed | Comprehensive | Implementation-Ready)
**INCLUDES_CODE_EXAMPLES**: Include sample code to illustrate patterns? (true | false)
**INCLUDES_IMPLEMENTATION_PATTERNS**: Include detailed implementation patterns? (true | false)
**INCLUDES_DECISION_RECORDS**: Include architectural decision records? (true | false)
**FOCUS_ON_EXTENSIBILITY**: Emphasize extension points and patterns? (true | false)

If any configuration values are missing from your request, I will ask you to provide them before generating the documentation.

## Instructions

Step 1: Check if the user has provided all required configuration values. If any are missing, ask the user to provide them before proceeding. Present the missing values as a simple list of questions.

Step 2: Once all configuration is gathered, create or update a comprehensive 'Project_Architecture_Blueprint.md' document that thoroughly analyzes the architectural patterns in the codebase to serve as a definitive reference for maintaining architectural consistency.

### 0. Documentation Mode Detection

- Search for existing 'Project_Architecture_Blueprint.md' in the workspace
- If found: Switch to UPDATE mode and follow incremental update workflow
- If not found: Continue with CREATE mode using full analysis workflow below

### UPDATE MODE WORKFLOW

When existing architecture documentation is found:

#### A. Analyze Existing Documentation

- Read the current Project_Architecture_Blueprint.md thoroughly
- Extract the documented architectural patterns and decisions
- Identify the date/version information if present
- Note the scope and structure of existing documentation

#### B. Detect Architectural Changes

- **New Components**: Search for new services, modules, or layers added since last update
- **Modified Patterns**: Identify changes in dependency injection, communication patterns, or design patterns
- **Removed Components**: Find deprecated or removed architectural elements
- **Technology Changes**: Detect new frameworks, libraries, or version upgrades affecting architecture
- **Pattern Evolution**: Identify shifts in architectural approaches (e.g., monolith to microservices)
- **Configuration Changes**: Note new environment configurations or deployment patterns
- **Integration Changes**: Find new external system integrations or API modifications

#### C. Scope Analysis

- Compare current codebase structure against documented architecture
- Identify gaps in documentation coverage for existing code
- Find newly introduced architectural concerns not yet documented
- Detect architectural violations or deviations from documented patterns

#### D. Propose Incremental Updates

Before making changes, present:

- List of sections requiring updates with specific reasons
- New architectural patterns detected that need documentation
- Deprecated patterns to remove or mark as legacy
- Structural changes needed to documentation organization
- Version/timestamp updates

#### E. Apply Targeted Updates

- Update only sections affected by architectural changes
- Add new sections for newly introduced patterns maintaining existing structure
- Mark deprecated patterns clearly with migration guidance if applicable
- Update all diagrams to reflect current architecture
- Refresh code examples to match current implementations
- Update cross-references and ensure internal consistency
- Preserve the existing documentation style and format
- Update metadata: last updated date, version references, architectural decisions timestamps

#### F. Validate Architectural Consistency

- Ensure updated documentation accurately reflects current codebase
- Verify all architectural patterns are consistently described
- Check that all diagrams match textual descriptions
- Confirm code examples compile and represent actual patterns
- Validate that architectural decisions remain coherent

If in UPDATE mode, prioritize incremental changes over full regeneration. Otherwise, continue with CREATE mode below.

### CREATE MODE WORKFLOW

Use the following approach:

### 1. Architecture Detection and Analysis

- If PROJECT_TYPE is "Auto-detect": Analyze the project structure to identify all technology stacks and frameworks in use by examining:
  - Project and configuration files
  - Package dependencies and import statements
  - Framework-specific patterns and conventions
  - Build and deployment configurations
- Otherwise: Focus on the specified PROJECT_TYPE's specific patterns and practices
- If ARCHITECTURE_PATTERN is "Auto-detect": Determine the architectural pattern(s) by analyzing:
  - Folder organization and namespacing
  - Dependency flow and component boundaries
  - Interface segregation and abstraction patterns
  - Communication mechanisms between components
- Otherwise: Document how the specified ARCHITECTURE_PATTERN is implemented

### 2. Architectural Overview

- Provide a clear, concise explanation of the overall architectural approach
- Document the guiding principles evident in the architectural choices
- Identify architectural boundaries and how they're enforced
- Note any hybrid architectural patterns or adaptations of standard patterns

### 3. Architecture Visualization

- If DIAGRAM_TYPE is not "None": Create diagrams using the specified DIAGRAM_TYPE at multiple levels of abstraction:
  - High-level architectural overview showing major subsystems
  - Component interaction diagrams showing relationships and dependencies
  - Data flow diagrams showing how information moves through the system
  - Ensure diagrams accurately reflect the actual implementation, not theoretical patterns
- If DIAGRAM_TYPE is "None": Describe the component relationships based on actual code dependencies, providing clear textual explanations of:
  - Subsystem organization and boundaries
  - Dependency directions and component interactions
  - Data flow and process sequences

### 4. Core Architectural Components

For each architectural component discovered in the codebase:

- **Purpose and Responsibility**:

  - Primary function within the architecture
  - Business domains or technical concerns addressed
  - Boundaries and scope limitations

- **Internal Structure**:

  - Organization of classes/modules within the component
  - Key abstractions and their implementations
  - Design patterns utilized

- **Interaction Patterns**:

  - How the component communicates with others
  - Interfaces exposed and consumed
  - Dependency injection patterns
  - Event publishing/subscription mechanisms

- **Evolution Patterns**:
  - How the component can be extended
  - Variation points and plugin mechanisms
  - Configuration and customization approaches

### 5. Architectural Layers and Dependencies

- Map the layer structure as implemented in the codebase
- Document the dependency rules between layers
- Identify abstraction mechanisms that enable layer separation
- Note any circular dependencies or layer violations
- Document dependency injection patterns used to maintain separation

### 6. Data Architecture

- Document domain model structure and organization
- Map entity relationships and aggregation patterns
- Identify data access patterns (repositories, data mappers, etc.)
- Document data transformation and mapping approaches
- Note caching strategies and implementations
- Document data validation patterns

### 7. Cross-Cutting Concerns Implementation

Document implementation patterns for cross-cutting concerns:

- **Authentication & Authorization**:

  - Security model implementation
  - Permission enforcement patterns
  - Identity management approach
  - Security boundary patterns

- **Error Handling & Resilience**:

  - Exception handling patterns
  - Retry and circuit breaker implementations
  - Fallback and graceful degradation strategies
  - Error reporting and monitoring approaches

- **Logging & Monitoring**:

  - Instrumentation patterns
  - Observability implementation
  - Diagnostic information flow
  - Performance monitoring approach

- **Validation**:

  - Input validation strategies
  - Business rule validation implementation
  - Validation responsibility distribution
  - Error reporting patterns

- **Configuration Management**:
  - Configuration source patterns
  - Environment-specific configuration strategies
  - Secret management approach
  - Feature flag implementation

### 8. Service Communication Patterns

- Document service boundary definitions
- Identify communication protocols and formats
- Map synchronous vs. asynchronous communication patterns
- Document API versioning strategies
- Identify service discovery mechanisms
- Note resilience patterns in service communication

### 9. Technology-Specific Architectural Patterns

- If PROJECT_TYPE is "Auto-detect": For each detected technology stack, document specific architectural patterns
- Otherwise: Document the specified PROJECT_TYPE's specific architectural patterns

#### .NET Architectural Patterns (if PROJECT_TYPE is ".NET" or "Auto-detect" and .NET is detected)

- Host and application model implementation
- Middleware pipeline organization
- Framework service integration patterns
- ORM and data access approaches
- API implementation patterns (controllers, minimal APIs, etc.)
- Dependency injection container configuration

#### Java Architectural Patterns (if PROJECT_TYPE is "Java" or "Auto-detect" and Java is detected)

- Application container and bootstrap process
- Dependency injection framework usage (Spring, CDI, etc.)
- AOP implementation patterns
- Transaction boundary management
- ORM configuration and usage patterns
- Service implementation patterns

#### React Architectural Patterns (if PROJECT_TYPE is "React" or "Auto-detect" and React is detected)

- Component composition and reuse strategies
- State management architecture
- Side effect handling patterns
- Routing and navigation approach
- Data fetching and caching patterns
- Rendering optimization strategies

#### Angular Architectural Patterns (if PROJECT_TYPE is "Angular" or "Auto-detect" and Angular is detected)

- Module organization strategy
- Component hierarchy design
- Service and dependency injection patterns
- State management approach
- Reactive programming patterns
- Route guard implementation

#### Python Architectural Patterns (if PROJECT_TYPE is "Python" or "Auto-detect" and Python is detected)

- Module organization approach
- Dependency management strategy
- OOP vs. functional implementation patterns
- Framework integration patterns
- Asynchronous programming approach

### 10. Implementation Patterns

If INCLUDES_IMPLEMENTATION_PATTERNS is true, document concrete implementation patterns for key architectural components:

- **Interface Design Patterns**:

  - Interface segregation approaches
  - Abstraction level decisions
  - Generic vs. specific interface patterns
  - Default implementation patterns

- **Service Implementation Patterns**:

  - Service lifetime management
  - Service composition patterns
  - Operation implementation templates
  - Error handling within services

- **Repository Implementation Patterns**:

  - Query pattern implementations
  - Transaction management
  - Concurrency handling
  - Bulk operation patterns

- **Controller/API Implementation Patterns**:

  - Request handling patterns
  - Response formatting approaches
  - Parameter validation
  - API versioning implementation

- **Domain Model Implementation**:
  - Entity implementation patterns
  - Value object patterns
  - Domain event implementation
  - Business rule enforcement

If INCLUDES_IMPLEMENTATION_PATTERNS is false, mention that detailed implementation patterns vary across the codebase.

### 11. Testing Architecture

- Document testing strategies aligned with the architecture
- Identify test boundary patterns (unit, integration, system)
- Map test doubles and mocking approaches
- Document test data strategies
- Note testing tools and frameworks integration

### 12. Deployment Architecture

- Document deployment topology derived from configuration
- Identify environment-specific architectural adaptations
- Map runtime dependency resolution patterns
- Document configuration management across environments
- Identify containerization and orchestration approaches
- Note cloud service integration patterns

### 13. Extension and Evolution Patterns

If FOCUS_ON_EXTENSIBILITY is true, provide detailed guidance for extending the architecture:

- **Feature Addition Patterns**:

  - How to add new features while preserving architectural integrity
  - Where to place new components by type
  - Dependency introduction guidelines
  - Configuration extension patterns

- **Modification Patterns**:

  - How to safely modify existing components
  - Strategies for maintaining backward compatibility
  - Deprecation patterns
  - Migration approaches

- **Integration Patterns**:
  - How to integrate new external systems
  - Adapter implementation patterns
  - Anti-corruption layer patterns
  - Service facade implementation

If FOCUS_ON_EXTENSIBILITY is false, document key extension points in the architecture.

### 14. Architectural Pattern Examples

If INCLUDES_CODE_EXAMPLES is true:
Extract representative code examples that illustrate key architectural patterns:

- **Layer Separation Examples**:

  - Interface definition and implementation separation
  - Cross-layer communication patterns
  - Dependency injection examples

- **Component Communication Examples**:

  - Service invocation patterns
  - Event publication and handling
  - Message passing implementation

- **Extension Point Examples**:
  - Plugin registration and discovery
  - Extension interface implementations
  - Configuration-driven extension patterns

Include enough context with each example to show the pattern clearly, but keep examples concise and focused on architectural concepts.

### 15. Architectural Decision Records

If INCLUDES_DECISION_RECORDS is true:
Document key architectural decisions evident in the codebase:

- **Architectural Style Decisions**:

  - Why the current architectural pattern was chosen
  - Alternatives considered (based on code evolution)
  - Constraints that influenced the decision

- **Technology Selection Decisions**:

  - Key technology choices and their architectural impact
  - Framework selection rationales
  - Custom vs. off-the-shelf component decisions

- **Implementation Approach Decisions**:
  - Specific implementation patterns chosen
  - Standard pattern adaptations
  - Performance vs. maintainability tradeoffs

For each decision, note:

- Context that made the decision necessary
- Factors considered in making the decision
- Resulting consequences (positive and negative)
- Future flexibility or limitations introduced

### 16. Architecture Governance

- Document how architectural consistency is maintained
- Identify automated checks for architectural compliance
- Note architectural review processes evident in the codebase
- Document architectural documentation practices

### 17. Blueprint for New Development

Create a clear architectural guide for implementing new features:

- **Development Workflow**:

  - Starting points for different feature types
  - Component creation sequence
  - Integration steps with existing architecture
  - Testing approach by architectural layer

- **Implementation Templates**:

  - Base class/interface templates for key architectural components
  - Standard file organization for new components
  - Dependency declaration patterns
  - Documentation requirements

- **Common Pitfalls**:
  - Architecture violations to avoid
  - Common architectural mistakes
  - Performance considerations
  - Testing blind spots

Include information about when this blueprint was generated and recommendations for keeping it updated as the architecture evolves.
