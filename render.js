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

        // Board dimensions
        this.size = this.container.getBoundingClientRect();
        this.size.center = {x: this.size.width / 2, y: this.size.height / 2};

        // Board margins
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
    }

    /**
     * Perform pan
     */

    pan(deltaX, deltaY) {
        this.offset.x += deltaX;
        this.offset.y += deltaY;
        this.update();
    }

    /**
     * Perform zoom
     */

    zoom(x, y, deltaZ, factorZ) {
        let deltaZoom = this.offset.z;
        this.offset.z = (this.offset.z - (deltaZ / factorZ) * this.offset.z).clamp(0.1, 3.0);
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
     */

    pinchZoom(x1, y1, x2, y2, deltaZ) {
        let deltaZoom = this.offset.z;
        this.offset.z = (this.offset.z * deltaZ).clamp(0.1, 3.0);
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
     * {x: ..., y: ...}
     */

    screen2World(coords) {
        return {
            x: Math.round( (((coords.x - this.offset.x) / this.offset.z) - this.margin.left) ),
            y: Math.round( (((coords.y - this.offset.y) / this.offset.z) - this.margin.top) ),
        };
    }

    /**
     * Convert world coordinates to window
     * {x: ..., y: ...}
     */

    world2Screen(coords) {
        return {
            x: Math.round( ((this.offset.x + (coords.x * this.offset.z)) - this.margin.left) ),
            y: Math.round( ((this.offset.y + (coords.y * this.offset.z)) - this.margin.top) ),
        };
    }

    /**
     * Reset to origin
     * z: 'none' (don't zoom) | 'reset': standard zoom | 'focus': zoom to node size
     * animation: 'hard' | 'smooth'
     * rect: {width, height: dimensions of the focus target}
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
     * Delete all nodes and links and clear DOM
     */

    clear() {
        this.board.innerHTML = '';
        this.links.del('*');
        this.nodes.del('*');
    }

    /**
     * Render update
     */

    update() {
        // Calculate board's position
        // Note: using 'transform' since PYQt6 doesn't support new css 'translate' and 'scale' yet
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
