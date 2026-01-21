/**
 * Unit tests for TotalDiagramNodesManager
 */

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: () => 'test-uuid-' + Math.random()
};

// Load the required classes
const TotalDiagramNode = require('../src/render-node.js');
const TotalDiagramNodesManager = require('../src/manager-nodes.js');

describe('TotalDiagramNodesManager', () => {

    let manager;
    let mockRender;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="test-container"></div>';
        
        // Create mock render object
        mockRender = {
            container: document.getElementById('test-container'),
            board: document.createElement('div'),
            links: {
                del: jest.fn()
            }
        };
        document.body.appendChild(mockRender.board);
        
        // Create manager
        manager = new TotalDiagramNodesManager();
        manager.render = mockRender;
    });

    describe('Constructor', () => {

        test('should create manager with empty list', () => {
            const newManager = new TotalDiagramNodesManager();
            
            expect(newManager.list).toEqual([]);
            expect(newManager.render).toBeNull();
        });

    });

    describe('add()', () => {

        test('should add node to list', () => {
            const node = new TotalDiagramNode();
            
            manager.add(node);
            
            expect(manager.list).toContain(node);
        });

        test('should add node to DOM', () => {
            const node = new TotalDiagramNode();
            
            manager.add(node);
            
            expect(mockRender.board.contains(node.element)).toBe(true);
        });

        test('should call node.awake()', () => {
            const node = new TotalDiagramNode();
            node.awake = jest.fn();
            
            manager.add(node);
            
            expect(node.awake).toHaveBeenCalled();
        });

        test('should dispatch broadcast:addnode event', () => {
            const node = new TotalDiagramNode();
            const eventListener = jest.fn();
            mockRender.container.addEventListener('broadcast:addnode', eventListener);
            
            manager.add(node);
            
            expect(eventListener).toHaveBeenCalled();
            const event = eventListener.mock.calls[0][0];
            expect(event.detail).toBe(node);
        });

        test('should add multiple nodes', () => {
            const node1 = new TotalDiagramNode();
            const node2 = new TotalDiagramNode();
            
            manager.add(node1);
            manager.add(node2);
            
            expect(manager.list.length).toBe(2);
            expect(manager.list).toContain(node1);
            expect(manager.list).toContain(node2);
        });

    });

    describe('del()', () => {

        test('should delete node from list', () => {
            const node = new TotalDiagramNode();
            manager.add(node);
            
            manager.del(node);
            
            expect(manager.list).not.toContain(node);
        });

        test('should remove node from DOM', () => {
            const node = new TotalDiagramNode();
            manager.add(node);
            
            manager.del(node);
            
            expect(mockRender.board.contains(node.element)).toBe(false);
        });

        test('should call node.destructor()', () => {
            const node = new TotalDiagramNode();
            node.destructor = jest.fn();
            manager.add(node);
            
            manager.del(node);
            
            expect(node.destructor).toHaveBeenCalled();
        });

        test('should delete associated links', () => {
            const node = new TotalDiagramNode();
            const mockLink1 = { id: 'link-1' };
            const mockLink2 = { id: 'link-2' };
            node.links.add(mockLink1);
            node.links.add(mockLink2);
            manager.add(node);
            
            manager.del(node);
            
            expect(mockRender.links.del).toHaveBeenCalledWith(mockLink1);
            expect(mockRender.links.del).toHaveBeenCalledWith(mockLink2);
        });

        test('should dispatch broadcast:delnode event', () => {
            const node = new TotalDiagramNode();
            const eventListener = jest.fn();
            mockRender.container.addEventListener('broadcast:delnode', eventListener);
            manager.add(node);
            
            manager.del(node);
            
            expect(eventListener).toHaveBeenCalled();
            const event = eventListener.mock.calls[0][0];
            expect(event.detail).toBe(node);
        });

        test('should delete all nodes with "*"', () => {
            const node1 = new TotalDiagramNode();
            const node2 = new TotalDiagramNode();
            node1.destructor = jest.fn();
            node2.destructor = jest.fn();
            manager.add(node1);
            manager.add(node2);
            
            manager.del('*');
            
            expect(manager.list.length).toBe(0);
            expect(node1.destructor).toHaveBeenCalled();
            expect(node2.destructor).toHaveBeenCalled();
        });

        test('should dispatch broadcast:delnodes event when deleting all', () => {
            const eventListener = jest.fn();
            mockRender.container.addEventListener('broadcast:delnodes', eventListener);
            
            manager.del('*');
            
            expect(eventListener).toHaveBeenCalled();
            const event = eventListener.mock.calls[0][0];
            expect(event.detail).toBe('*');
        });

    });

    describe('get()', () => {

        test('should get all nodes with "*"', () => {
            const node1 = new TotalDiagramNode();
            const node2 = new TotalDiagramNode();
            manager.add(node1);
            manager.add(node2);
            
            const result = manager.get('*');
            
            expect(result).toEqual([node1, node2]);
        });

        test('should get node by id', () => {
            const node = new TotalDiagramNode({ id: 'test-node-1' });
            manager.add(node);
            
            const result = manager.get('test-node-1');
            
            expect(result).toBe(node);
        });

        test('should return null for non-existent id', () => {
            const result = manager.get('non-existent');
            
            expect(result).toBeUndefined();
        });

        test('should get node by class type', () => {
            class CustomNode extends TotalDiagramNode {}
            const node1 = new TotalDiagramNode();
            const node2 = new CustomNode();
            manager.add(node1);
            manager.add(node2);
            
            const result = manager.get(CustomNode);
            
            expect(result).toEqual([node2]);
        });

        test('should get node by DOM element', () => {
            const node = new TotalDiagramNode({ id: 'test-node-1' });
            manager.add(node);
            
            const result = manager.get(node.element);
            
            expect(result).toBe(node);
        });

        test('should get node by child DOM element', () => {
            const node = new TotalDiagramNode({ id: 'test-node-1' });
            const childElement = document.createElement('div');
            node.element.appendChild(childElement);
            manager.add(node);
            
            const result = manager.get(childElement);
            
            expect(result).toBe(node);
        });

    });

});
