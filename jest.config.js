module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.[tj]sx?$': 'ts-jest', // Transforma archivos TypeScript y JavaScript
    },
    transformIgnorePatterns: [
      'node_modules/(?!(axios)/)', // Transforma módulos específicos que utilizan ESModules
    ],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mockea archivos CSS
      '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mockea imágenes
    },
  };
  