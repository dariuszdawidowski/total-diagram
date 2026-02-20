describe('Basic Rendering Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/1_basic.html')
    })

    it('should render the diagram container', () => {
        cy.get('#container').should('exist')
        cy.get('#container').should('be.visible')
    })

    it('should create the Total Diagram board element', () => {
        cy.get('#total-diagram-attach').should('exist')
        cy.get('#total-diagram-attach').should('have.css', 'width', '0px')
        cy.get('#total-diagram-attach').should('have.css', 'height', '0px')
    })

    it('should render exactly 2 nodes on the board', () => {
        cy.get('.total-diagram-node.node').should('have.length', 2)
    })

    it('should render exactly 1 link on the board', () => {
        cy.get('.link').should('have.length', 1)
    })

    it('should have nodes with correct CSS classes', () => {
        cy.get('.total-diagram-node').should('exist')
        cy.get('.node').should('exist')
    })

    it('should have link with SVG line element', () => {
        cy.get('.link line').should('exist')
        cy.get('.link line').should('have.attr', 'x1')
        cy.get('.link line').should('have.attr', 'y1')
        cy.get('.link line').should('have.attr', 'x2')
        cy.get('.link line').should('have.attr', 'y2')
    })

    it('should have correct title and description', () => {
        cy.get('h3').should('contain', '1: Basic demo')
        cy.get('p').should('contain', 'How to create two nodes and link them.')
    })
})
