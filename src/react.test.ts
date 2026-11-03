import React from 'react';
// react-dom is a dev dependency, only needed to render the hook in tests.
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act } from 'react-dom/test-utils';
import { useFinchConnect } from './react';
import { POST_MESSAGE_NAME } from './core';

const postFromConnect = (data: Record<string, unknown>) => {
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { name: POST_MESSAGE_NAME, ...data },
      origin: 'https://connect.tryfinch.com',
    })
  );
};

describe('useFinchConnect', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });

  it('should call the callbacks from the latest render', () => {
    const received: string[] = [];

    // The callbacks close over a prop, as they would over component state.
    function Connect({ label }: { label: string }) {
      useFinchConnect({
        onSuccess: ({ code }) => received.push(`${label}:success:${code}`),
        onError: ({ errorMessage }) =>
          received.push(`${label}:error:${errorMessage}`),
        onClose: () => received.push(`${label}:close`),
      });
      return null;
    }

    act(() => {
      ReactDOM.render(
        React.createElement(Connect, { label: 'first' }),
        container
      );
    });
    act(() => {
      ReactDOM.render(
        React.createElement(Connect, { label: 'second' }),
        container
      );
    });

    postFromConnect({ kind: 'success', code: 'abc' });
    postFromConnect({
      kind: 'error',
      error: { shouldClose: false, message: 'oops' },
    });
    postFromConnect({ kind: 'closed' });

    expect(received).toEqual([
      'second:success:abc',
      'second:error:oops',
      'second:close',
    ]);
  });

  it('should stop calling back after unmounting', () => {
    const onSuccess = jest.fn();

    function Connect() {
      useFinchConnect({ onSuccess, onError: jest.fn(), onClose: jest.fn() });
      return null;
    }

    act(() => {
      ReactDOM.render(React.createElement(Connect), container);
    });
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });

    postFromConnect({ kind: 'success', code: 'abc' });

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
