/***************************************************************************************************
 *                                                                                                 *
 *         /\_/\              Total Diagram Node                                                   *
 *        (=^o^=)/\           Base class for diagram node                                          *
 *         (___)__/           MIT License                                                          *
 *     ~~~~~~~~~~~~~~~        Copyright (c) 2020-2024 Dariusz Dawidowski                           *
 *                                                                                                 *
 **************************************************************************************************/

class TotalDiagramNode {

    /**
     * Constructor
     * @param id: string - unique identifier
     * @param name: string - name for the node type
     * @param x: float - x position in world coordinates
     * @param y: float - y position in world coordinates
     * @param zindex: int - sorting index
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

            // List of links [TotalDiagramLink, ...]
            list: [],

            // Assign to link
            add: (link) => {
                // Maybe already added during blossoming
                const index = this.links.list.indexOf(link);
                if (index === -1) this.links.list.push(link);
            },

            // Unassign from a link
            del: (link) => {
                const index = this.links.list.indexOf(link);
                if (index !== -1) this.links.list.splice(index, 1);
            },

            // Get connected link(s)
            get: (id) => {

                // All links
                if (id == '*') return this.links.list;

                // Input links
                else if (id == 'in') return this.links.list.filter(l => l.end.id == this.id);

                // Output links
                else if (id == 'out') return this.links.list.filter(l => l.start.id == this.id);

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
     * @param size.width: <Number>
     * @param size.height: <Number>
     * @param size.minWidth: <Number>
     * @param size.minHeight: <Number>
     * @param size.maxWidth: <Number>
     * @param size.maxHeight: <Number>
     * @param size.border: [Number]
     */

    setSize(size) {
        if ('width' in size) this.transform.w = size.width;
        if ('height' in size) this.transform.h = size.height;
        if ('minWidth' in size) this.transform.wmin = size.minWidth;
        if ('minHeight' in size) this.transform.hmin = size.minHeight;
        if ('maxWidth' in size) this.transform.wmax = size.maxWidth;
        if ('maxHeight' in size) this.transform.hmax = size.maxHeight;
        if ('width' in size) {
            if (this.transform.w < this.transform.wmin) this.transform.w = this.transform.wmin;
            if (this.transform.w > this.transform.wmax) this.transform.w = this.transform.wmax;
        }
        if ('height' in size) {
            if (this.transform.h < this.transform.hmin) this.transform.h = this.transform.hmin;
            if (this.transform.h > this.transform.hmax) this.transform.h = this.transform.hmax;
        }
        if ('border' in size) {
            this.transform.border = size.border;
        }
        else {
            this.transform.border = parseInt(getComputedStyle(this.element, null).getPropertyValue('border-left-width').replace('px', '')) || 0;
        }
        if ('width' in size && 'height' in size) this.setOrigin();
        if ('width' in size) this.element.style.width = this.transform.w + 'px';
        if ('height' in size) this.element.style.height = this.transform.h + 'px';
    }

    getSize() {
        return {
            width: this.transform.w,
            height: this.transform.h,
            minWidth: this.transform.wmin,
            minHeight: this.transform.hmin,
            maxWidth: this.transform.wmax,
            maxHeight: this.transform.hmax,
            border: this.transform.border
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
     * @param transform {x: float, y: float}
     */

    setPosition(transform) {
        this.transform.x = transform.x;
        this.transform.y = transform.y;
    }

    /**
     * Get position
     * @param transform {x: float, y: float}
     */

    getPosition() {
        return {x: this.transform.x, y: this.transform.y};
    }

    /**
     * Change position
     * @param transform {x: float, y: float}
     */

    addPosition(transform) {
        this.transform.x += transform.x;
        this.transform.y += transform.y;
    }

    /**
     * Change position
     * @param transform {x: float, y: float}
     */

    subPosition(transform) {
        this.transform.x -= transform.x;
        this.transform.y -= transform.y;
    }

    /**
     * Set CSS style
     * @param key: string - name of the property
     * @param value: any
     */

    setStyle(key, value = null) {
        if (value !== null) this.element.style[key] = value;
    }

    /**
     * Get CSS style
     * @param key: string - name of the property or none for list of all
     */

    getStyle(key = null) {
        if (key !== null) return this.element.style[key];
        else return this.element.style;
    }

    /**
     * Make node transparent
     * @param percent: float - opacity
     */

    transparent(percent) {
        if (percent == 100)
            this.element.style.opacity = null;
        else
            this.element.style.opacity = percent / 100;
    }

    /**
     * Enable/disable smooth css animation
     * @param state: bool - true for animated, false for none
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
     * @param zindex: int - ser sorting index
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
        this.element.style.transform = `translate(${this.transform.x - this.transform.ox - this.transform.border}px, ${this.transform.y - this.transform.oy - this.transform.border}px)`;
    }

}
