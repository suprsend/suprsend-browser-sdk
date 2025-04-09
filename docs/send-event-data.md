In this section, we'll cover how to send events to the Suprsend platform from your web application

## Pre-requisites

1. [Integrate Javascript SDK](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs/integrate-sdk.md)
2. [Create User Profile](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs/create-user.md)
3. [Create Template on SuprSend platform](https://docs.suprsend.com/docs/templates) - if you want to trigger workflow by passing the event
4. [Create Workflow on SuprSend Platform](https://docs.suprsend.com/docs/workflows) - if you want to trigger workflow by passing the event

<br>

## Create Workflow on SuprSend Platform

For Event based workflow trigger, you'll have to [create the workflow on SuprSend Platform](https://docs.suprsend.com/docs/workflows).  
<br>

![](https://files.readme.io/d95d579-Frame_2.png)

<br>

## Sending Events to SuprSend

Once the workflow is configured, you can pass the `Event Name` ( `GROCERY_PURCHASED` in above example) defined in workflow configuration from your SDK and the related workflow will be triggered. Variables added in the template should be passed as event `properties`

You can send Events from your app to SuprSend platform by using `suprsend.track()` method  
<br>

```javascript
//method
suprsend.track(event_name, property_obj);

//Example
suprsend.track("clicked", { page: "Dashboard" });
```

| Parameters       | Type              | Description                                                                              |
| :--------------- | :---------------- | :--------------------------------------------------------------------------------------- |
| **event_name**   | string (required) | Name of the tracked event                                                                |
| **property_obj** | object (optional) | Additional data related to the event (event properties) can be tracked using this field. |

<br>

> ❗️ Naming Guideline
>
> When you create an Event or a property, please ensure that the Event Name or Property Name does not start with **`$`** or **`ss_`**, as we have reserved these symbols for our internal events and property names.

<br>

### System Events tracked by SuprSend

There are some system events tracked by SuprSend SDK by default. These are some basic events, as well as events that are necessary for tracking notifications related activity (like delivered, clicked, etc).  
You are not required to do anything here.

| Event Name              | Description                                                                                              |
| :---------------------- | :------------------------------------------------------------------------------------------------------- |
| $user_login             | Gets tracked when user logs in                                                                           |
| $user_logout            | Gets tracked when user logs out                                                                          |
| $notification_delivered | Will get tracked when the suprsend notification payload is received at sdk end.                          |
| $notification_clicked   | Will get tracked when user either clicks the notification body or any action button in the notification. |

<br>

## Advanced Concepts

### 1\. Super Properties

Super properties are data that are always sent with events data. These super properties will be sent in each event after calling this method. Super properties will be stored in local storage, and will persist across invocations of app.

#### Set Super Property

There are some super properties that SuprSend SDK will send by default. Developer can set custom super properties as well with `suprsend.set_super_properties()` method

```javascript
//method
suprsend.set_super_properties(property_obj);

//Example
suprsend.set_super_properties({ gender: "male" });
```

<br>

Default Super properties tracked by SuprSend SDK:

| Super Property   | Description                               | Sample Value                    |
| :--------------- | :---------------------------------------- | :------------------------------ |
| $browser         | Browser of the user                       | Chrome                          |
| $browser_version | Browser version of the user               | 96.0                            |
| $current_url     | The URL from which the event is triggered | <https://www.suprsend.com/blog> |
| $deviceId        | Device id                                 | 89eead05a0150146                |
| $os              | Operating System of the device            | Mac OS                          |
| $sdk_type        | _internal to SuprSend_                    | Browser                         |
| $sdk_version     | _internal to SuprSend_                    | 0.1.14                          |

<br>
