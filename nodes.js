/***************************************************************************************************
 *                                                                                                 *
 *          ____(__)          Total Diagram Nodes Manager                                          *
 *         /|    oo           Create, delete and find nodes on the board.                          *
 *        * | _ (..)-*        MIT License                                                          *
 *   v      || ||      v      Copyright (c) 2020-2023 Dariusz Dawidowski                           *
 *   '' '   ^^ ^^     ' ''                                                                         *
 **************************************************************************************************/

class TotalDiagramNodesManager {

    /**
     * Constructor
     */

    constructor() {

        // Main anchor to attach to
        this.board = null;

        // Array for all nodes
        this.list = [];

    }

    /**
     * Add node to scene
     * @param node <TotalDiagramNode>: Node object
     */

    add(node) {

        // Add to list
        this.list.push(node);

        // Add to DOM
        this.board.append(node.element);

        // Call node awake function sice it's added into DOM tree
        node.awake();

    }

    /**
     * Del object from scene
     */

    del(node) {

        // Single node
        if (node != '*') {

            // Delete related links
            let linksToDelete = node.links.get();
            while (linksToDelete.length) {
                const link = linksToDelete.pop();
                this.links.del(link);
            }

            // Local node's destructor
            node.destructor();

            // Remove from DOM
            node.element.remove();

            // Remove from list
            const index = this.list.indexOf(node);
            if (index !== -1) this.list.splice(index, 1);
        }

        // Clear all on the list
        else if (node == '*') {
            this.list.length = 0;
        }

    }

    /**
     * Get nodes from scene
     */

    get(node = 0) {

        // Find one node by giving DOM element
        if (node != null && typeof(node) == 'object') {
            // Traverse DOM
            let target = node;
            while (target.parentNode) {
                if ('classList' in target && target.classList.contains('total-diagram-node')) {
                    // Found node
                    return this.get(target.dataset.id);
                }
                target = target.parentNode;
            }
        }

        // All nodes
        else if (node === 0) return this.list;

        // Find all nodes type by giving class
        else if (typeof(node) == 'function') return this.list.filter(n => n instanceof node);

        // Find one node by giving ID
        else if (typeof(node) == 'string') return this.list.find(n => n.id == node);

        // Not found
        return null;

    }

}
