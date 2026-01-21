/**
 * Unit tests for TotalDiagramLink
 */

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: () => 'test-link-uuid-123'
};

// Load the required classes
const TotalDiagramNode = require('../src/render-node.js');
const TotalDiagramLink = require('../src/render-link.js');

describe('TotalDiagramLink', () => {

    let startNode;
    let endNode;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '';
        
        // Create test nodes
        startNode = new TotalDiagramNode({ id: 'start-node' });
        endNode = new TotalDiagramNode({ id: 'end-node' });
    });

    describe('Constructor', () => {

        test('should create link with default id', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            expect(link.id).toBeDefined();
            expect(typeof link.id).toBe('string');
        });

        test('should create link with custom id', () => {
            const link = new TotalDiagramLink({ 
                id: 'custom-link-id',
                start: startNode, 
                end: endNode 
            });
            
            expect(link.id).toBe('custom-link-id');
            expect(link.element.dataset.id).toBe('custom-link-id');
        });

        test('should connect to start node', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            expect(link.start).toBe(startNode);
            expect(startNode.links.list).toContain(link);
        });

        test('should connect to end node', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            expect(link.end).toBe(endNode);
            expect(endNode.links.list).toContain(link);
        });

        test('should create SVG element', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            expect(link.element.tagName).toBe('svg');
            expect(link.element.classList.contains('link')).toBe(true);
        });

    });

    describe('destructor()', () => {

        test('should remove link from start node', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            link.destructor();
            
            expect(startNode.links.list).not.toContain(link);
        });

        test('should remove link from end node', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            link.destructor();
            
            expect(endNode.links.list).not.toContain(link);
        });

    });

    describe('serialize()', () => {

        test('should serialize link data', () => {
            const link = new TotalDiagramLink({ 
                id: 'link-1',
                start: startNode, 
                end: endNode 
            });
            
            const serialized = link.serialize();
            
            expect(serialized).toEqual({
                id: 'link-1',
                type: 'TotalDiagramLink',
                start: 'start-node',
                end: 'end-node'
            });
        });

    });

    describe('transparent()', () => {

        test('should set opacity', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            link.transparent(50);
            
            expect(link.element.style.opacity).toBe('0.5');
        });

        test('should remove opacity at 100%', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            link.element.style.opacity = '0.5';
            
            link.transparent(100);
            
            expect(link.element.style.opacity).toBe('');
        });

    });

    describe('update()', () => {

        test('should have update method', () => {
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            expect(typeof link.update).toBe('function');
            expect(() => link.update()).not.toThrow();
        });

    });

});
