/**
 * Unit tests for index.js entry point
 */

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: () => 'test-uuid-' + Math.random()
};

// Load the main entry point
const TotalDiagram = require('../index.js');

describe('Index Entry Point', () => {

    test('should export TotalJSON', () => {
        expect(TotalDiagram.TotalJSON).toBeDefined();
        expect(typeof TotalDiagram.TotalJSON).toBe('function');
    });

    test('should export TotalDiagramNode', () => {
        expect(TotalDiagram.TotalDiagramNode).toBeDefined();
        expect(typeof TotalDiagram.TotalDiagramNode).toBe('function');
    });

    test('should export TotalDiagramLink', () => {
        expect(TotalDiagram.TotalDiagramLink).toBeDefined();
        expect(typeof TotalDiagram.TotalDiagramLink).toBe('function');
    });

    test('should export TotalDiagramNodesManager', () => {
        expect(TotalDiagram.TotalDiagramNodesManager).toBeDefined();
        expect(typeof TotalDiagram.TotalDiagramNodesManager).toBe('function');
    });

    test('should export TotalDiagramLinksManager', () => {
        expect(TotalDiagram.TotalDiagramLinksManager).toBeDefined();
        expect(typeof TotalDiagram.TotalDiagramLinksManager).toBe('function');
    });

    test('should export TotalDiagramRenderHTML5', () => {
        expect(TotalDiagram.TotalDiagramRenderHTML5).toBeDefined();
        expect(typeof TotalDiagram.TotalDiagramRenderHTML5).toBe('function');
    });

    test('should export TotalDiagram as alias for TotalDiagramRenderHTML5', () => {
        expect(TotalDiagram.TotalDiagram).toBeDefined();
        expect(TotalDiagram.TotalDiagram).toBe(TotalDiagram.TotalDiagramRenderHTML5);
    });

    test('should create TotalDiagramNode instance', () => {
        const node = new TotalDiagram.TotalDiagramNode({ id: 'test-1', name: 'Test Node' });
        expect(node.id).toBe('test-1');
        expect(node.name).toBe('Test Node');
    });

    test('should create TotalDiagramNodesManager instance', () => {
        const manager = new TotalDiagram.TotalDiagramNodesManager();
        expect(manager.list).toEqual([]);
    });

    test('should create TotalDiagramLinksManager instance', () => {
        const manager = new TotalDiagram.TotalDiagramLinksManager();
        expect(manager.list).toEqual([]);
    });

});
