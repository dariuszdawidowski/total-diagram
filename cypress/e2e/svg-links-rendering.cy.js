describe('SVG Links Rendering Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/3_link.html')
    })

    it('should render SVG elements for links', () => {
        cy.get('.link').should('exist')
    })

    it('should have SVG with correct namespace', () => {
        cy.get('.link').first().then(($link) => {
            expect($link[0].namespaceURI).to.eq('http://www.w3.org/2000/svg')
        })
    })

    it('should have path elements within SVG', () => {
        cy.get('.link path').should('exist')
    })

    it('should have path with d attribute defining the curve', () => {
        cy.get('.link path').should('have.attr', 'd')
        cy.get('.link path').first().then(($path) => {
            const d = $path.attr('d')
            expect(d).to.not.be.empty
            expect(d).to.match(/^M/)  // SVG path should start with M (moveto)
        })
    })

    it('should have multiple links connecting nodes', () => {
        cy.get('.link').should('have.length.greaterThan', 0)
    })

    it('should have links positioned at top-left corner', () => {
        cy.get('.link').each(($link) => {
            cy.wrap($link).should('have.css', 'left', '0px')
            cy.wrap($link).should('have.css', 'top', '0px')
        })
    })

    it('should have sockets on nodes for connection points', () => {
        cy.get('.socket').should('exist')
        cy.get('.socket').should('have.length.greaterThan', 0)
    })

    it('should have socket with correct styling', () => {
        cy.get('.socket').first()
            .should('have.css', 'position', 'absolute')
            .should('have.css', 'width', '8px')
            .should('have.css', 'height', '8px')
    })

    it('should render curved paths between nodes', () => {
        cy.get('.link path').each(($path) => {
            const d = $path.attr('d')
            // Curved paths contain C (cubic bezier) or Q (quadratic bezier) commands
            expect(d).to.match(/[CQ]/)
        })
    })
})
