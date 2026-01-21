describe('E2E Dynamic Operations Tests', () => {
    
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/examples/e2e.html')
    })

    it('should render the E2E test page', () => {
        cy.get('#container').should('exist')
        cy.get('h3').should('contain', 'E2E test')
        cy.get('p').should('contain', 'Testing sandbox for Cypress')
    })

    it('should have all control buttons', () => {
        cy.get('#addNodeButton').should('exist').should('contain', 'add node')
        cy.get('#delNodeButton').should('exist').should('contain', 'delete node')
        cy.get('#addLinkButton').should('exist').should('contain', 'add link')
        cy.get('#delLinkButton').should('exist').should('contain', 'delete link')
    })

    it('should have container with correct styling', () => {
        cy.get('#container').should('have.css', 'background-color', 'rgb(6, 5, 49)')
        cy.get('#container').should('have.css', 'overflow', 'hidden')
        cy.get('#container').should('have.css', 'user-select', 'none')
    })

    it('should have board element initialized', () => {
        cy.get('#total-diagram-attach').should('exist')
    })

    it('should log message when clicking add node button', () => {
        cy.window().then((win) => {
            cy.spy(win.console, 'log').as('consoleLog')
        })
        cy.get('#addNodeButton').click()
        cy.get('@consoleLog').should('be.calledWith', 'add new node')
    })

    it('should log message when clicking delete node button', () => {
        cy.window().then((win) => {
            cy.spy(win.console, 'log').as('consoleLog')
        })
        cy.get('#delNodeButton').click()
        cy.get('@consoleLog').should('be.calledWith', 'del old node')
    })

    it('should log message when clicking add link button', () => {
        cy.window().then((win) => {
            cy.spy(win.console, 'log').as('consoleLog')
        })
        cy.get('#addLinkButton').click()
        cy.get('@consoleLog').should('be.calledWith', 'add new lnk')
    })

    it('should log message when clicking delete link button', () => {
        cy.window().then((win) => {
            cy.spy(win.console, 'log').as('consoleLog')
        })
        cy.get('#delLinkButton').click()
        cy.get('@consoleLog').should('be.calledWith', 'del old lnk')
    })

    it('should have buttons that are clickable', () => {
        cy.get('#addNodeButton').should('be.visible').should('be.enabled')
        cy.get('#delNodeButton').should('be.visible').should('be.enabled')
        cy.get('#addLinkButton').should('be.visible').should('be.enabled')
        cy.get('#delLinkButton').should('be.visible').should('be.enabled')
    })
})
