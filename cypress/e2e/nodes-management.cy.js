describe('Nodes Management Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/2_node.html')
    })

    it('should render the advanced node structure', () => {
        cy.get('.total-diagram-node.node').should('have.length', 1)
    })

    it('should render node with titlebar', () => {
        cy.get('.titlebar').should('exist')
        cy.get('.titlebar').should('contain', 'My Node')
    })

    it('should render node with header', () => {
        cy.get('.header').should('exist')
        cy.get('.header').should('contain', 'Category')
    })

    it('should render node with multiple options', () => {
        cy.get('.option').should('have.length', 3)
        cy.get('.option').first().should('contain', 'Option 1')
        cy.get('.option').eq(1).should('contain', 'Option 2')
        cy.get('.option').eq(2).should('contain', 'Option 3')
    })

    it('should have node with correct dimensions', () => {
        cy.get('.total-diagram-node.node').should('have.css', 'width', '200px')
        cy.get('.total-diagram-node.node').should('have.css', 'height', '300px')
    })

    it('should position node correctly on the board', () => {
        cy.get('.total-diagram-node.node').should('have.css', 'position', 'absolute')
    })
})
