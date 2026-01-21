/**
 * Unit tests for TotalDiagramLinksManager
 */

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: () => 'test-uuid-' + Math.random()
};

// Load the required classes
const TotalDiagramNode = require('../src/render-node.js');
const TotalDiagramLink = require('../src/render-link.js');
const TotalDiagramLinksManager = require('../src/manager-links.js');

describe('TotalDiagramLinksManager', () => {

    let manager;
    let mockRender;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="test-container"></div>';
        
        // Create mock render object
        mockRender = {
            container: document.getElementById('test-container'),
            board: document.createElement('div')
        };
        document.body.appendChild(mockRender.board);
        
        // Create manager
        manager = new TotalDiagramLinksManager();
        manager.render = mockRender;
    });

    describe('Constructor', () => {

        test('should create manager with empty list', () => {
            const newManager = new TotalDiagramLinksManager();
            
            expect(newManager.list).toEqual([]);
            expect(newManager.render).toBeNull();
        });

    });

    describe('add()', () => {

        test('should add link to list', () => {
            const startNode = new TotalDiagramNode({ id: 'node-1' });
            const endNode = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            manager.add(link);
            
            expect(manager.list).toContain(link);
        });

        test('should add link to DOM', () => {
            const startNode = new TotalDiagramNode({ id: 'node-1' });
            const endNode = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            
            manager.add(link);
            
            expect(mockRender.board.contains(link.element)).toBe(true);
        });

        test('should dispatch broadcast:addlink event', () => {
            const startNode = new TotalDiagramNode({ id: 'node-1' });
            const endNode = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            const eventListener = jest.fn();
            mockRender.container.addEventListener('broadcast:addlink', eventListener);
            
            manager.add(link);
            
            expect(eventListener).toHaveBeenCalled();
            const event = eventListener.mock.calls[0][0];
            expect(event.detail).toBe(link);
        });

        test('should not add link without start node', () => {
            const endNode = new TotalDiagramNode({ id: 'node-2' });
            // Cannot create link without start node - constructor will fail
            // This test verifies that manager.add checks for null nodes
            const mockLink = { 
                start: null, 
                end: endNode,
                element: document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            };
            
            const result = manager.add(mockLink);
            
            expect(result).toBeNull();
            expect(manager.list).not.toContain(mockLink);
        });

        test('should not add link without end node', () => {
            const startNode = new TotalDiagramNode({ id: 'node-1' });
            // Cannot create link without end node - constructor will fail
            // This test verifies that manager.add checks for null nodes
            const mockLink = { 
                start: startNode, 
                end: null,
                element: document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            };
            
            const result = manager.add(mockLink);
            
            expect(result).toBeNull();
            expect(manager.list).not.toContain(mockLink);
        });

    });

    describe('del()', () => {

        test('should delete link from list', () => {
            const startNode = new TotalDiagramNode({ id: 'node-1' });
            const endNode = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            manager.add(link);
            
            manager.del(link);
            
            expect(manager.list).not.toContain(link);
        });

        test('should remove link from DOM', () => {
            const startNode = new TotalDiagramNode({ id: 'node-1' });
            const endNode = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            manager.add(link);
            
            manager.del(link);
            
            expect(mockRender.board.contains(link.element)).toBe(false);
        });

        test('should call link.destructor()', () => {
            const startNode = new TotalDiagramNode({ id: 'node-1' });
            const endNode = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            link.destructor = jest.fn();
            manager.add(link);
            
            manager.del(link);
            
            expect(link.destructor).toHaveBeenCalled();
        });

        test('should dispatch broadcast:dellink event', () => {
            const startNode = new TotalDiagramNode({ id: 'node-1' });
            const endNode = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ start: startNode, end: endNode });
            const eventListener = jest.fn();
            mockRender.container.addEventListener('broadcast:dellink', eventListener);
            manager.add(link);
            
            manager.del(link);
            
            expect(eventListener).toHaveBeenCalled();
            const event = eventListener.mock.calls[0][0];
            expect(event.detail).toBe(link);
        });

        test('should delete all links with "*"', () => {
            const node1 = new TotalDiagramNode({ id: 'node-1' });
            const node2 = new TotalDiagramNode({ id: 'node-2' });
            const node3 = new TotalDiagramNode({ id: 'node-3' });
            const link1 = new TotalDiagramLink({ start: node1, end: node2 });
            const link2 = new TotalDiagramLink({ start: node2, end: node3 });
            link1.destructor = jest.fn();
            link2.destructor = jest.fn();
            manager.add(link1);
            manager.add(link2);
            
            manager.del('*');
            
            expect(manager.list.length).toBe(0);
            expect(link1.destructor).toHaveBeenCalled();
            expect(link2.destructor).toHaveBeenCalled();
        });

        test('should dispatch broadcast:dellinks event when deleting all', () => {
            const eventListener = jest.fn();
            mockRender.container.addEventListener('broadcast:dellinks', eventListener);
            
            manager.del('*');
            
            expect(eventListener).toHaveBeenCalled();
            const event = eventListener.mock.calls[0][0];
            expect(event.detail).toBe('*');
        });

    });

    describe('get()', () => {

        test('should get all links with "*"', () => {
            const node1 = new TotalDiagramNode({ id: 'node-1' });
            const node2 = new TotalDiagramNode({ id: 'node-2' });
            const node3 = new TotalDiagramNode({ id: 'node-3' });
            const link1 = new TotalDiagramLink({ start: node1, end: node2 });
            const link2 = new TotalDiagramLink({ start: node2, end: node3 });
            manager.add(link1);
            manager.add(link2);
            
            const result = manager.get('*');
            
            expect(result).toEqual([link1, link2]);
        });

        test('should get link by id', () => {
            const node1 = new TotalDiagramNode({ id: 'node-1' });
            const node2 = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ 
                id: 'test-link-1', 
                start: node1, 
                end: node2 
            });
            manager.add(link);
            
            const result = manager.get('test-link-1');
            
            expect(result).toBe(link);
        });

        test('should get link between two nodes', () => {
            const node1 = new TotalDiagramNode({ id: 'node-1' });
            const node2 = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ start: node1, end: node2 });
            manager.add(link);
            
            const result = manager.get(node1, node2);
            
            expect(result).toBe(link);
        });

        test('should return null for non-existent link between nodes', () => {
            const node1 = new TotalDiagramNode({ id: 'node-1' });
            const node2 = new TotalDiagramNode({ id: 'node-2' });
            
            const result = manager.get(node1, node2);
            
            expect(result).toBeNull();
        });

        test('should get link by class type', () => {
            class CustomLink extends TotalDiagramLink {}
            const node1 = new TotalDiagramNode({ id: 'node-1' });
            const node2 = new TotalDiagramNode({ id: 'node-2' });
            const node3 = new TotalDiagramNode({ id: 'node-3' });
            const link1 = new TotalDiagramLink({ start: node1, end: node2 });
            const link2 = new CustomLink({ start: node2, end: node3 });
            manager.add(link1);
            manager.add(link2);
            
            const result = manager.get(CustomLink);
            
            expect(result).toEqual([link2]);
        });

        test('should get link by DOM element', () => {
            const node1 = new TotalDiagramNode({ id: 'node-1' });
            const node2 = new TotalDiagramNode({ id: 'node-2' });
            const link = new TotalDiagramLink({ 
                id: 'test-link-1', 
                start: node1, 
                end: node2 
            });
            manager.add(link);
            
            const result = manager.get(link.element);
            
            expect(result).toBe(link);
        });

    });

});
