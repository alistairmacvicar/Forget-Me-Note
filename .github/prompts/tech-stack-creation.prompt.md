---
description: 'Comprehensive technology stack blueprint generator that analyzes codebases to create detailed architectural documentation. Automatically detects technology stacks, programming languages, and implementation patterns across multiple platforms (.NET, Java, JavaScript, React, Python). Generates configurable blueprints with version information, licensing details, usage patterns, coding conventions, and visual diagrams. Provides implementation-ready templates and maintains architectural consistency for guided development.'
mode: 'agent'
---

# Comprehensive Technology Stack Blueprint Generator

## Configuration

Before proceeding, I need to gather configuration preferences. If you haven't provided these values, I will ask you for each one:

**PROJECT_TYPE**: Primary technology (Auto-detect | .NET | Java | JavaScript | React.js | React Native | Angular | Python | Other)
**DEPTH_LEVEL**: Analysis depth (Basic | Standard | Comprehensive | Implementation-Ready)
**INCLUDE_VERSIONS**: Include version information? (true | false)
**INCLUDE_LICENSES**: Include license information? (true | false)
**INCLUDE_DIAGRAMS**: Generate architecture diagrams? (true | false)
**INCLUDE_USAGE_PATTERNS**: Include code usage patterns? (true | false)
**INCLUDE_CONVENTIONS**: Document coding conventions? (true | false)
**OUTPUT_FORMAT**: Select output format (Markdown | JSON | YAML | HTML)
**CATEGORIZATION**: Organization method (Technology Type | Layer | Purpose)

If any configuration values are missing from your request, I will ask you to provide them before generating the documentation.

## Instructions

Step 1: Check if the user has provided all required configuration values. If any are missing, ask the user to provide them before proceeding. Present the missing values as a simple list of questions.

Step 2: Once all configuration is gathered, create or update a technology stack blueprint at the specified DEPTH_LEVEL that thoroughly documents technologies and implementation patterns to facilitate consistent code generation.

### 0. Documentation Mode Detection

- Determine the expected filename based on OUTPUT_FORMAT (e.g., 'Technology_Stack_Blueprint.md' for Markdown)
- Search for existing technology stack blueprint file in the workspace
- If found: Switch to UPDATE mode and follow incremental update workflow
- If not found: Continue with CREATE mode using full analysis workflow below

### UPDATE MODE WORKFLOW

When existing technology stack documentation is found:

#### A. Analyze Existing Documentation

- Read the current Technology Stack Blueprint thoroughly
- Extract all documented technologies, versions, and patterns
- Identify the date/version information if present
- Note the scope, format, and categorization approach used

#### B. Detect Technology Changes

- **New Dependencies**: Scan package files (package.json, .csproj, pom.xml, requirements.txt, etc.) for new dependencies
- **Version Updates**: Compare current versions against documented versions
- **Removed Dependencies**: Identify dependencies no longer present in configuration files
- **New Technologies**: Search for newly introduced languages, frameworks, or tools
- **Configuration Changes**: Detect new build tools, linters, formatters, or pipeline configurations
- **Pattern Evolution**: Identify new coding patterns or implementation approaches in recent code
- **Deprecated Technologies**: Find technologies marked for removal or replacement

#### C. Scope Analysis

- **File System Scan**: Compare current project structure against documented structure
- **Convention Changes**: Analyze recent code for shifts in naming conventions or organizational patterns
- **New Code Examples**: Identify representative new implementations that should be documented
- **Usage Pattern Changes**: Detect shifts in how existing technologies are being used

#### D. Propose Incremental Updates

Before making changes, present:

- List of sections requiring updates with specific reasons
- New technologies/dependencies to document
- Version updates to apply
- Deprecated technologies to remove or mark as legacy
- New implementation patterns to document
- Changes to coding conventions or organizational patterns

#### E. Apply Targeted Updates

- Update dependency lists with new/removed packages and version changes
- Add documentation for newly introduced technologies maintaining existing structure
- Update version information throughout the document
- Refresh usage examples to reflect current implementation patterns
- Update code convention documentation if patterns have evolved
- Add new code examples for recently added functionality
- Mark deprecated technologies clearly with migration notes if applicable
- Update technology relationship diagrams to reflect current integrations
- Preserve the existing documentation format and style
- Update metadata: last updated date, version references

#### F. Validate Technology Accuracy

- Cross-reference all documented technologies against actual project files
- Verify all version numbers match current configurations
- Ensure all code examples are syntactically correct and current
- Validate that all documented patterns exist in the codebase
- Confirm dependency categorizations remain accurate

#### G. Version Tracking (if INCLUDE_VERSIONS is true)

- Highlight all version changes since last documentation update
- Note any breaking changes in dependency upgrades
- Document compatibility requirements for new dependencies

If in UPDATE mode, prioritize incremental changes over full regeneration. Otherwise, continue with CREATE mode below.

### CREATE MODE WORKFLOW

Use the following approach:

### 1. Technology Identification Phase

- If PROJECT_TYPE is "Auto-detect": Scan the codebase for project files, configuration files, and dependencies to determine all technology stacks in use
- Otherwise: Focus on the specified PROJECT_TYPE technologies
- Identify all programming languages by examining file extensions and content
- Analyze configuration files (package.json, .csproj, pom.xml, etc.) to extract dependencies
- Examine build scripts and pipeline definitions for tooling information
- If INCLUDE_VERSIONS is true: Extract precise version information from package files and configuration
- If INCLUDE_LICENSES is true: Document license information for all dependencies

### 2. Core Technologies Analysis

#### .NET Stack Analysis (if PROJECT_TYPE is ".NET" or "Auto-detect" and .NET is detected)

- Target frameworks and language versions (detect from project files)
- All NuGet package references with versions and purpose comments
- Project structure and organization patterns
- Configuration approach (appsettings.json, IOptions, etc.)
- Authentication mechanisms (Identity, JWT, etc.)
- API design patterns (REST, GraphQL, minimal APIs, etc.)
- Data access approaches (EF Core, Dapper, etc.)
- Dependency injection patterns
- Middleware pipeline components

#### Java Stack Analysis (if PROJECT_TYPE is "Java" or "Auto-detect" and Java is detected)

- JDK version and core frameworks
- All Maven/Gradle dependencies with versions and purpose
- Package structure organization
- Spring Boot usage and configurations
- Annotation patterns
- Dependency injection approach
- Data access technologies (JPA, JDBC, etc.)
- API design (Spring MVC, JAX-RS, etc.)

#### JavaScript Stack Analysis (if PROJECT_TYPE is "JavaScript" or "Auto-detect" and JavaScript is detected)

- ECMAScript version and transpiler settings
- All npm dependencies categorized by purpose
- Module system (ESM, CommonJS)
- Build tooling (webpack, Vite, etc.) with configuration
- TypeScript usage and configuration
- Testing frameworks and patterns

#### React Analysis (if PROJECT_TYPE is "React.js" or "Auto-detect" and React is detected)

- React version and key patterns (hooks vs class components)
- State management approach (Context, Redux, Zustand, etc.)
- Component library usage (Material-UI, Chakra, etc.)
- Routing implementation
- Form handling strategies
- API integration patterns
- Testing approach for components

#### Python Analysis (if PROJECT_TYPE is "Python" or "Auto-detect" and Python is detected)

- Python version and key language features used
- Package dependencies and virtual environment setup
- Web framework details (Django, Flask, FastAPI)
- ORM usage patterns
- Project structure organization
- API design patterns

### 3. Implementation Patterns & Conventions

If INCLUDE_CONVENTIONS is true, document coding conventions and patterns for each technology area:

#### Naming Conventions

- Class/type naming patterns
- Method/function naming patterns
- Variable naming conventions
- File naming and organization conventions
- Interface/abstract class patterns

#### Code Organization

- File structure and organization
- Folder hierarchy patterns
- Component/module boundaries
- Code separation and responsibility patterns

#### Common Patterns

- Error handling approaches
- Logging patterns
- Configuration access
- Authentication/authorization implementation
- Validation strategies
- Testing patterns

### 4. Usage Examples

If INCLUDE_USAGE_PATTERNS is true, extract representative code examples showing standard implementation patterns:

#### API Implementation Examples

- Standard controller/endpoint implementation
- Request DTO pattern
- Response formatting
- Validation approach
- Error handling

#### Data Access Examples

- Repository pattern implementation
- Entity/model definitions
- Query patterns
- Transaction handling

#### Service Layer Examples

- Service class implementation
- Business logic organization
- Cross-cutting concerns integration
- Dependency injection usage

#### UI Component Examples (if applicable)

- Component structure
- State management pattern
- Event handling
- API integration pattern

### 5. Technology Stack Map

If DEPTH_LEVEL is "Comprehensive" or "Implementation-Ready", create a comprehensive technology map including:

#### Core Framework Usage

- Primary frameworks and their specific usage in the project
- Framework-specific configurations and customizations
- Extension points and customizations

#### Integration Points

- How different technology components integrate
- Authentication flow between components
- Data flow between frontend and backend
- Third-party service integration patterns

#### Development Tooling

- IDE settings and conventions
- Code analysis tools
- Linters and formatters with configuration
- Build and deployment pipeline
- Testing frameworks and approaches

#### Infrastructure

- Deployment environment details
- Container technologies
- Cloud services utilized
- Monitoring and logging infrastructure

### 6. Technology-Specific Implementation Details

#### .NET Implementation Details (if PROJECT_TYPE is ".NET" or "Auto-detect" and .NET is detected)

- **Dependency Injection Pattern**:
  - Service registration approach (Scoped/Singleton/Transient patterns)
  - Configuration binding patterns
- **Controller Patterns**:
  - Base controller usage
  - Action result types and patterns
  - Route attribute conventions
  - Filter usage (authorization, validation, etc.)
- **Data Access Patterns**:
  - ORM configuration and usage
  - Entity configuration approach
  - Relationship definitions
  - Query patterns and optimization approaches
- **API Design Patterns** (if used):
  - Endpoint organization
  - Parameter binding approaches
  - Response type handling
- **Language Features Used**:
  - Detect specific language features from code
  - Identify common patterns and idioms
  - Note any specific version-dependent features

#### React Implementation Details (if PROJECT_TYPE is "React.js" or "Auto-detect" and React is detected)

- **Component Structure**:
  - Function vs class components
  - Props interface definitions
  - Component composition patterns
- **Hook Usage Patterns**:
  - Custom hook implementation style
  - useState patterns
  - useEffect cleanup approaches
  - Context usage patterns
- **State Management**:
  - Local vs global state decisions
  - State management library patterns
  - Store configuration
  - Selector patterns
- **Styling Approach**:
  - CSS methodology (CSS modules, styled-components, etc.)
  - Theme implementation
  - Responsive design patterns

### 7. Blueprint for New Code Implementation

If DEPTH_LEVEL is "Implementation-Ready", based on the analysis, provide a detailed blueprint for implementing new features:

- **File/Class Templates**: Standard structure for common component types
- **Code Snippets**: Ready-to-use code patterns for common operations
- **Implementation Checklist**: Standard steps for implementing features end-to-end
- **Integration Points**: How to connect new code with existing systems
- **Testing Requirements**: Standard test patterns for different component types
- **Documentation Requirements**: Standard doc patterns for new features

### 8. Technology Relationship Diagrams

If INCLUDE_DIAGRAMS is true:

- **Stack Diagram**: Visual representation of the complete technology stack
- **Dependency Flow**: How different technologies interact
- **Component Relationships**: How major components depend on each other
- **Data Flow**: How data flows through the technology stack

### 9. Technology Decision Context

- Document apparent reasons for technology choices
- Note any legacy or deprecated technologies marked for replacement
- Identify technology constraints and boundaries
- Document technology upgrade paths and compatibility considerations

Format the output using the specified OUTPUT_FORMAT and categorize technologies by the specified CATEGORIZATION method.

Save the output as 'Technology_Stack_Blueprint' with the appropriate file extension for the OUTPUT_FORMAT (e.g., .md for Markdown, .json for JSON, .yml for YAML, .html for HTML).
