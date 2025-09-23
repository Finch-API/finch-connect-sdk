# Finch Connect SDK

[![NPM](https://img.shields.io/npm/v/@tryfinch/react-connect)](https://www.npmjs.com/package/@tryfinch/react-connect)

The SDK for [Finch's](https://developer.tryfinch.com/how-finch-works/quickstart) authorization flow, Finch Connect

## Installation

### React

Available on [npm](https://www.npmjs.com/package/@tryfinch/react-connect):

```bash
npm install @tryfinch/react-connect
```

### JavaScript

Available via CDN:

```html
<script src="https://prod-cdn.tryfinch.com/latest/connect.js"></script>
```

Pin to a specific version (see [npm](https://www.npmjs.com/package/@tryfinch/react-connect) for available versions):

```html
<script src="https://prod-cdn.tryfinch.com/vX.Y.Z/connect.js"></script>
```

## Usage

See the documentation on setting up Finch Connect [here](https://developer.tryfinch.com/implementation-guide/Connect/Create-Account)

Example apps are available in the `example` directory of this repo. See their READMEs for how to run them.

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

## Contributing

Pull requests in this repo are not routinely reviewed, do not submit pull requests if you are having issues with Finch Connect. Instead please reach out to our support team at developers@tryfinch.com.
