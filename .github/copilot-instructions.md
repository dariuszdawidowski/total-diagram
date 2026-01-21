# GitHub Copilot Instructions for Total Diagram

## Project Overview

Total Diagram is a simple, powerful, extensible, and fast JavaScript/ES8 diagram renderer for web browsers. It's a library for rendering diagrams consisting of nodes and links, designed for simplicity and flexibility.

**Key Philosophy:**
- Keep it simple and clean - no unnecessary complexity
- Vanilla JavaScript/ES8 with no dependencies
- Browser-centric library (npm only used for minification/bundling)
- Extensible architecture for building custom diagramming applications

## Architecture

### Core Components

1. **TotalDiagramRenderHTML5** (`render.js`)
   - Main renderer that manages the entire diagram
   - Handles pan, zoom, and transform operations
   - Creates and manages the DOM container and board
   - Integrates nodes and links managers

2. **TotalDiagramNodesManager** (`manager-nodes.js`)
   - Manages all nodes on the diagram
   - Handles adding, deleting, and finding nodes
   - Broadcasts custom events for node operations

3. **TotalDiagramLinksManager** (`manager-links.js`)
   - Manages all links/connections between nodes
   - Handles link creation, deletion, and retrieval

4. **TotalDiagramNode** (`render-node.js`)
   - Base class for diagram nodes
   - Contains transform properties (position, dimensions, z-index)
   - Manages node links
   - Extensible for custom node types

5. **TotalDiagramLink** (`render-link.js`)
   - Base class for diagram links/connections
   - Connects nodes together
   - Handles rendering of connections

6. **Gremlin Light** (`gremlin.js`)
   - Ultra lightweight graph traversal query language
   - Inspired by Apache TinkerPop™ Gremlin
   - Used for querying and traversing the diagram graph

## Coding Conventions

### Style Guidelines

1. **Classes:**
   - Use ES6 classes with descriptive names
   - Class names start with `TotalDiagram` prefix
   - Use PascalCase for class names

2. **Comments:**
   - Add ASCII art headers at the top of each file for visual identity
   - Use JSDoc style comments for constructors and methods
   - Include parameter types and descriptions

3. **Constructor Parameters:**
   - Use object destructuring for flexible arguments: `constructor(args = {})`
   - Provide default values and check for optional parameters
   - Document all parameters in JSDoc comments

4. **Naming:**
   - Use camelCase for methods and properties
   - Use descriptive names that clearly indicate purpose
   - Keep method names concise but meaningful

5. **Code Organization:**
   - Group related functionality together
   - Use arrow functions for inline callbacks and object methods
   - Keep transforms and state in clear object structures

### Code Patterns

1. **Transform Objects:**
   ```javascript
   this.transform = {
       x: 'x' in args ? args.x : 0,
       y: 'y' in args ? args.y : 0,
       // Include helper methods as arrow functions
       clear: () => { /* ... */ }
   };
   ```

2. **Event Broadcasting:**
   ```javascript
   const event = new CustomEvent('broadcast:eventname', { detail: data });
   this.render.container.dispatchEvent(event);
   ```

3. **Manager Pattern:**
   - Managers maintain a `list` array of managed objects
   - Managers have reference to the main `render` object
   - Use `add()`, `del()`, and `get()` methods consistently

4. **ID Generation:**
   - Use `crypto.randomUUID()` for generating unique IDs
   - Always provide option to pass custom ID

## Build System

- **Build Process:** Uses EJS templates to bundle and minify files
- **Entry Point:** `total-diagram.js.ejs` includes all source files
- **Output:** Minified bundle in `dist/total-diagram.js`
- **Tools:** Terser for minification, EJS for templating

### Build Command
```bash
npm run build
```

## File Structure

```
/
├── render.js              # Main renderer
├── manager-nodes.js       # Node manager
├── manager-links.js       # Link manager
├── render-node.js         # Node base class
├── render-link.js         # Link base class
├── gremlin.js            # Graph traversal
├── format.js             # TotalJSON serialization/deserialization
├── build.js              # Build script
├── total-diagram.js.ejs  # Bundle template
├── examples/             # Tutorial examples
└── dist/                 # Build output
```

## Best Practices

1. **Keep It Vanilla:**
   - Don't add external dependencies
   - Use native browser APIs
   - Keep ES8 as the target

2. **Extensibility:**
   - Design for inheritance (base classes for nodes and links)
   - Use custom events for communication
   - Allow user overrides and extensions

3. **Performance:**
   - Use efficient DOM manipulation
   - Implement transform caching
   - Consider z-index for rendering optimization

4. **API Design:**
   - Keep APIs simple and intuitive
   - Use consistent patterns across managers
   - Provide clear examples in the `examples/` directory

5. **Documentation:**
   - Each example file should be self-explanatory
   - Include inline comments for complex logic
   - Keep README.md up to date

## Testing

- **Framework:** Cypress for E2E testing
- **Location:** `cypress/` directory
- **Run Tests:** `npm test`

## Examples Structure

Examples serve as tutorials and should:
- Be progressive (numbered 1, 2, 3, etc.)
- Include complete HTML with inline CSS
- Demonstrate one concept per example
- Be self-contained and runnable

## When Contributing

1. **Maintain Simplicity:**
   - Don't over-engineer solutions
   - Keep the core small and focused
   - Add features as extensions, not core complexity

2. **Follow Patterns:**
   - Study existing code before adding new features
   - Match the style of existing files
   - Use the same event and manager patterns

3. **Test Changes:**
   - Run existing Cypress tests
   - Test in examples directory
   - Verify minified bundle works

4. **Documentation:**
   - Update examples if API changes
   - Add JSDoc comments to new methods
   - Keep README.md current
