/***************************************************************************************************
 *                                                                                                 *
 *       ___     ___          Total Diagram Links Manager                                          *
 *      (o,o)   (-,-)         Create, delete and find links between nodes on the board.            *
 *     /)''')   ('''(\        MIT License                                                          *
 *  -----m-m-----m-m-----     Copyright (c) 2020-2023 Dariusz Dawidowski                           *
 *                                                                                                 *
 **************************************************************************************************/

class TotalDiagramLinksManager {

    /**
     * Constructor
     */

    constructor() {

        // Main manager reference
        this.render = null;

        // Array for all links
        this.list = [];

    }

    /**
     * Add a link between two nodes
     * @param link <TotalDiagramLink>: Link object
     */

    add(link) {

        // Check if nodes exists
        if (!link.start || !link.end) return null;

        // Store link
        this.list.push(link);

        // Add to DOM
        this.render.board.append(link.element);

    }

    /**
     * Del link from board
     * @param link <TotalDiagramLink>: Link object
     */

    del(link) {

        if (link != '*') {
            // Local link's destructor
            link.destructor();

            // Remove from DOM
            link.element.remove()

            // Remove from list
            const index = this.list.indexOf(link);
            if (index !== -1) this.list.splice(index, 1);
        }

        // Remove all links
        else {
            this.list.length = 0;
        }

    }

    /**
     * Get link(s)
     */

    get(link, node2 = null) {

        // All links
        if (link == '*') return this.list;

        // Find link betwen two nodes
        else if (node2) {
            for (const link1 of link.links.get('*')) {
                for (const link2 of node2.links.get('*')) {
                    if (link1.id == link2.id) return link1;
                }
            }
            return null;
        }

        // Find one link by giving ID
        else if (typeof(link) == 'string') return this.list.find(n => n.element.dataset.id == link);

        // Find all links type by giving class
        else if (typeof(link) == 'function') return this.list.filter(l => l instanceof link);

        // Find one link by giving DOM element
        else if (typeof(link) == 'object' && 'dataset' in link) return this.get(link.dataset.id);

        // Not found
        return null;

    }

}
