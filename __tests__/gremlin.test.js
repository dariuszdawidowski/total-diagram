/**
 * Unit tests for Gremlin Light
 */

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: () => 'test-uuid-' + Math.random()
};

// Load the required classes
const TotalDiagramNode = require('../render-node.js');
const TotalDiagramLink = require('../render-link.js');
const { AnonymousTraversalSource, GraphTraversalSource, GraphTraversal } = require('../gremlin.js');

describe('Gremlin Light', () => {

    let nodes;
    let links;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '';
        
        // Create test nodes
        nodes = [
            new TotalDiagramNode({ id: 'node-1', name: 'Node 1' }),
            new TotalDiagramNode({ id: 'node-2', name: 'Node 2' }),
            new TotalDiagramNode({ id: 'node-3', name: 'Node 3' })
        ];
        
        // Create test links
        links = [
            new TotalDiagramLink({ id: 'link-1', start: nodes[0], end: nodes[1] }),
            new TotalDiagramLink({ id: 'link-2', start: nodes[1], end: nodes[2] })
        ];
    });

    describe('AnonymousTraversalSource', () => {

        test('should create traversal source', () => {
            const traversal = AnonymousTraversalSource.traversal;
            
            expect(typeof traversal).toBe('function');
        });

        test('should create traversal source with custom class', () => {
            class CustomTraversalSource {}
            const traversal = AnonymousTraversalSource.traversal(CustomTraversalSource);
            
            expect(traversal.traversalSourceClass).toBe(CustomTraversalSource);
        });

        test('should create traversal source with default GraphTraversalSource', () => {
            const traversal = AnonymousTraversalSource.traversal();
            
            expect(traversal.traversalSourceClass).toBe(GraphTraversalSource);
        });

        test('should create graph traversal source with lists', () => {
            const traversal = AnonymousTraversalSource.traversal;
            const g = traversal().withLists(nodes, links);
            
            expect(g).toBeInstanceOf(GraphTraversalSource);
            expect(g.vertices).toBe(nodes);
            expect(g.edges).toBe(links);
        });

    });

    describe('GraphTraversalSource', () => {

        let g;

        beforeEach(() => {
            const traversal = AnonymousTraversalSource.traversal;
            g = traversal().withLists(nodes, links);
        });

        test('should get all vertices', () => {
            const result = g.V();
            
            expect(result).toBeInstanceOf(GraphTraversal);
        });

        test('should get all edges', () => {
            const result = g.E();
            
            expect(result).toBeInstanceOf(GraphTraversal);
        });

        test('should query vertices by id', () => {
            const result = g.V('node-1');
            
            expect(result).toBeInstanceOf(GraphTraversal);
        });

        test('should query edges by id', () => {
            const result = g.E('link-1');
            
            expect(result).toBeInstanceOf(GraphTraversal);
        });

    });

    describe('GraphTraversal', () => {

        let g;

        beforeEach(() => {
            const traversal = AnonymousTraversalSource.traversal;
            g = traversal().withLists(nodes, links);
        });

        describe('V() - Vertices', () => {

            test('should get all vertices', () => {
                const result = g.V().toList();
                
                expect(result).toEqual(nodes);
                expect(result.length).toBe(3);
            });

            test('should get vertex by id', () => {
                const result = g.V('node-2').next();
                
                expect(result).toBe(nodes[1]);
                expect(result.id).toBe('node-2');
            });

            test('should get vertex by class type', () => {
                class CustomNode extends TotalDiagramNode {}
                const customNode = new CustomNode({ id: 'custom-node' });
                const mixedNodes = [...nodes, customNode];
                
                const gCustom = AnonymousTraversalSource.traversal().withLists(mixedNodes, links);
                const result = gCustom.V(CustomNode).toList();
                
                expect(result).toEqual([customNode]);
            });

            test('should get vertex by DOM element', () => {
                document.body.appendChild(nodes[0].element);
                
                const result = g.V(nodes[0].element).next();
                
                expect(result).toBe(nodes[0]);
            });

        });

        describe('E() - Edges', () => {

            test('should get all edges', () => {
                const result = g.E().toList();
                
                expect(result).toEqual(links);
                expect(result.length).toBe(2);
            });

            test('should get edge by id', () => {
                const result = g.E('link-1').next();
                
                expect(result).toBe(links[0]);
                expect(result.id).toBe('link-1');
            });

            test('should get edge by class type', () => {
                class CustomLink extends TotalDiagramLink {}
                const node4 = new TotalDiagramNode({ id: 'node-4' });
                const customLink = new CustomLink({ id: 'custom-link', start: nodes[2], end: node4 });
                const mixedLinks = [...links, customLink];
                
                const gCustom = AnonymousTraversalSource.traversal().withLists(nodes, mixedLinks);
                const result = gCustom.E(CustomLink).toList();
                
                expect(result).toEqual([customLink]);
            });

        });

        describe('Traversal methods', () => {

            test('hasNext() should return true for single result', () => {
                const traversal = g.V('node-1');
                
                expect(traversal.hasNext()).toBe(true);
            });

            test('hasNext() should return false for array result', () => {
                const traversal = g.V();
                
                expect(traversal.hasNext()).toBe(false);
            });

            test('next() should return result', () => {
                const traversal = g.V('node-1');
                const result = traversal.next();
                
                expect(result).toBe(nodes[0]);
            });

            test('toList() should return array for multiple results', () => {
                const traversal = g.V();
                const result = traversal.toList();
                
                expect(Array.isArray(result)).toBe(true);
                expect(result).toEqual(nodes);
            });

            test('toList() should wrap single result in array', () => {
                const traversal = g.V('node-1');
                const result = traversal.toList();
                
                expect(Array.isArray(result)).toBe(true);
                expect(result).toEqual([nodes[0]]);
            });

        });

    });

});
