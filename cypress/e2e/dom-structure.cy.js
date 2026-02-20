describe('DOM Structure and Styling Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/1_basic.html')
    })

    it('should have proper HTML5 doctype', () => {
        cy.document().should('have.property', 'doctype')
    })

    it('should have correct page title', () => {
        cy.title().should('eq', 'Total Diagram Demo')
    })

    it('should have correct meta viewport settings', () => {
        cy.get('meta[name="viewport"]')
            .should('have.attr', 'content')
            .and('include', 'width=device-width')
    })

    it('should have cache control meta tags', () => {
        cy.get('meta[http-equiv="Cache-Control"]').should('exist')
        cy.get('meta[http-equiv="Pragma"]').should('exist')
        cy.get('meta[http-equiv="Expires"]').should('exist')
    })

    it('should load all required JavaScript files', () => {
        cy.get('script[src$="/src/render-node.js"]').should('exist')
        cy.get('script[src$="/src/render-link.js"]').should('exist')
        cy.get('script[src$="/src/manager-nodes.js"]').should('exist')
        cy.get('script[src$="/src/manager-links.js"]').should('exist')
        cy.get('script[src$="/src/render.js"]').should('exist')
    })

    it('should have container with full width and height', () => {
        cy.get('#container').should('have.css', 'width')
        cy.get('#container').should('have.css', 'height')
    })

    it('should have nodes with absolute positioning', () => {
        cy.get('.total-diagram-node').each(($node) => {
            cy.wrap($node).should('have.css', 'position', 'absolute')
        })
    })

    it('should have board with transform origin at 0,0', () => {
        cy.get('#total-diagram-attach')
            .should('have.css', 'transform-origin', '0px 0px')
    })

    it('should have board with overflow visible', () => {
        cy.get('#total-diagram-attach')
            .should('have.css', 'overflow', 'visible')
    })

    it('should have links with z-index lower than nodes', () => {
        cy.get('.link').should('have.css', 'z-index', '-1')
    })
})
