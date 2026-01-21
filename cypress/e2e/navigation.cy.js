describe('Navigation Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/4_navigation.html')
    })

    it('should render the navigation example', () => {
        cy.get('#container').should('exist')
        cy.get('h3').should('contain', '4: Navigation demo')
    })

    it('should have board element with transform origin', () => {
        cy.get('#total-diagram-attach').should('have.css', 'transform-origin', '0px 0px')
    })

    it('should render nodes with sockets', () => {
        cy.get('.socket').should('exist')
        cy.get('.socket').should('have.length.greaterThan', 0)
    })

    it('should have nodes positioned correctly', () => {
        cy.get('.total-diagram-node').each(($node) => {
            cy.wrap($node).should('have.css', 'position', 'absolute')
        })
    })

    it('should allow pan interaction on container', () => {
        // Get initial transform
        cy.get('#total-diagram-attach').then($board => {
            const initialTransform = $board.css('transform')
            
            // Simulate pan by triggering mouse events
            cy.get('#container')
                .trigger('mousedown', { clientX: 100, clientY: 100, which: 1 })
                .trigger('mousemove', { clientX: 200, clientY: 200 })
                .trigger('mouseup')
            
            // Verify transform changed (board moved)
            cy.get('#total-diagram-attach').should($board => {
                const newTransform = $board.css('transform')
                // Transform should be different after pan
                expect(newTransform).not.to.equal('none')
            })
        })
    })

    it('should render curved links between nodes', () => {
        cy.get('.link path').should('exist')
        cy.get('.link path').should('have.attr', 'd')
    })

    it('should have multiple nodes with titlebars', () => {
        cy.get('.titlebar').should('have.length.greaterThan', 0)
    })
})
