describe('Fundamentals test', () => {
    it('passes', () => {
        // Open website
        cy.visit('http://127.0.0.1:8080/examples/e2e.html')
        // Core elements available
        cy.get('#container').should('exist')
        cy.get('#total-diagram-attach').should('exist')
        cy.get('#addNodeButton').should('exist')
        cy.get('#delNodeButton').should('exist')
        cy.get('#addLinkButton').should('exist')
        cy.get('#delLinkButton').should('exist')
    })
})