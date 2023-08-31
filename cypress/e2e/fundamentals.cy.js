describe('Fundamentals test', () => {
    it('passes', () => {
        // Open website
        cy.visit('http://127.0.0.1:8080/examples/1_basic.html')
        // Two Nodes
        cy.get('.total-diagram-node.node').should('have.length', 2)
        // One links
        cy.get('.link').should('have.length', 1)
    })
})