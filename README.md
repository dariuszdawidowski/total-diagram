<p align="center">
<img src="https://raw.githubusercontent.com/dariuszdawidowski/total-diagram/main/total-diagram-logo.png">
</p>
<h1 align="center">
Total Diagram
</h1>
<p align="center">
Simple, powerful, extensible and fast JavaScript/ES8 diagram renderer for web browsers.
</p>
<p align="center">
v0.10.0
</p>

[![build](https://github.com/dariuszdawidowski/total-diagram/actions/workflows/build.yml/badge.svg)](https://github.com/dariuszdawidowski/total-diagram/actions/workflows/build.yml)
[![npm](https://img.shields.io/npm/v/total-diagram)](https://www.npmjs.com/package/total-diagram)
[![NPM Downloads](https://img.shields.io/npm/dm/total-diagram)](https://www.npmjs.com/package/total-diagram)
[![license](https://img.shields.io/github/license/dariuszdawidowski/total-diagram?color=9cf)](./LICENSE)

# About

A library for rendering diagrams consisting of nodes and links.
Designed for simplicity, it can be the basis for creating a diagramming application or data representation on a website.

<img src="https://raw.githubusercontent.com/dariuszdawidowski/total-diagram/main/total-diagram-showcase.png" alt="" />

# Quick Start

## Browser Usage (Script Tag)

Load the library directly in your HTML:

```html
<script src="https://unpkg.com/total-diagram@latest/dist/total-diagram.js"></script>
<script>
    // All classes are available globally
    const nodes = new TotalDiagramNodesManager();
    const links = new TotalDiagramLinksManager();
    const render = new TotalDiagramRenderHTML5({
        container: document.getElementById('container'),
        nodes: nodes,
        links: links
    });
</script>
```

## Node.js/npm Usage (for bundlers)

Install via npm:

```bash
npm install total-diagram
```

Import in your JavaScript:

```javascript
// ES6 import (for webpack, vite, rollup, etc.)
// Modern bundlers will automatically convert the CommonJS exports
import {
    TotalDiagramRenderHTML5,
    TotalDiagramNode,
    TotalDiagramLink,
    TotalDiagramNodesManager,
    TotalDiagramLinksManager
} from 'total-diagram';

// Or using CommonJS require
const {
    TotalDiagramRenderHTML5,
    TotalDiagramNode,
    TotalDiagramLink,
    TotalDiagramNodesManager,
    TotalDiagramLinksManager
} = require('total-diagram');
```

**Note:** This library is designed for web browsers. The npm package is intended for use with bundlers (webpack, vite, rollup, etc.) that target the browser, not for command-line Node.js applications.

For more details look into 'examples/' directory. You can find self-explanatory tutorials there.

# Philosophy behind the library

Does the world need yet another library for displaying diagrams?
I tried most of them and the problem I encountered was that I couldn't realize my idea because it was inconsistent with the vision of the creators of the library.
The bigger and more complicated the library becomes, the less flexible it is proportionally.
The basis of this project is very clean and simple, no need to complicate it.
The first thing you should do is analyze all the files in the 'examples' directory, which are a kind of tutorial on how to build your own diagramming system based on this solution.
If you are looking for an example of building a larger system based on this library, see the project https://github.com/dariuszdawidowski/metaviz-editor.

# Features

- Vanilla JavaScript/ES8
- No dependencies

# Build minified library

```bash
npm install
npm run build
```

# Testing

Before running tests, install dependencies:

```bash
npm install
```

## Jest (unit tests)

Run all unit tests once:

```bash
npm test
```

Run Jest in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Cypress (E2E tests)

Open Cypress test runner (interactive mode):

```bash
npx http-server . -p 8080 -a 127.0.0.1
npm run test:e2e
```

Run Cypress in headless mode (for agents):

```bash
npx cypress run
```

# Authors

Dariusz Dawidowski\
Jagoda Dawidowska
