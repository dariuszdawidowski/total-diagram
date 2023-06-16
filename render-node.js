/***************************************************************************************************
 *                                                                                                 *
 *         /\_/\              Total Diagram Node                                                   *
 *        (=^o^=)/\           Base class for diagram node                                          *
 *         (___)__/           MIT License                                                          *
 *     ~~~~~~~~~~~~~~~        Copyright (c) 2020-2023 Dariusz Dawidowski                           *
 *                                                                                                 *
 **************************************************************************************************/

class TotalDiagramNode {

    /**
     * Constructor
     */

    constructor(args = {}) {

        // ID
        this.id = 'id' in args ? args.id : crypto.randomUUID();

        // Human readable name
        this.name = 'name' in args ? args.name : null;

        // Position, origin, dimensions
        this.transform = {
            // Global x position
            x: 'x' in args ? args.x : 0,
            // Global y position
            y: 'y' in args ? args.y : 0,

            // Border size
            border: 0,

            // Z-Sorting
            zindex: 'zindex' in args ? args.zindex : 0,

            // Local center x position
            ox: 0,
            // Local center y position
            oy: 0,

            // Width of boundings
            w: 0,
            // Height of boundings
            h: 0,
            // Min width of boundings
            wmin: 64,
            // Min height of boundings
            hmin: 64,
            // Max width of boundings
            wmax: 1024,
            // Max height of boundings
            hmax: 1024,

            // Identity
            clear: () => {
                this.transform.x = 0;
                this.transform.y = 0;
                this.transform.zindex = 0;
                this.element.style.zIndex = 0;
            }

        };

        // Links
        this.links = {

            list: [], // [TotalDiagramLink, ...]

            // Assign to link
            add: (link) => {
                this.links.list.push(link);
            },

            // Unassign from a link
            del: (link) => {
                const index = this.links.list.indexOf(link);
                if (index !== -1) this.links.list.splice(index, 1);
            },

            // Get assigned link
            get: (id) => {

                // All links
                if (id == '*') return this.links.list;

                // Find one link by ID
                else if (typeof(id) == 'string') {
                    return this.links.list.find(l => l.id == id);
                }

                return null;
            },

            // Update assigned links
            update: () => {
                this.links.list.forEach(link => link.update());
            }

        };

        // Node DOM element
        this.element = document.createElement('div');
        this.element.classList.add('total-diagram-node');
        this.element.style.zIndex = this.transform.zindex;

        // Set or generate ID
        this.element.dataset.id = this.id;

    }

    /**
     * Destructor
     */

    destructor() {
        /* Overload */
    }

    /**
     * Init after node is added into DOM tree
     */

    awake() {
        /* Overload */
    }

    /**
     * Init after all scene is created and updated once
     */

    start() {
        /* Overload */
    }

    /**
     * Size 
     * {width: <Number>, height: <Number>, minWidth: <Number>, minHeight: <Number>, maxWidth: <Number>, maxHeight: <Number>, border: [Number]}
     */

    setSize(size) {
        this.transform.w = size.width;
        this.transform.h = size.height;
        if ('minWidth' in size) this.transform.wmin = size.minWidth;
        if ('minHeight' in size) this.transform.hmin = size.minHeight;
        if ('maxWidth' in size) this.transform.wmax = size.maxWidth;
        if ('maxHeight' in size) this.transform.hmax = size.maxHeight;
        if ('border' in size) this.transform.border = size.border;
        else this.transform.border = parseInt(getComputedStyle(this.element, null).getPropertyValue('border-left-width').replace('px', '')) || 0;
        this.setOrigin();
        this.element.style.width = this.transform.w + 'px';
        this.element.style.height = this.transform.h + 'px';
    }

    getSize() {
        return {
            width: this.transform.w,
            height: this.transform.h,
            minWidth: this.transform.wmin,
            minHeight: this.transform.hmin,
            maxWidth: this.transform.wmax,
            maxHeight: this.transform.hmax
        };
    }

    /**
     * Set origin (local center point of node)
     * Override this to make different origin than middle point
     */

    setOrigin() {
        this.transform.ox = this.transform.w / 2;
        this.transform.oy = this.transform.h / 2;
    }

    /**
     * Set position
     * transform {x: float, y: float}
     */

    setPosition(transform) {
        this.transform.x = transform.x;
        this.transform.y = transform.y;
    }

    /**
     * Get position
     * transform {x: float, y: float}
     */

    getPosition() {
        return {x: this.transform.x, y: this.transform.y};
    }

    /**
     * Change position
     * transform {x: float, y: float}
     */

    addPosition(transform) {
        this.transform.x += transform.x;
        this.transform.y += transform.y;
    }

    /**
     * Change position
     * transform {x: float, y: float}
     */

    subPosition(transform) {
        this.transform.x -= transform.x;
        this.transform.y -= transform.y;
    }

    /**
     * Add link
     * link: TotalDiagramLink object
     */

    addLink(link) {
        this.links.add(link);
    }

    /**
     * Delete link
     * link: TotalDiagramLink object
     */

    delLink(link) {
        this.links.del(link);
    }

    /**
     * Style
     */

    setStyle(key, value = null) {
        if (value !== null) this.element.style[key] = value;
    }

    getStyle(key = null) {
        if (key !== null) return this.element.style[key];
        else return this.element.style;
    }

    /**
     * Make node transparent
     */

    transparent(percent) {
        if (percent == 100)
            this.element.style.opacity = null;
        else
            this.element.style.opacity = percent / 100;
    }

    /**
     * Enable/disable smooth css animation
     */

    animated(state = true) {
        this.element.style.transition = state ? 'transform 0.5s ease-in-out' : null;
    }

    /**
     * Serialization
     */

    serialize() {
        return {
            id: this.id,
            type: this.constructor.name,
            x: this.transform.x,
            y: this.transform.y,
            w: this.transform.w,
            h: this.transform.h,
            zindex: this.transform.zindex
        };
    }

    /**
     * Set z-index
     */

    setSortingZ(zindex) {
        this.transform.zindex = zindex;
        this.element.style.zIndex = zindex;
    }

    /**
     * Update (everyframe when something is changed e.g. move)
     */

    update() {
        // Calculate position (PYQt6 doesn't support separate css translate yet)
        this.element.style.transform = `translate(${this.transform.x - this.transform.ox}px, ${this.transform.y - this.transform.oy}px)`;
    }

}
