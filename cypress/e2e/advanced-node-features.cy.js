describe('Advanced Node Features Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/2_node.html')
    })

    it('should render node with custom title', () => {
        cy.get('.total-diagram-node').first().find('.titlebar').should('contain', 'Node #1')
    })

    it('should render node with custom header', () => {
        cy.get('.total-diagram-node').first().find('.header').should('contain', 'Options for node 1:')
    })

    it('should have proper node structure hierarchy', () => {
        cy.get('.total-diagram-node').first()
            .should('exist')
            .within(() => {
                cy.get('.titlebar').should('exist')
                cy.get('.header').should('exist')
                cy.get('.option').should('exist')
            })
    })

    it('should have titlebar with correct styling', () => {
        cy.get('.total-diagram-node').first().find('.titlebar')
            .should('have.css', 'background-color', 'rgb(241, 147, 49)')
            .should('have.css', 'color', 'rgb(255, 255, 255)')
    })

    it('should have header with correct styling', () => {
        cy.get('.total-diagram-node').first().find('.header')
            .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
            .should('have.css', 'color', 'rgb(34, 34, 34)')
    })

    it('should have options with correct styling', () => {
        cy.get('.total-diagram-node').first().find('.option').first()
            .should('have.css', 'background-color', 'rgb(255, 245, 245)')
            .should('have.css', 'color', 'rgb(34, 34, 34)')
    })

    it('should have node with flex display', () => {
        cy.get('.total-diagram-node').should('have.css', 'display', 'flex')
    })

    it('should have node with flex-direction column', () => {
        cy.get('.total-diagram-node').should('have.css', 'flex-direction', 'column')
    })

    it('should have all options rendered in order', () => {
        cy.get('.total-diagram-node').first().within(() => {
            cy.get('.option').should('have.length', 4)
            cy.get('.option').eq(0).should('contain', 'Option 1')
            cy.get('.option').eq(1).should('contain', 'Option 2')
            cy.get('.option').eq(2).should('contain', 'Option 3')
            cy.get('.option').eq(3).should('contain', 'Option 4')
        })
    })
})
