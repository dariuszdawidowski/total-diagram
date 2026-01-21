// JSON format for a diagram

/*

Example:
{
    "format": "TotalJSON",
    "mimetype": "text/total+json",
    "version": 1,
    "id": "<board unique id>",
    "name": "<board name>",
    "nodes": [
        {
            "id": "<node unique id>",
            "type": "<node class name>",
            "transform": {
                "x": 100,
                "y": 200,
                "z": 0,
                "w": 300,
                "h": 400
            },
            "params": {
                "name": "Hello world"
            },
            "links": [
                "<other node unique id>"
            ]
        },
        ...
    ]
}

*/

class TotalJSON {

    /**
     * Convert node objects to json object (not string)
     */

    serialize(nodes) {
        const json = {
            'format': 'TotalJSON',
            'mimetype': 'text/total+json',
            'version': 1,
            'id': metaviz.editor.id,
            'name': metaviz.editor.name,
            'nodes': nodes.map(node => {
                const params = {...node.params};
                if (params.hasOwnProperty('set')) delete params['set'];
                if (params.hasOwnProperty('get')) delete params['get'];
                return {
                    id: node.id,
                    type: node.constructor.name,
                    transform: {
                        x: node.transform.x,
                        y: node.transform.y,
                        z: node.transform.zindex,
                        w: node.transform.w,
                        h: node.transform.h,
                    },
                    params,
                    links: node.links.get('out').map(link => link.end.id)
                };
            }),
        };
        return json;
    }

}

// Export for Node.js/Jest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TotalJSON;
}
