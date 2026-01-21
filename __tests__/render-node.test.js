/**
 * Unit tests for TotalDiagramNode
 */

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: () => 'test-uuid-123'
};

// Load the class
const TotalDiagramNode = require('../render-node.js');

describe('TotalDiagramNode', () => {

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '';
    });

    describe('Constructor', () => {

        test('should create node with default values', () => {
            const node = new TotalDiagramNode();
            
            expect(node.id).toBeDefined();
            expect(typeof node.id).toBe('string');
            expect(node.name).toBeNull();
            expect(node.transform.x).toBe(0);
            expect(node.transform.y).toBe(0);
            expect(node.transform.zindex).toBe(0);
            expect(node.element).toBeInstanceOf(HTMLDivElement);
        });

        test('should create node with custom id', () => {
            const node = new TotalDiagramNode({ id: 'custom-id' });
            
            expect(node.id).toBe('custom-id');
            expect(node.element.dataset.id).toBe('custom-id');
        });

        test('should create node with custom name', () => {
            const node = new TotalDiagramNode({ name: 'TestNode' });
            
            expect(node.name).toBe('TestNode');
        });

        test('should create node with custom position', () => {
            const node = new TotalDiagramNode({ x: 100, y: 200 });
            
            expect(node.transform.x).toBe(100);
            expect(node.transform.y).toBe(200);
        });

        test('should create node with custom z-index', () => {
            const node = new TotalDiagramNode({ zindex: 5 });
            
            expect(node.transform.zindex).toBe(5);
            expect(node.element.style.zIndex).toBe('5');
        });

    });

    describe('Transform', () => {

        test('should have default transform properties', () => {
            const node = new TotalDiagramNode();
            
            expect(node.transform.w).toBe(0);
            expect(node.transform.h).toBe(0);
            expect(node.transform.wmin).toBe(64);
            expect(node.transform.hmin).toBe(64);
            expect(node.transform.wmax).toBe(1024);
            expect(node.transform.hmax).toBe(1024);
            expect(node.transform.border).toBe(0);
        });

        test('should clear transform', () => {
            const node = new TotalDiagramNode({ x: 100, y: 200, zindex: 5 });
            
            node.transform.clear();
            
            expect(node.transform.x).toBe(0);
            expect(node.transform.y).toBe(0);
            expect(node.transform.zindex).toBe(0);
        });

    });

    describe('Links', () => {

        test('should have empty links list by default', () => {
            const node = new TotalDiagramNode();
            
            expect(node.links.list).toEqual([]);
        });

        test('should add link', () => {
            const node = new TotalDiagramNode();
            const mockLink = { id: 'link-1' };
            
            node.links.add(mockLink);
            
            expect(node.links.list).toContain(mockLink);
        });

        test('should not add duplicate link', () => {
            const node = new TotalDiagramNode();
            const mockLink = { id: 'link-1' };
            
            node.links.add(mockLink);
            node.links.add(mockLink);
            
            expect(node.links.list.length).toBe(1);
        });

        test('should delete link', () => {
            const node = new TotalDiagramNode();
            const mockLink = { id: 'link-1' };
            
            node.links.add(mockLink);
            node.links.del(mockLink);
            
            expect(node.links.list).not.toContain(mockLink);
        });

        test('should get all links with "*"', () => {
            const node = new TotalDiagramNode({ id: 'node-1' });
            const link1 = { id: 'link-1' };
            const link2 = { id: 'link-2' };
            
            node.links.add(link1);
            node.links.add(link2);
            
            const result = node.links.get('*');
            expect(result).toEqual([link1, link2]);
        });

        test('should get input links', () => {
            const node = new TotalDiagramNode({ id: 'node-1' });
            const inLink = { id: 'link-in', start: { id: 'node-0' }, end: { id: 'node-1' } };
            const outLink = { id: 'link-out', start: { id: 'node-1' }, end: { id: 'node-2' } };
            
            node.links.add(inLink);
            node.links.add(outLink);
            
            const result = node.links.get('in');
            expect(result).toEqual([inLink]);
        });

        test('should get output links', () => {
            const node = new TotalDiagramNode({ id: 'node-1' });
            const inLink = { id: 'link-in', start: { id: 'node-0' }, end: { id: 'node-1' } };
            const outLink = { id: 'link-out', start: { id: 'node-1' }, end: { id: 'node-2' } };
            
            node.links.add(inLink);
            node.links.add(outLink);
            
            const result = node.links.get('out');
            expect(result).toEqual([outLink]);
        });

        test('should get link by id', () => {
            const node = new TotalDiagramNode();
            const mockLink = { id: 'link-1' };
            
            node.links.add(mockLink);
            
            const result = node.links.get('link-1');
            expect(result).toEqual(mockLink);
        });

    });

    describe('Position Methods', () => {

        test('should set position', () => {
            const node = new TotalDiagramNode();
            
            node.setPosition({ x: 150, y: 250 });
            
            expect(node.transform.x).toBe(150);
            expect(node.transform.y).toBe(250);
        });

        test('should get position', () => {
            const node = new TotalDiagramNode({ x: 100, y: 200 });
            
            const position = node.getPosition();
            
            expect(position).toEqual({ x: 100, y: 200 });
        });

        test('should add to position', () => {
            const node = new TotalDiagramNode({ x: 100, y: 200 });
            
            node.addPosition({ x: 50, y: 30 });
            
            expect(node.transform.x).toBe(150);
            expect(node.transform.y).toBe(230);
        });

        test('should subtract from position', () => {
            const node = new TotalDiagramNode({ x: 100, y: 200 });
            
            node.subPosition({ x: 50, y: 30 });
            
            expect(node.transform.x).toBe(50);
            expect(node.transform.y).toBe(170);
        });

    });

    describe('Size Methods', () => {

        test('should set size', () => {
            const node = new TotalDiagramNode();
            document.body.appendChild(node.element);
            
            node.setSize({ width: 200, height: 150 });
            
            expect(node.transform.w).toBe(200);
            expect(node.transform.h).toBe(150);
            expect(node.element.style.width).toBe('200px');
            expect(node.element.style.height).toBe('150px');
        });

        test('should enforce min size constraints', () => {
            const node = new TotalDiagramNode();
            document.body.appendChild(node.element);
            
            node.setSize({ width: 10, height: 20 });
            
            expect(node.transform.w).toBe(64); // default wmin
            expect(node.transform.h).toBe(64); // default hmin
        });

        test('should enforce max size constraints', () => {
            const node = new TotalDiagramNode();
            document.body.appendChild(node.element);
            
            node.setSize({ width: 2000, height: 3000 });
            
            expect(node.transform.w).toBe(1024); // default wmax
            expect(node.transform.h).toBe(1024); // default hmax
        });

        test('should set custom min/max size', () => {
            const node = new TotalDiagramNode();
            document.body.appendChild(node.element);
            
            node.setSize({ 
                minWidth: 100, 
                minHeight: 80,
                maxWidth: 500,
                maxHeight: 400
            });
            
            expect(node.transform.wmin).toBe(100);
            expect(node.transform.hmin).toBe(80);
            expect(node.transform.wmax).toBe(500);
            expect(node.transform.hmax).toBe(400);
        });

        test('should get size', () => {
            const node = new TotalDiagramNode();
            document.body.appendChild(node.element);
            
            node.setSize({ width: 200, height: 150 });
            
            const size = node.getSize();
            expect(size.width).toBe(200);
            expect(size.height).toBe(150);
        });

    });

    describe('Style Methods', () => {

        test('should set style property', () => {
            const node = new TotalDiagramNode();
            
            node.setStyle('backgroundColor', 'red');
            
            expect(node.element.style.backgroundColor).toBe('red');
        });

        test('should get style property', () => {
            const node = new TotalDiagramNode();
            node.element.style.color = 'blue';
            
            const color = node.getStyle('color');
            
            expect(color).toBe('blue');
        });

        test('should get all styles', () => {
            const node = new TotalDiagramNode();
            
            const styles = node.getStyle();
            
            expect(styles).toBe(node.element.style);
        });

    });

    describe('Other Methods', () => {

        test('should set transparency', () => {
            const node = new TotalDiagramNode();
            
            node.transparent(50);
            
            expect(node.element.style.opacity).toBe('0.5');
        });

        test('should remove transparency at 100%', () => {
            const node = new TotalDiagramNode();
            node.element.style.opacity = '0.5';
            
            node.transparent(100);
            
            expect(node.element.style.opacity).toBe('');
        });

        test('should enable animation', () => {
            const node = new TotalDiagramNode();
            
            node.animated(true);
            
            expect(node.element.style.transition).toBe('transform 0.5s ease-in-out');
        });

        test('should disable animation', () => {
            const node = new TotalDiagramNode();
            
            node.animated(false);
            
            expect(node.element.style.transition).toBe('');
        });

        test('should set z-index', () => {
            const node = new TotalDiagramNode();
            
            node.setSortingZ(10);
            
            expect(node.transform.zindex).toBe(10);
            expect(node.element.style.zIndex).toBe('10');
        });

        test('should serialize node', () => {
            const node = new TotalDiagramNode({ 
                id: 'node-1', 
                x: 100, 
                y: 200,
                zindex: 5
            });
            document.body.appendChild(node.element);
            node.setSize({ width: 150, height: 120 });
            
            const serialized = node.serialize();
            
            expect(serialized).toEqual({
                id: 'node-1',
                type: 'TotalDiagramNode',
                x: 100,
                y: 200,
                w: 150,
                h: 120,
                zindex: 5
            });
        });

        test('should update element transform', () => {
            const node = new TotalDiagramNode({ x: 100, y: 200 });
            node.transform.ox = 50;
            node.transform.oy = 60;
            node.transform.border = 2;
            
            node.update();
            
            expect(node.element.style.transform).toBe('translate(48px, 138px)');
        });

    });

});
