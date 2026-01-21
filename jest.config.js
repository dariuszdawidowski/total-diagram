module.exports = {
    testEnvironment: 'jsdom',
    testMatch: [
        '**/__tests__/**/*.test.js'
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        'index.js',
        '!build.js',
        '!cypress.config.js',
        '!jest.config.js',
        '!total-diagram.js.ejs'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    verbose: true
};
