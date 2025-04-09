> 📘 This is v1 version of @suprsend/web-sdk
>
> We have changed the web SDK authentication from workspace key-secret to public key and JWT based authentication in v2. This is done to improve security in frontend applications.
>
> - For migrating to v2, follow this [guide](https://docs.suprsend.com/docs/js-migration-from-v1)
> - Refer the v2 SDK [documentation](https://docs.suprsend.com/docs/javascript-sdk)
> - Github [repository](https://github.com/suprsend/suprsend-browser-sdk) v1 version of this SDK.

## Installation

**Install SDK using npm / yarn**

```javascript npm
npm i @suprsend/web-sdk
```

```Text yarn
yarn add @suprsend/web-sdk
```

<br />

## Initialization

**Use SDK's `init` method to initialize the SuprSend SDK.**

Once you initialize the sdk you can use all methods available in it. Make sure to initialize it before calling other methods of it. If you are using create-react-app, initialize it on top of App class in `App.js`.

```javascript
import suprsend from "@suprsend/web-sdk";

suprsend.init(WORKSPACE_KEY, WORKSPACE_SECRET);
```

<br />

Replace **WORKSPACE KEY** and **WORKSPACE SECRET** with your workspace values. You will get both the tokens from [Suprsend dashboard](https://app.suprsend.com/) (_**Settings page -> "API keys"**_ section).

![](https://files.readme.io/d60fec2-Frame_58_1.png)
