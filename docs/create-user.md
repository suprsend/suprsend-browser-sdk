## Pre-requisites

[Integrate Javascript SDK](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs/integrate-sdk.md)

<br>

## How Suprsend identifies a user

Suprsend identifies by unique identifier `distinct_id`. The identifier for a user is important as we use this key to create user profile and all the information related to a user, like channel preferences, is attached to that profile. It's best to send the user's `distinct_id` from your DB to map it across different devices and platforms. You can view user profile by searching `distinct_id` on [Subscribers page](https://app.suprsend.com/en/production/subscribers)

**Please note:** you cannot change a user's id once it has been set, so we recommend you use a non-transient id like a primary key rather than a phone number or email address.

<br>

## Step 1 : Create/Identify a new user

You can identify a user using `suprsend.identify()` method.

Call this method as soon as you know the identity of user, that is after login authentication. If you don't call this method, user will be identified using distinct_id (uuid) that sdk generates internally.

When you call this method, we internally create an event called **$user_login**. You can see this event on SuprSend workflows event list and you can configure a workflow on it.

```javascript
suprsend.identify(unique_id);

//Sample
suprsend.identify("291XXXXX-62XX-4dXX-b2XX");
suprsend.identify("johndoe@gmail.com");
```

| Parameters      | Type                                    | Description                                                             |
| :-------------- | :-------------------------------------- | :---------------------------------------------------------------------- |
| **distinct_id** | int, bigint, string, UUID (_Mandatory_) | Unique identifier for a user across devices or between multiple logins. |

<br>

## Step 2 : Call reset to clear user data on log out

As soon as the user logs out, call `suprsend.reset()` method to clear data attributed to a user. This will generate a new random `distinct_id` and clear all super properties. This allows you to handle multiple users on a single device.

When you call this method, we internally create an event called **$user_logout**. You can see this event on SuprSend workflows event list and you can configure a workflow on it.

```javascript
suprsend.reset();
```

<br>

> 🚧 Mandatory to call reset on logout
>
> Don't forget to call reset on user logout. If not called, user id will not reset and multiple tokens and channels will get added to the user_id who logged in first on the device.

<br>

## Step 3: Set Communication Channel preferences

You can send communication channel details of a user to the SuprSend SDK. We will store the channel details in the user profile. This will allow us to send communications to a user on the channels available for that user whenever there is any communication trigger.

### 1\. Add User Channels

You can add SMS, Email and Whatsapp channel information by using below methods. You can call this on signup, or whenever a user provides the above channel information.

```javascript
suprsend.user.add_email("user@example.com"); // To add Email

suprsend.user.add_sms("+91XXXXXXXXXX"); // To add SMS

suprsend.user.add_whatsapp("+91XXXXXXXXXX"); // To add Whatsapp
```

Webpush token will automatically get set at the time of user login. All you have to do is to integrate the push notification service in your website

[Web Push Integration guide](https://github.com/suprsend/suprsend-browser-sdk/blob/main/docs/web-push-vendor-integration.md)

> 🚧 Country Code Mandatory
>
> Mobile numbers should be in E.164 format. Make sure you are sending the proper country code when you are calling communication methods for SMS and Whatsapp.

<br>

### 2\. Remove User Channels

You can remove SMS, Email and Whatsapp channel information by using below methods. You can call this when a user updates his channel information. You need not call this when a user unsubscribes from a particular channel notification, as that will be handled in user preferences.

```kotlin
suprsend.user.remove_email("user@example.com")  // To remove Email

suprsend.user.remove_sms("+91XXXXXXXXXX")  // To remove SMS

suprsend.user.remove_whatsapp("+91XXXXXXXXXX"); // To remove Whatsapp

```

<br>

## Advanced Configuration - Set User Properties

You can use SuprSend SDK to set advanced user properties, which will help in creating a user profile. You can use these properties to create user cohorts on SuprSend's platform with future releases.

### 1\. Set

Set is used to set the custom user property or properties. The given name and value will be assigned to the user, overwriting an existing property with the same name if present. It can take key as first param, value as second param for setting single user property or object for setting multiple user properties.

```javascript
suprsend.user.set(key, value); // for single property
suprsend.user.set(property_obj); // for multiple properties

// For setting single property:
suprsend.user.set("name", "john doe");

// For setting multiple properties:
suprsend.user.set({ name: "john doe", age: "27" });
```

<br>

| Parameters       | Type                 | Description                                                                                 |
| :--------------- | :------------------- | :------------------------------------------------------------------------------------------ |
| **key**          | string (_Mandatory_) | This is property key that will be attached to user. \n \nShould not start with `$` or `ss_` |
| **value**        | any (_Optional_)     | This will be value that will be attached to key property.                                   |
| **property_obj** | object (_Optional_)  | This is used for setting multiple user properties.                                          |

<br>

> ❗️ Naming Guidelines
>
> When you create a key, please ensure that the Key Name does not start with **`$`** or **`ss_`**, as we have reserved these symbols for our internal events and property names.

<br>

### 2\. Set Once

Works just like `suprsend.user.set`, except it will not overwrite existing property values. This is useful for properties like _First login date_

```javascript
suprsend.user.set_once(key, value); // for single property
suprsend.user.set_once(properties); // for multiple properties

// For setting once a single property:
suprsend.user.set_once("first_login", "2021-11-02");

// For setting once multiple properties:
suprsend.user.set_once({ first_login: "2021-11-02", DOB: "1991-10-02" });
```

<br>

### 3\. Increment

Add the given amount to an existing property on the user. If the user does not already have the associated property, the amount will be added to zero. To reduce a property, provide a negative number for the value.

```javascript
suprsend.user.increment(key, value); // for single property
suprsend.user.increment(property_obj); // for multiple properties

// For incrementing a single property:
suprsend.user.increment("login_count", 1);

// For incrementing multiple properties:
suprsend.user.increment({ login_count: 1, order_count: 1 });
```

<br>

### 4\. Append

This method will append a value to the list for a given property.

```javascript
suprsend.user.append(key, value); // for single property
suprsend.user.append(properties); // for multiple properties

// For appending a single property:
suprsend.user.append("wishlist", "iphone12");

// For appending multiple properties:
suprsend.user.append({ wishlist: "iphone12", wishlist: "Apple airpods" });
```

<br>

### 5\. Remove

This method will remove a value from the list for a given property.

```javascript
suprsend.user.remove(key, value); // for single property
suprsend.user.remove(properties); // for multiple properties

// For removing a single property:
suprsend.user.remove("wishlist", "iphone12");

// For removing multiple properties:
suprsend.user.remove({ wishlist: "iphone12", wishlist: "Apple airpods" });
```

<br>

### 6\. Unset

This will remove a property permanently from user properties.

```javascript
suprsend.user.unset(key); // for single property
suprsend.user.unset(property_list); // for multiple properties

// For unsetting a single property:
suprsend.user.unset("wishlist");

// For unsetting multiple properties:
suprsend.user.unset(["wishlist", "cart"]);
```

<br>

| Parameters        | Type          | Description                                                       |
| :---------------- | :------------ | :---------------------------------------------------------------- |
| **key**           | string        | This property provided will be deleted from user properties       |
| **property_list** | array[string] | If list is given all properties included in list will be removed. |
