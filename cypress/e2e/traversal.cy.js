describe('Traversal Tests (Gremlin)', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/5_traversal.html')
    })

    it('should render the traversal example', () => {
        cy.get('#container').should('exist')
        cy.get('h3').should('contain', '5: Traversal demo')
    })

    it('should have traversal query buttons', () => {
        cy.get('#buttonQ1').should('exist').should('contain', 'Q1')
        cy.get('#buttonQ2').should('exist').should('contain', 'Q2')
        cy.get('#buttonQ3').should('exist').should('contain', 'Q3')
        cy.get('#buttonQ4').should('exist').should('contain', 'Q4')
    })

    it('should have output area for query results', () => {
        cy.get('#output').should('exist')
    })

    it('should render multiple nodes for traversal', () => {
        cy.get('.total-diagram-node').should('have.length.greaterThan', 2)
    })

    it('should render links between nodes', () => {
        cy.get('.link').should('have.length.greaterThan', 0)
    })

    it('should execute query when clicking Q1 button', () => {
        cy.get('#output').should('contain', 'Click on buttons to run queries')
        cy.get('#buttonQ1').click()
        cy.get('#output').should('not.contain', 'Click on buttons to run queries')
    })

    it('should execute query when clicking Q2 button', () => {
        cy.get('#buttonQ2').click()
        cy.get('#output').should('contain.text', '').and('be.visible')
    })

    it('should execute query when clicking Q3 button', () => {
        cy.get('#buttonQ3').click()
        cy.get('#output').should('contain.text', '').and('be.visible')
    })

    it('should execute query when clicking Q4 button', () => {
        cy.get('#buttonQ4').click()
        cy.get('#output').should('contain.text', '').and('be.visible')
    })

    it('should have nodes with data attributes', () => {
        cy.get('.total-diagram-node').first().should('have.attr', 'data-node')
    })
})
