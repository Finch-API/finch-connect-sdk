// Mock global variables that might be needed
global.console = {
  ...console,
  error: jest.fn(),
};
