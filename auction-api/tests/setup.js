jest.mock('../src/config/db', () => {
  return jest.fn().mockResolvedValue(true);
});

global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
