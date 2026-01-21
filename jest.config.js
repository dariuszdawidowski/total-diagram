module.exports = {
    testEnvironment: 'jsdom',
    testMatch: [
        '**/__tests__/**/*.test.js'
    ],
    collectCoverageFrom: [
        '*.js',
        '!build.js',
        '!format.js',
        '!cypress.config.js',
        '!jest.config.js',
        '!total-diagram.js.ejs'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    verbose: true
};
