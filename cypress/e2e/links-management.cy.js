describe('Links Management Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/3_link.html')
    })

    it('should render multiple nodes', () => {
        cy.get('.total-diagram-node.node').should('have.length.greaterThan', 1)
    })

    it('should render curved path links', () => {
        cy.get('.link').should('exist')
        cy.get('.link svg').should('exist')
    })

    it('should have SVG path elements in links', () => {
        cy.get('.link path').should('exist')
        cy.get('.link path').should('have.attr', 'd')
    })

    it('should have links with correct stroke styling', () => {
        cy.get('.link path').should('have.css', 'stroke', 'rgb(232, 143, 86)')
        cy.get('.link path').should('have.css', 'stroke-width', '2px')
        cy.get('.link path').should('have.css', 'fill', 'none')
    })

    it('should position links absolutely', () => {
        cy.get('.link').should('have.css', 'position', 'absolute')
        cy.get('.link').should('have.css', 'left', '0px')
        cy.get('.link').should('have.css', 'top', '0px')
    })

    it('should have links with lower z-index than nodes', () => {
        cy.get('.link').should('have.css', 'z-index', '-1')
    })

    it('should render sockets on nodes', () => {
        cy.get('.socket').should('exist')
    })
})
