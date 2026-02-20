/***************************************************************************************************
 *                                                                                                 *
 *            ,;   )          Total Diagram Render HTML5                                           *
 *       _o_ _;   (           One manager to rule them all                                         *
 *    (c(   )/   ____         MIT License                                                          *
 *      |___|    \__/)        Copyright (c) 2020-2025 Dariusz Dawidowski                           *
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
        this.size.center = {x: this.size.width / 2, y: this.size.height / 2};

        // Board current pan offset (x,y), zoom (z) and last delta movement (delta.x delta.y)
        this.transform = {
            x: 0,
            y: 0,
            z: 1,
            delta: {
                x: 0,
                y: 0,
                length: function() {
                     return Math.sqrt(this.x ** 2 + this.y ** 2);
                }
            },
            timestamp: 0,
            speed: 0, // avg px/s
            add: function(deltaX, deltaY) {
                this.delta.x = deltaX;
                this.delta.y = deltaY;
                this.x += deltaX;
                this.y += deltaY;
                this.calcSpeed();
            },
            calcSpeed: function(maxSpeed = 4000) {
                const currentTime = Date.now();
                if (this.timestamp == 0) this.timestamp = currentTime;
                const deltaTime = currentTime - this.timestamp;
                this.timestamp = currentTime;
                this.speed = (this.speed + Math.min(maxSpeed, this.delta.length() / (deltaTime / 1000))) / 2;
            }
        };

        // Damp animation state (prevents stacking multiple RAF loops)
        this.dampState = {
            running: false,
            frameId: null
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

    }

    /**
     * Perform pan
     * @param deltaX: change x
     * @param deltaY: change y
     */

    pan(deltaX, deltaY) {
        this.transform.add(deltaX, deltaY);
        this.update();
    }

    /**
     * Perform pan damping
     */

    damp(factor = 0.97, minSpeed = 300) {

        this.transform.calcSpeed();

        if (this.transform.speed <= minSpeed || this.dampState.running) {
            return;
        }

        this.dampState.running = true;

        const dampAnimation = () => {
            this.transform.delta.x *= factor;
            this.transform.delta.y *= factor;
            this.transform.x += this.transform.delta.x / window.devicePixelRatio;
            this.transform.y += this.transform.delta.y / window.devicePixelRatio;
            this.update();

            if (Math.abs(this.transform.delta.x) > 0.1 || Math.abs(this.transform.delta.y) > 0.1) {
                this.dampState.frameId = requestAnimationFrame(dampAnimation);
            }
            else {
                this.dampState.running = false;
                this.dampState.frameId = null;
            }
        };

        this.dampState.frameId = requestAnimationFrame(dampAnimation);
    }

    /**
     * Perform zoom
     * @param x: x position
     * @param y: y position
     * @param deltaZ: zoom change
     * @param factorZ: multplier
     */

    zoom(x, y, deltaZ, factorZ) {

        this.transform.delta.x = 0;
        this.transform.delta.y = 0;

        let deltaZoom = this.transform.z;
        this.transform.z = Math.max(0.1, Math.min(3.0, this.transform.z - (deltaZ / factorZ) * this.transform.z));
        deltaZoom = this.transform.z / deltaZoom;

        const boundingRect = this.board.getBoundingClientRect();
        const ox = boundingRect.width / 2 + boundingRect.left - x;
        const oy = boundingRect.height / 2 + boundingRect.top - y;

        this.transform.x += ox * deltaZoom - ox;
        this.transform.y += oy * deltaZoom - oy;
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
        let deltaZoom = this.transform.z;
        this.transform.z = Math.max(0.1,Math.min(3.0, this.transform.z * deltaZ));
        deltaZoom = this.transform.z / deltaZoom;

        const boundingRect = this.board.getBoundingClientRect();
        const ox = boundingRect.width / 2 + boundingRect.left - ((x1 + x2) / 2);
        const oy = boundingRect.height / 2 + boundingRect.top - ((y1 + y2) / 2);

        this.transform.x += ox * deltaZoom - ox;
        this.transform.y += oy * deltaZoom - oy;
        this.update();
    }

    /**
     * Convert window coordinates to world
     * @param coords {x: <Number>, y: <Number>}
     */

    screen2World(coords) {
        return {
            x: Math.round( (coords.x - this.transform.x) / this.transform.z ),
            y: Math.round( (coords.y - this.transform.y) / this.transform.z ),
        };
    }

    /**
     * Convert world coordinates to window
     * @param coords {x: <Number>, y: <Number>}
     */

    world2Screen(coords) {
        return {
            x: Math.round( this.transform.x + (coords.x * this.transform.z) ),
            y: Math.round( this.transform.y + (coords.y * this.transform.z) ),
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
            setTimeout(() => { this.board.style.removeProperty('transition'); }, 1000);
        }

        // Zoom
        if (z == 'reset') this.transform.z = 1;
        else if (z == 'focus') this.transform.z = ((this.size.height) / (rect.height + rect.margin));

        // Render
        this.transform.x = (-coords.x * this.transform.z) + this.size.center.x;
        this.transform.y = (-coords.y * this.transform.z) + this.size.center.y;
        this.update();
    }

    /**
     * Reset zoom
     */

    centerZoom() {
        this.transform.z = 1;
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
        this.transform.z = bbox.isZero() ? 1 : Math.min(Math.max(scale.avg(), 0.3), 1.0);
        this.transform.x = (-bbox.x * this.transform.z) + this.size.center.x;
        this.transform.y = (-bbox.y * this.transform.z) + this.size.center.y;
        this.update();
    }

    /**
     * Calculate bound box
     * nodes: all given nodes
     */

    getBounds(nodes) {
        const bbox = {
            left: Infinity,    // -x world coords
            right: -Infinity,  // +x world coords
            top: Infinity,     // -y world coords
            bottom: -Infinity, // +y world coords
            x: 0,              // center x (world coords)
            y: 0,              // center y (world coords)
            width: 0,          // size x
            height: 0,         // size y
            isZero: function() {
                return Math.abs(this.width) < Number.EPSILON || Math.abs(this.height) < Number.EPSILON;
            }
        };
        
        if (nodes && nodes.length) {
            nodes.forEach(node => {
                if (node.transform) {
                    bbox.left = Math.min(node.transform.x - (node.transform.w / 2), bbox.left);
                    bbox.top = Math.min(node.transform.y - (node.transform.h / 2), bbox.top);
                    bbox.right = Math.max(node.transform.x + (node.transform.w / 2), bbox.right);
                    bbox.bottom = Math.max(node.transform.y + (node.transform.h / 2), bbox.bottom);
                }
            });
        }
        // No nodes
        else {
            bbox.left = 0;
            bbox.right = 0;
            bbox.top = 0;
            bbox.bottom = 0;
        }
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
        this.board.style.transform = `translate(${this.transform.x}px, ${this.transform.y}px) scale(${this.transform.z})`;
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

// Export for Node.js/Jest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TotalDiagramRenderHTML5;
}
