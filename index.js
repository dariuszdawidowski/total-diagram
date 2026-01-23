/**
 * Total Diagram - Main entry point for Node.js/npm imports
 * This file exports all classes for use in bundlers (webpack, vite, etc.)
 * targeting web applications
 */

// Import all modules
const TotalJSON = require('./src/format.js');
const { AnonymousTraversalSource, GraphTraversalSource, GraphTraversal } = require('./src/gremlin.js');
const TotalDiagramNode = require('./src/render-node.js');
const TotalDiagramLink = require('./src/render-link.js');
const TotalDiagramNodesManager = require('./src/manager-nodes.js');
const TotalDiagramLinksManager = require('./src/manager-links.js');
const TotalDiagramRenderHTML5 = require('./src/render.js');

// Export all classes as named exports
module.exports = {
    TotalJSON,
    AnonymousTraversalSource,
    GraphTraversalSource,
    GraphTraversal,
    TotalDiagramNode,
    TotalDiagramLink,
    TotalDiagramNodesManager,
    TotalDiagramLinksManager,
    TotalDiagramRenderHTML5,
    // Convenience alias for the main renderer
    TotalDiagram: TotalDiagramRenderHTML5
};

// Individual named exports for better ES6 compatibility
module.exports.TotalJSON = TotalJSON;
module.exports.AnonymousTraversalSource = AnonymousTraversalSource;
module.exports.GraphTraversalSource = GraphTraversalSource;
module.exports.GraphTraversal = GraphTraversal;
module.exports.TotalDiagramNode = TotalDiagramNode;
module.exports.TotalDiagramLink = TotalDiagramLink;
module.exports.TotalDiagramNodesManager = TotalDiagramNodesManager;
module.exports.TotalDiagramLinksManager = TotalDiagramLinksManager;
module.exports.TotalDiagramRenderHTML5 = TotalDiagramRenderHTML5;
module.exports.TotalDiagram = TotalDiagramRenderHTML5;

// Default export for bundler compatibility
module.exports.default = module.exports;
