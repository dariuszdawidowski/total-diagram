/***************************************************************************************************
 *                                                                                                 *
 *            ,;   )          Total Diagram Render HTML5                                           *
 *       _o_ _;   (           One manager to rule them all                                         *
 *    (c(   )/   ____         MIT License                                                          *
 *      |___|    \__/)        Copyright (c) 2020-2023 Dariusz Dawidowski                           *
 *                                                                                                 *
 **************************************************************************************************/

class TotalDiagramRenderHTML5 {

    /**
     * Constructor
     * @param args.container <HTMLElement>: DOM container for rendering
     * @param args.nodes <TotalDiagramNodesManager>: Nodes manager
     * @param args.links <TotalDiagramLinksManager>: Links manager
     */

    constructor(args) {

        // Container
        this.container = args.container;

        // Create 0x0 main object to attach nodes/links to follow transforms
        this.board = document.createElement('div');
        this.board.id = 'total-diagram-attach';
        this.board.style.transformOrigin = '0px 0px';
        this.board.style.width = 0;
        this.board.style.height = 0;
        this.board.style.overflow = 'visible';
        this.container.appendChild(this.board);

        // Render area window dimensions
        this.size = this.container.getBoundingClientRect();
        console.log('this.size', this.size);
        this.size.center = {x: this.size.width / 2, y: this.size.height / 2};

        // Render area window margins
        this.margin = {
            left: this.size.left - document.documentElement.scrollLeft,
            top: this.size.top - document.documentElement.scrollTop,
        };

        // Board current pan offset (x,y) and zoom (z)
        this.offset = {
            x: 0,
            y: 0,
            z: 1
        };
        
        // Window resize callback
        window.addEventListener('resize', () => {
            this.size = this.container.getBoundingClientRect();
            this.size.center = {x: this.size.width / 2, y: this.size.height / 2};
        });

        // Nodes
        this.nodes = args.nodes;
        this.nodes.render = this;

        // Link
        this.links = args.links;
        this.links.render = this;

        // Gremlin
        const traversal = AnonymousTraversalSource.traversal;
        this.g = traversal().withLists(this.nodes.list, this.links.list);

    }

    /**
     * Perform pan
     * @param deltaX: change x
     * @param deltaY: change y
     */

    pan(deltaX, deltaY) {
        this.offset.x += deltaX;
        this.offset.y += deltaY;
        this.update();
    }

    /**
     * Perform zoom
     * @param x: x position
     * @param y: y position
     * @param deltaZ: zoom change
     * @param factorZ: multplier
     */

    zoom(x, y, deltaZ, factorZ) {
        let deltaZoom = this.offset.z;
        this.offset.z = Math.max(0.1, Math.min(3.0, this.offset.z - (deltaZ / factorZ) * this.offset.z));
        deltaZoom = this.offset.z / deltaZoom;

        const boundingRect = this.board.getBoundingClientRect();
        const ox = boundingRect.width / 2 + boundingRect.left - x;
        const oy = boundingRect.height / 2 + boundingRect.top - y;

        this.offset.x += ox * deltaZoom - ox;
        this.offset.y += oy * deltaZoom - oy;
        this.update();
    }

    /**
     * Perform mobile zoom
     * @param x1: finger 1 x position
     * @param y1: finger 1 y position
     * @param x2: finger 2 x position
     * @param y2: finger 2 y position
     * @param deltaZ: zoom change
     */

    pinchZoom(x1, y1, x2, y2, deltaZ) {
        let deltaZoom = this.offset.z;
        this.offset.z = Math.max(0.1,Math.min(3.0, this.offset.z * deltaZ));
        deltaZoom = this.offset.z / deltaZoom;

        const boundingRect = this.board.getBoundingClientRect();
        const ox = boundingRect.width / 2 + boundingRect.left - ((x1 + x2) / 2);
        const oy = boundingRect.height / 2 + boundingRect.top - ((y1 + y2) / 2);

        this.offset.x += ox * deltaZoom - ox;
        this.offset.y += oy * deltaZoom - oy;
        this.update();
    }

    /**
     * Convert window coordinates to world
     * @param coords {x: <Number>, y: <Number>}
     */

    screen2World(coords) {
        return {
            x: Math.round( (((coords.x - this.offset.x) / this.offset.z) - this.margin.left) ),
            y: Math.round( (((coords.y - this.offset.y) / this.offset.z) - this.margin.top) ),
        };
    }

    /**
     * Convert world coordinates to window
     * @param coords {x: <Number>, y: <Number>}
     */

    world2Screen(coords) {
        return {
            x: Math.round( ((this.offset.x + (coords.x * this.offset.z)) - this.margin.left) ),
            y: Math.round( ((this.offset.y + (coords.y * this.offset.z)) - this.margin.top) ),
        };
    }

    /**
     * Reset to origin
     * @param z: 'none' (don't zoom) | 'reset': standard zoom | 'focus': zoom to node size
     * @param animation: 'hard' | 'smooth'
     * @param rect: {width, height: dimensions of the focus target}
     */

    center(coords = {x: 0, y: 0}, z = 'none', animation = 'hard', rect = null) {

        // Animation
        if (animation == 'smooth') {
            this.board.style.transition = 'transform 1s';
            setInterval(() => { this.board.style.removeProperty('transition'); }, 1000);
        }

        // Zoom
        if (z == 'reset') this.offset.z = 1;
        else if (z == 'focus') this.offset.z = ((this.size.height) / (rect.height + rect.margin));

        // Render
        this.offset.x = (-coords.x * this.offset.z) + this.size.center.x;
        this.offset.y = (-coords.y * this.offset.z) + this.size.center.y;
        this.update();
    }

    /**
     * Reset zoom
     */

    centerZoom() {
        this.offset.z = 1;
        this.update();
    }

    /**
     * Focus on content
     */

    focusBounds() {
        const bbox = this.getBounds(this.nodes.get('*').filter(node => node.parent == this.nodes.parent));
        const scale = {
            x: this.size.width / bbox.width,
            y: this.size.height / bbox.height,
            avg: function() {
                return (this.x + this.y) / 2;
            }
        };
        this.offset.z = bbox.isZero() ? 1 : Math.min(Math.max(scale.avg(), 0.3), 1.0);
        this.offset.x = (-bbox.x * this.offset.z) + this.size.center.x;
        this.offset.y = (-bbox.y * this.offset.z) + this.size.center.y;
        this.update();
    }

    /**
     * Calculate bound box
     * nodes: all given nodes
     */

    getBounds(nodes) {
        const bbox = {
            left: Infinity,   // -x world coords
            right: -Infinity,  // +x world coords
            top: Infinity,    // -y world coords
            bottom: -Infinity, // +y world coords
            x: 0,      // center x (world coords)
            y: 0,      // center y (world coords)
            width: 0,  // size x
            height: 0, // size y
            isZero: function() {
                for (let key in this) {
                    if (key !== 'isZero' && Math.abs(this[key]) > Number.EPSILON) return false;
                }
                return true;
            }
        };
        nodes.forEach(node => {
            bbox.left = Math.min(node.transform.x - (node.transform.w / 2), bbox.left);
            bbox.top = Math.min(node.transform.y - (node.transform.h / 2), bbox.top);
            bbox.right = Math.max(node.transform.x + (node.transform.w / 2), bbox.right);
            bbox.bottom = Math.max(node.transform.y + (node.transform.h / 2), bbox.bottom);
        });
        bbox.width = bbox.right - bbox.left;
        bbox.height = bbox.bottom - bbox.top;
        bbox.x = bbox.left + (bbox.width / 2);
        bbox.y = bbox.top + (bbox.height / 2);
        return bbox;
    }

    /**
     * Delete all nodes and links and clear DOM
     */

    clear() {
        this.board.innerHTML = '';
        this.links.del('*');
        this.nodes.del('*');
    }

    /**
     * Render update
     * Note: use 'transform' since PYQt6 doesn't support separate 'translate' and 'scale' yet
     */

    update() {
        // Calculate board's position
        this.board.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.offset.z})`;
    }

    /**
     * Hack to force redraw window
     */

    redraw() {
        this.container.style.display = 'none';
        const trick = this.container.offsetHeight;
        this.container.style.display = 'block';
    }

}
