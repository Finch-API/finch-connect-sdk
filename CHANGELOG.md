# v5.0.0

## New
- We've unified our React and JavaScript SDKs to simplify maintaining their core functionality. No breaking changes are introduced, but we have bumped the version of both to `v5.0.0` to align them going forward.

# v4.1.0

## New
- Added the `openPreview` function, which accepts a client ID and list of products and will launch Connect in preview mode. Completing the authorization flow is disabled in preview mode.

# v4.0.0

## ⚠️ Breaking Changes
- A session ID is now required when calling the `open` method to launch Finch Connect. You can create a session using the [Connect session endpoint](https://developer.tryfinch.com/api-reference/connect/new-session) on the Finch API.
- The `state` parameter has been moved from the `initialize` call to the `open` call
- The `open` call no longer allows overriding values for the auth session, all values must be set in the session created by calling the API