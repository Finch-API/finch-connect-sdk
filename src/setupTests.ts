// Jest setup file for DOM testing
import 'jest-environment-jsdom';

// Mock global variables that might be needed
global.console = {
  ...console,
  error: jest.fn(),
};