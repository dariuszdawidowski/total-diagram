describe('Advanced Node Features Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/2_node.html')
    })

    it('should render node with custom title', () => {
        cy.get('.titlebar').should('contain', 'My Node')
    })

    it('should render node with custom header', () => {
        cy.get('.header').should('contain', 'Category')
    })

    it('should have proper node structure hierarchy', () => {
        cy.get('.total-diagram-node')
            .should('exist')
            .within(() => {
                cy.get('.titlebar').should('exist')
                cy.get('.header').should('exist')
                cy.get('.option').should('exist')
            })
    })

    it('should have titlebar with correct styling', () => {
        cy.get('.titlebar')
            .should('have.css', 'background-color', 'rgb(75, 35, 62)')
            .should('have.css', 'color', 'rgb(255, 255, 255)')
    })

    it('should have header with correct styling', () => {
        cy.get('.header')
            .should('have.css', 'background-color', 'rgb(115, 53, 95)')
            .should('have.css', 'color', 'rgb(255, 255, 255)')
    })

    it('should have options with correct styling', () => {
        cy.get('.option')
            .should('have.css', 'background-color', 'rgb(232, 143, 86)')
            .should('have.css', 'color', 'rgb(0, 0, 0)')
    })

    it('should have node with flex display', () => {
        cy.get('.total-diagram-node').should('have.css', 'display', 'flex')
    })

    it('should have node with flex-direction column', () => {
        cy.get('.total-diagram-node').should('have.css', 'flex-direction', 'column')
    })

    it('should have all options rendered in order', () => {
        cy.get('.option').should('have.length', 3)
        cy.get('.option').eq(0).should('contain', 'Option 1')
        cy.get('.option').eq(1).should('contain', 'Option 2')
        cy.get('.option').eq(2).should('contain', 'Option 3')
    })
})
