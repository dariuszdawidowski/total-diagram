/***************************************************************************************************
 *                                                                                                 *
 *                            Total Diagram Link                                                   *
 *  \___________________u..   Base class for diagram link                                          *
 *  (  ________________  .-`  MIT License                                                          *
 *   ''                ''     Copyright (c) 2020-2023 Dariusz Dawidowski                           *
 *                                                                                                 *
 **************************************************************************************************/

class TotalDiagramLink {

    /**
     * Constructor
     * @param args.start <TotalDiagramNode>: Start node
     * @param args.end <TotalDiagramNode>: End node
     */

    constructor(args) {

        // ID
        this.id = 'id' in args ? args.id : crypto.randomUUID();

        // Start Node
        this.start = args.start;
        this.start.addLink(this);

        // End Node
        this.end = args.end;
        this.end.addLink(this);

        // SVG DOM element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.element.classList.add('link');

        // Copy ID onto DOM element
        this.element.dataset.id = this.id;

    }

    /**
     * Destructor
     */

    destructor() {
        // Remove references in related nodes
        if (this.start) this.start.delLink(this);
        if (this.end) this.end.delLink(this);
    }

    /**
     * Serialization
     */

    serialize() {
        return {
            'id': this.id,
            'type': this.constructor.name,
            'start': this.start.id,
            'end': this.end.id,
        };
    }

    /**
     * Make link transparent
     */

    transparent(percent) {
        if (percent == 100)
            this.element.style.opacity = null;
        else
            this.element.style.opacity = percent / 100;
    }

    /**
     * Update position
     */

    update() {
        /*** Overload ***/
    }

}
