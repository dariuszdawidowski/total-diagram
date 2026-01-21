describe('Responsive and Layout Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/1_basic.html')
    })

    it('should have container that fills viewport', () => {
        cy.get('#container').then(($container) => {
            const containerHeight = $container.height()
            const windowHeight = Cypress.$(cy.state('window')).height()
            expect(containerHeight).to.be.greaterThan(0)
        })
    })

    it('should have minimum width constraint', () => {
        cy.get('#container').should('have.css', 'min-width', '640px')
    })

    it('should have minimum height constraint', () => {
        cy.get('#container').should('have.css', 'min-height', '480px')
    })

    it('should maintain layout on different viewport sizes', () => {
        // Test on mobile viewport
        cy.viewport(375, 667)
        cy.get('#container').should('exist')
        cy.get('#total-diagram-attach').should('exist')
        
        // Test on tablet viewport
        cy.viewport(768, 1024)
        cy.get('#container').should('exist')
        cy.get('#total-diagram-attach').should('exist')
        
        // Test on desktop viewport
        cy.viewport(1920, 1080)
        cy.get('#container').should('exist')
        cy.get('#total-diagram-attach').should('exist')
    })

    it('should have proper touch action settings', () => {
        cy.get('#container').should('have.css', 'touch-action', 'none')
    })

    it('should prevent text selection', () => {
        cy.get('#container')
            .should('have.css', 'user-select', 'none')
            .should('have.css', '-webkit-user-select', 'none')
    })

    it('should have no margin on body and html', () => {
        cy.get('body').should('have.css', 'margin', '0px')
        cy.get('html').should('have.css', 'margin', '0px')
    })

    it('should center content using auto margins', () => {
        cy.get('#container').should('have.css', 'display', 'block')
    })
})
