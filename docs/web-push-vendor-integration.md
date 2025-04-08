## Pre-requisites

1. For webpush to work, it is mandatory to install Javascript SDK. Please refer [Javascript SDK installation guide here.](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs/integrate-sdk.md)
2. Call javascript SDK's methods [identify](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs/create-user.md) and [reset](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs/create-user.md). This is needed as webpush token genetated will be attached to that identified user.

Note: Make sure your website uses `https` protocol.  
<br>

## Step 1: Adding Service Worker File and Initialising

Service worker file is the background worker script which handles push notifications.

**1.a.** If you don't already have your own service worker then create `serviceworker.js` file in root of your project and make sure its publicly accessible. Then add following code in the `serviceworker.js` file.

Replace **WORKSPACE KEY** parameter with actual value. You will get this key from [SuprSend dashboard](https://app.suprsend.com/) left navigation panel

```javascript serviceworker.js
importScripts("https://cdn.jsdelivr.net/npm/@suprsend/web-sdk@0.1.30/serviceworker/serviceworker.min.js");
init_workspace(WORKSPACE KEY);
```

<br />

**1.b.** If you already have your own service worker then add the following code at top your service worker file.

Replace **WORKSPACE KEY** parameter with actual value. You will get this key from [SuprSend dashboard](https://app.suprsend.com/) left navigation panel

```javascript
importScripts("https://cdn.jsdelivr.net/npm/@suprsend/web-sdk@0.1.30/serviceworker/serviceworker.min.js"); // Add at top of your sw file
init_workspace(WORKSPACE KEY);
```

<br />

## Step 2: Initialize Javascript SDK

Use Javascript SDK to connect webpush to SuprSend service. For initializing SDK, you need **WORKSPACE KEY** and **WORKSPACE SECRET**. You will get both the tokens from [SuprSend dashboard](https://app.suprsend.com/) left navigation panel.

SDK's`init` method accepts object as its third parameter, where you have to specify **`public vapid key`**.

SuprSend creates a Vapid key when your account is created. You can find this key on the [Vendors page on SuprSend dashboard](https://app.suprsend.com/en/production/vendors/webpush/vapid-webpush). Go to **Vendors > Web Push > VAPID Keys** page, copy the key and paste it here in vapid key object value

```javascript
suprsend.init(WORKSPACE KEY, WORKSPACE SECRET, {vapid_key:<your_vapid_key>})
```

<br />

### Customise service worker

If you wish to use name other than `serviceworker.js` then you have to pass `sw_file_name` key with filename as value in object like below, else it takes the default name `serviceworker.js`

```javascript
suprsend.init(WORKSPACE_KEY, WORKSPACE_SECRET, {vapid_key:<your_vapid_key>, sw_file_name:<service_worker_file_name>})
```

<br />

## Step 3: Register for Push

Suprsend SDK provides method to register service worker which enables your website to prompt notification permission to your users, if not enabled already.  
You can use this method on a page load, or on button click, or when your user completes a transaction, etc.  
Once the notification permission is enabled and service worker is installed, you will be able to send push notifications from SuprSend dashboard.

```javascript
suprsend.web_push.register_push();
```

<br />

### Check for permission

You can check if the user has granted permission to show push notifications using the below method

```javascript
suprsend.web_push.notification_permission();
```

This will return a string representing the current permission. The value can be:

**granted**: The user has granted permission for the current origin to display notifications.

**denied**: The user has denied permission for the current origin to display notifications.

**default**: The user's decision is unknown. This will be permission when user first lands on website.

> 👍 Notification permission prompt
>
> It's a bad UX practice to ask notification and other permission prompts to user just after he lands on your website as user doesn't understand yet what your website is about. This leads to blocking the permission, and you won't be able to send webpush till the user resets the permission (which is unlikely). To avoid this, SuprSend SDK will automatically delay service worker registration process for 5 sec even though you trigger it on user landing on your site.
