/**
 * Total Diagram - Main entry point for Node.js/npm imports
 * This file exports all classes for use in bundlers (webpack, vite, etc.)
 * targeting web applications
 */

// Import all modules
const TotalJSON = require('./format.js');
const { AnonymousTraversalSource, GraphTraversalSource, GraphTraversal } = require('./gremlin.js');
const TotalDiagramNode = require('./render-node.js');
const TotalDiagramLink = require('./render-link.js');
const TotalDiagramNodesManager = require('./manager-nodes.js');
const TotalDiagramLinksManager = require('./manager-links.js');
const TotalDiagramRenderHTML5 = require('./render.js');

// Export all classes
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
