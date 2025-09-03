# Finch Connect SDK

[![NPM](https://img.shields.io/npm/v/@tryfinch/react-connect)](https://www.npmjs.com/package/@tryfinch/react-connect)

The SDK for [Finch's](https://www.tryfinch.com/) authorization flow, Finch Connect

## Installation

### React

Available on npm at `@tryfinch/react-connect`:

```bash
npm install @tryfinch/connect
```

### JavaScript

Available via CDN:

```html
<script src="https://prod-cdn.tryfinch.com/latest/connect.js"></script>
```

## Usage

### React

```jsx
import React, { useState } from 'react';
import { useFinchConnect } from '@tryfinch/react-connect';

const App = () => {
  const [code, setCode] = useState(null);

  // Define callbacks

  /**
   * @param {string} code - The authorization code to exchange for an access token
   * @param {string?} state - The state value that was provided when launching Connect
   */
  const onSuccess = ({ code, state }) => setCode(code);
  /**
   * @param {string} errorMessage - The error message
   * @param {'validation_error' | 'employer_error'} errorType - The type of error
   *    - 'validation_error': Finch Connect failed to open due to validation error
   *    - 'employer_connection_error': The errors employers see within the Finch Connect flow
   */
  const onError = ({ errorMessage, errorType }) =>
    console.error(errorMessage, errorType);
  const onClose = () => console.log('User exited Finch Connect');

  // Initialize the FinchConnect hook
  const { open } = useFinchConnect({
    onSuccess,
    onError,
    onClose,
  });

  // Generate a session ID using the /connect/sessions endpoint on the Finch API
  // See the docs here https://developer.tryfinch.com/api-reference/connect/new-session#create-a-new-connect-session
  const sessionId = '';

  return (
    <div>
      <header>
        <p>Code: {code}</p>
        <button type="button" onClick={() => open({ sessionId })}>
          Open Finch Connect
        </button>
      </header>
    </div>
  );
};
```

### JavaScript

```html
<html>
  <head>
    <script src="https://prod-cdn.tryfinch.com/latest/connect.js"></script>
  </head>
  <body>
    <button id="connect-button">Open Finch Connect</button>

    <script>
      // Define callbacks

      /**
       * @param {string} code - The authorization code to exchange for an access token
       * @param {string?} state - The state value that was provided when launching Connect
       */
      const onSuccess = ({ code, state }) => {
        // Exchange code for access token via your server
      };
      /**
       * @param {string} errorMessage - The error message
       * @param {'validation_error' | 'employer_error'} errorType - The type of error
       *    - 'validation_error': Finch Connect failed to open due to validation error
       *    - 'employer_connection_error': The errors employers see within the Finch Connect flow
       */
      const onError = ({ errorMessage }) => {
        console.error(errorMessage);
      };
      const onClose = () => {
        console.log('Connect closed');
      };

      const connect = FinchConnect.initialize({
        onSuccess,
        onError,
        onClose,
      });

      // Generate a session ID using the /connect/sessions endpoint on the Finch API
      // See the docs here https://developer.tryfinch.com/api-reference/connect/new-session#create-a-new-connect-session
      const sessionId = '';

      const button = document.getElementById('connect-button');
      button.addEventListener('click', () => {
        connect.open({ sessionId });
      });
    </script>
  </body>
</html>
```
