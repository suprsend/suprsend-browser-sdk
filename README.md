# suprsend-browser-sdk

Suprsend Javascript SDK for browsers

> 📘 v2 version of @suprsend/web-sdk is available.
>
> We have changed the web SDK authentication from workspace key-secret to public key and JWT based authentication in v2. This is done to improve security in frontend applications.
>
> - For migrating to v2, follow this [guide](https://docs.suprsend.com/v1.2.2/docs/js-migration-from-v1)
> - Refer the v2 SDK [documentation](https://docs.suprsend.com/v1.2.2/docs/javascript-sdk)
> - Github [respository](https://github.com/suprsend/suprsend-web-sdk) link for v2 version of this sdk.
> - Documentation for this SDK (v1) can be found [here](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs)

## Installation

`suprsend-browser-sdk` is available as npm package. You can install using npm or yarn.

Using npm:

```bash
npm install @suprsend/web-sdk
```

Using yarn:

```bash
yarn add @suprsend/web-sdk
```

## Initialization

Initialize the Suprsend SDK

```node
import suprsend from "@suprsend/web-sdk";

...

suprsend.init(WORKSPACE_KEY, WORKSPACE_SECRET); // Initialize SDK
```

Refer full documentation [here](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs)
