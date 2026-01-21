/***************************************************************************************************
 *        .         .                                                                              *
 *       / \__***__/ \        Gremlin Light (ultra lightweight version)                            *
 *      ( I /     \ I )       Graph travesal query language system                                 *
 *       \_|  O.O  |_/        Syntax inspired by Apache TinkerPop™ Gremlin Query Language          *
 *          \ ___ /           MIT License                                                          *
 *          \_V___/           Copyright (c) 2023 Dariusz Dawidowski                                *
 *                                                                                                 *
 **************************************************************************************************/

/*
    Example:

    const traversal = AnonymousTraversalSource.traversal;
    const g = traversal().withLists(render.nodes.list, render.links.list);
    const allVertices = g.V().toList();
    console.log(allVertices);

*/


// https://github.com/apache/tinkerpop/blob/master/gremlin-javascript/src/main/javascript/gremlin-javascript/lib/process/anonymous-traversal.js

class AnonymousTraversalSource {

	constructor(traversalSourceClass) {
	    this.traversalSourceClass = traversalSourceClass;
	}

    static traversal(traversalSourceClass) {
        return new AnonymousTraversalSource(traversalSourceClass || GraphTraversalSource);
    }

    withLists(vertices, edges) {
    	return new this.traversalSourceClass(vertices, edges);
    }

}


// https://tinkerpop.apache.org/javadocs/current/core/org/apache/tinkerpop/gremlin/process/traversal/dsl/graph/GraphTraversalSource.html

class GraphTraversalSource {

    constructor(vertices, edges) {
    	this.vertices = vertices;
    	this.edges = edges;
    }

	V(query = null) {
		return new GraphTraversal(this.vertices, query);
	}

	E(query = null) {
		return new GraphTraversal(this.edges, query);
	}

}


// https://tinkerpop.apache.org/javadocs/current/full/org/apache/tinkerpop/gremlin/process/traversal/dsl/graph/GraphTraversal.html

class GraphTraversal {

	constructor(list, query = null) {

		// Query result list
		this.result = null;

        // All
        if (query == null) this.result = list;

        // Find one node by giving DOM element
        else if (typeof(query) == 'object') {
            // Traverse DOM
            let target = query;
            while (target.parentNode) {
                if ('classList' in target && target.classList.contains('total-diagram-node')) {
                    // Found
                    this.result = list.find(n => n.id == target.dataset.id);
                }
                target = target.parentNode;
            }
        }

        // Find by giving class type
        else if (typeof(query) == 'function') this.result = list.filter(n => n instanceof query);

		// Find by ID string
        else if (typeof(query) == 'string') this.result = list.find(n => n.id == query);

	}

    hasNext() {
        return (this.result != null && this.result.constructor.name != 'Array');
    }

    next() {
        return this.result;
    }

	toList() {
        if (this.result.constructor.name != 'Array') return [this.result];
        return this.result;
	}

}

// Export for Node.js/Jest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnonymousTraversalSource, GraphTraversalSource, GraphTraversal };
}
