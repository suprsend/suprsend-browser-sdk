This document will cover the methods to integrate [User Preferences](https://docs.suprsend.com/docs/preferences) in your websites. Your users will be able to specify their notification preferences using this page. With SuprSend, user can set preferences at 3 levels - **communication channel**, **notification category** and **selected channels inside a category**. We'll cover methods to read and update data at all 3 levels.

We'll also give an example code to add our pre-defined UI. This is how a typical preference page will look like

![](https://files.readme.io/bfca7a0-User_Preference_Page.png)

<br />

# Pre-requisites

- [Integrate Javascript SDK](https://docs.suprsend.com/docs/integrate-javascript-sdk)
- [Identify user on login](https://docs.suprsend.com/docs/javascript-create-user#how-suprsend-identifies-a-user) and [reset on logout](https://docs.suprsend.com/docs/javascript-create-user#step-2--call-reset-to-clear-user-data-on-log-out) to ensure that preference changes are tagged to the correct user
- [Configure notification categories](https://docs.suprsend.com/docs/preferences#creating--updating-notification-categories) on SuprSend dashboard

<br />

# Integration

All preference methods and properties are available under **_suprsend.user.preference_** instance. Here's a reference of all the properties and methods available in this instance:

### Properties

1. [data](https://docs.suprsend.com/docs/js-preferences#data-property) - The data set you'll need to populate the categories and channels on user's preference page

### Methods

1. [get_preferences](https://docs.suprsend.com/docs/js-preferences#get_preferences) - get full user preferences data from the SuprSend
2. [update_category_preference](https://docs.suprsend.com/docs/js-preferences#update_category_preference) - method to update overall category preference when user opts out and opts in the category using category level switch.

![](https://files.readme.io/3fb9ea2-update_category.png)

3. [update_channel_preference_in_category](https://docs.suprsend.com/docs/js-preferences#update_channel_preference_in_category) - method to update channel preference inside a category when user opts out and opts in a channel inside the category.

![](https://files.readme.io/f6806e6-channel-category-update.png)

4. [update_overall_channel_preference](https://docs.suprsend.com/docs/js-preferences#update_overall_channel_preference) - method to update overall channel preference for instance if user wants to receive only important notifications on SMS.

![](https://files.readme.io/9491874-channel-update.png)

<br />

### Event Listeners

1. [preferences_updated](https://docs.suprsend.com/docs/js-preferences#preferences_updated) - You'll get this event as soon as preference changes are updated. Response will return return the updated preference data object which you can use to update your UI.
2. [preferences_error](https://docs.suprsend.com/docs/js-preferences#preferences_error) - This error event is fired when there are errors in API requests or implementation.

### Enums

1. [PreferenceOptions](https://docs.suprsend.com/docs/js-preferences#preferenceoptions) - Enum to read and update **category preference** and **channel preference in category**
2. [ChannelLevelPreferenceOptions](https://docs.suprsend.com/docs/js-preferences#channellevelpreferenceoptions) - Enum to read and update overall **channel preference**

<br />

# Properties

## data property

This is a property on the preferences class that has full user preferences object. The data will be set after the successful execution of the **_get_preferences_** method.

Preference Page contains 2 sections:

1. Category-level preference settings(_sections_)

To update category level preferences, you'll have to fetch the data from 3 sections

- [Section](https://docs.suprsend.com/docs/js-preferences#1-sections) - to show sections like "**Product Updates**" in below example
- [Category](https://docs.suprsend.com/docs/js-preferences#2-categories-sections---sub-categories) - to show categories and their overall status like "**Refunds**" in below example
- [CategoryChannel](https://docs.suprsend.com/docs/js-preferences#3-category-channels-sections---sub-categories---channels) - to show communication channels inside the category and their status

![](https://files.readme.io/6001b46-section.png)

<br />

2. [Overall Channel-level preference](https://docs.suprsend.com/docs/js-preferences#4-overall-channel-preferences) - You can fetch this data from ChannelPreference section

![](https://files.readme.io/79d71ba-image.png)

### Data Structure:

We have to loop through the **data** property and create UI accordingly. This is how the overall data looks like.

```typescript TypeScript Types
interface PreferenceData {
  sections: Section[] | null;
  channel_preferences: ChannelPreference[] | null;
}

interface ChannelPreference {
  channel: string;
  is_restricted: boolean;
}

interface Section {
  name?: string | null;
  description?: string | null;
  subcategories?: Category[] | null;
}

interface Category {
  name: string;
  category: string;
  description?: string | null;
  preference: PreferenceOptions;
  is_editable: boolean;
  channels?: CategoryChannel[] | null;
}

interface CategoryChannel {
  channel: string;
  preference: PreferenceOptions;
  is_editable: boolean;
}
```

<br />

### Sample data

```javascript
suprsend.user.preferences.data = {
  sections: [
    {
      name: null,
      subcategories: [
        {
          name: "Payment and History",
          category: "payment-and-history",
          description: "Send updates related to my payment history.",
          original_preference: null,
          preference: "opt_in",
          is_editable: false,
          channels: [
            {
              channel: "androidpush",
              preference: "opt_in",
              is_editable: true,
            },
            {
              channel: "email",
              preference: "opt_in",
              is_editable: false,
            },
          ],
        },
      ],
    },
    {
      name: "Product Updates",
      description:
        "Non-marketing notifications related to authentication, activity updates, reminders etc.",
      subcategories: [
        {
          name: "Newsletter",
          category: "newsletter",
          description: "Send updates on new feature in the product",
          original_preference: null,
          preference: "opt_in",
          is_editable: true,
          channels: [
            {
              channel: "androidpush",
              preference: "opt_in",
              is_editable: true,
            },
            {
              channel: "email",
              preference: "opt_out",
              is_editable: false,
            },
          ],
        },
      ],
    },
  ],
  channel_preferences: [
    {
      channel: "androidpush",
      is_restricted: false,
    },
    {
      channel: "email",
      is_restricted: true,
    },
  ],
};
```

<br />

### 1. Sections

This contains the name, description, and subcategories. For instance, in the below We have to loop through the sections list and for every section item if there is a name and description present, then show the heading, and if a subcategories list is present, loop through that subcategories list and show all subcategories under that section heading.

Subcategories can exist without sections as the section is an optional field. In that case, the section's name will not be available. For sections where the name is not present, you can directly show its subcategories list without showing Heading for the section in UI.

![](https://files.readme.io/faf9fd4-Screenshot_2023-05-22_at_12.09.49_AM.png)

#### Data Structure

```typescript TypeScript Types
interface Section {
  name?: string | null;
  description?: string | null;
  subcategories?: Category[] | null;
}
```

<br />

| Key           | Type             | Description                                                                                                                                          |
| :------------ | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | string           | name of the section                                                                                                                                  |
| description   | string           | description of the section                                                                                                                           |
| subcategories | array of objects | [dataset of all sub-categories](https://docs.suprsend.com/docs/js-preferences#2-categories-sections---sub-categories) to be shown inside the section |

<br />

#### Sample data

```javascript
suprsend.user.preferences.data = {
  sections: [
    {
      name: "Product Updates",
      description:
        "Non-marketing notifications related to authentication, activity updates, reminders etc.",
      subcategories: [
        {
          name: "Newsletter",
          category: "newsletter",
          description: "Send updates on new feature in the product",
          original_preference: null,
          preference: "opt_in",
          is_editable: true,
          channels: [
            {
              channel: "androidpush",
              preference: "opt_in",
              is_editable: true,
            },
            {
              channel: "email",
              preference: "opt_out",
              is_editable: false,
            },
          ],
        },
      ],
    },
  ],
};
```

<br />

### 2. Categories (sections -> sub-categories)

Added as sections -> sub-categories on notification category page. This is the actual place where the user sets his category-level preferences. While looping through the subcategories list for every subcategory item, show the name and description in UI.

![](https://files.readme.io/a37cdd4-category.png)

#### Data Structure

```typescript
interface Category {
  name: string;
  category: string;
  description?: string | null;
  preference: PreferenceOptions;
  is_editable: boolean;
  channels?: CategoryChannel[] | null;
}
```

<br />

| Key         | Type              | Description                                                                                                                                                                                                                                   |
| :---------- | :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | string            | name of the category to be shown on the UI                                                                                                                                                                                                    |
| category    | string            | This key is the id of the category which is used while updating the preference.                                                                                                                                                               |
| description | string            | description of the category to be shown on the UI                                                                                                                                                                                             |
| preference  | PreferenceOptions | This key indicates if the category's preference switch is on or off. Get **OPT_IN** when the switch is on and **OPT_OUT** when the switch is off                                                                                              |
| is_editable | boolean           | Indicates if the preference switch button is disabled or not. If its value is false then the preference setting for that category can't be edited                                                                                             |
| channels    | array of objects  | [dataset of all categorychannel ](https://docs.suprsend.com/docs/js-preferences#3-category-channels-sections---sub-categories---channels)to be shown below the sub-category. Loop through it to show checkboxes under every subcategory item. |

<br />

#### Sample data

```javascript
suprsend.user.preferences.data = {
  "sections": [
    { ...
      "subcategories": [
        {
          "name": "Newsletter",
          "category": "newsletter",
          "description": "Send updates on new feature in the product",
          "original_preference": null,
          "preference": "opt_in",
          "is_editable": true,
          "channels": [
            {
              "channel": "androidpush",
              "preference": "opt_in",
              "is_editable": true
            },
            {
              "channel": "email",
              "preference": "opt_out",
              "is_editable": false
            }
          ]
        }
      ]
    }
  ]
}
```

<br />

### 3. Category channels (sections -> sub-categories -> channels)

This contains a list of channels, channel preference status and whether it's editable or not. While looping through the subcategory list for every subcategory item we have to loop through its channels list and for every channel to show channel level checkbox.

![](https://files.readme.io/80746b2-channel_1.png)

#### Data Structure

```typescript
interface CategoryChannel {
  channel: string;
  preference: PreferenceOptions;
  is_editable: boolean;
}
```

<br />

| Key         | Type              | Description                                                                                                                                     |
| :---------- | :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| channel     | string            | name of the channel to be shown on UI. the same key will be used as id of the channel while updating the preference.                            |
| preference  | PreferenceOptions | This key indicates if the channel's preference switch is on or off. Get **OPT_IN** when the switch is on and **OPT_OUT** when the switch is off |
| is_editable | boolean           | Indicates if the preference checkbox is disabled or not. If its value is false then the preference setting for that channel can't be edited     |

<br />

#### Sample data

```javascript
suprsend.user.preferences.data = {
  "sections": [
    { ...
      "subcategories": [
        { ...
          "channels": [
            {
              "channel": "email",
              "preference": "opt_in",
              "is_editable": true
            },
            {
              "channel": "inbox",
              "preference": "opt_out",
              "is_editable": false
            }
          ]
        }
      ]
    }
  ]
}
```

<br />

### 4. Overall Channel Preferences

This indicates channel-level user preferences. It's a list of all channel-level preferences. We have to loop through the list and for each item, show the UI as given in the below image.

![](https://files.readme.io/9d8e864-Screenshot_2023-05-19_at_10.00.16_PM.png)

<br />

#### Data Structure

```typescript TypeScript Types
interface ChannelPreference {
  channel: string;
  is_restricted: boolean;
}
```

<br />

| Key           | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| :------------ | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| channel       | string  | name of the channel to be shown on UI. the same key will be used as id of the channel while updating the preference.                                                                                                                                                                                                                                                                                    |
| is_restricted | boolean | This key indicates the restriction level of channel. If restricted, notification will only be sent in the category where this channel is added as mandatory in [notification category settings](https://docs.suprsend.com/docs/preferences#creating--updating-notification-categories). **_True_** means **_Required_** radio button is selected. **_False_** means **_All_** radio button is selected. |

<br />

#### Sample data

```javascript
suprsend.user.preferences.data = {
  channel_preferences: [
    {
      channel: "androidpush",
      is_restricted: false,
    },
    {
      channel: "email",
      is_restricted: true,
    },
  ],
};
```

<br />

# Methods

## get_preferences()

This method is used to get full user preferences data from the SuprSend. This method should be called first before any update methods. Calling this method will make an API call and set preference response in an instance property **_data_** so you can access data using **_suprsend.user.preferences.data_**

**Parameters**:

- **brand_id** (optional) - used to get preference wrt to that brand
- **show_opt_out_channels** (optional): Always pass this flag as true. If false, all categories channels will be removed if category level preference is turned off.

**Returns**: Promise which resolves to PreferenceData(on success) or PreferenceErrorData(on reject)

```typescript
suprsend.user.preferences.get_preferences(args?: {brand_id?: string, show_opt_out_channels?:boolean}): Promise<PreferenceData | PreferenceErrorData>;


Example:
const response = await suprsend.user.preferences.get_preferences({show_opt_out_channels:true});
if(!response.error){
  console.log(suprsend.user.preferences.data); // get preferences data object
}
```

<br />

## update_category_preference()

Calling this method will opt-in/opt-out users from that category. When the category is editable and the switch is toggled you can call this method.

#### Parameters

_**category**_: This is the category id for which you want to change the preference. You can get it inside the subcategory object.

**_preference_**: This is the enum value that indicates the category should be opted-out or opted-in. This field can take either **_PreferenceOptions.OPT_IN_** or **_PreferenceOptions.OPT_OUT_**.

_**brand_id**_(optional): brand id for which this category should be updated.

**show_opt_out_channels** (optional): Always pass this flag as true. If false, all categories channels will be removed if category level preference is turned off

#### Returns

**_PreferenceData_** or **_PreferenceErrorData_**: If the request doesn't have any client-side validation errors then **_PreferenceData_** is returned and If it has any client-side validation errors **_PreferenceErrorData_** is returned. After the API call, if there is an error on the server side, you can subscribe to the **_preferences_error_** event listener to get the server-side errors **_PreferenceErrorData_** object.

#### Data Structure

```typescript TypeScript Types
update_category_preference(
    category: string,
    preference: PreferenceOptions,
    args?: {
      brand_id?: string;
      show_opt_out_channels?: boolean
    }
  ): PreferenceData | PreferenceErrorData;

enum PreferenceOptions {
  OPT_IN = "opt_in",
  OPT_OUT = "opt_out",
}

interface PreferenceErrorData {
  error: boolean;
  api_error?: boolean;
  message: string;
  status_code?: number | null;
  error_obj?: Error | null;
}

```

#### Example

```javascript
import suprsend, { PreferenceOptions } from "@suprsend/web-sdk";

const response = suprsend.user.preferences.update_category_preference(
  "category_id",
  PreferenceOptions.OPT_IN,
  { show_opt_out_channels: true }
);
if (response.error) {
  console.log(response.message); // some issue with validation like updating uneditable field etc
} else {
  console.log(response); // access updated preference data and update UI
}
```

<br />

## update_channel_preference_in_category()

Calling this method will opt-in/opt-out users from that category-level channel. When the category's channel checkbox is editable and the user clicks on the checkbox you can call this method.

#### Parameters

**_channel_**: This is the channel id for which you want to change the preference. You can get it inside the section > subcategory > channels.

**_preference_**: This is the enum value that indicates the category should be opted-out or opted-in. This field can take either **_PreferenceOptions.OPT_IN_** or **_PreferenceOptions.OPT_OUT_**.

_**category**_: This is the category id for which you want to change the preference. You can get it inside the subcategory object.

_**brand_id**_(optional): brand id for which this category should be updated.

**show_opt_out_channels** (optional): Always pass this flag as true. If false, all categories channels will be removed if category level preference is turned off

#### Returns

**_PreferenceData_** or **_PreferenceErrorData_**: If the request doesn't have any client-side validation errors then **_PreferenceData_** is returned and If it has any client-side validation errors **_PreferenceErrorData_** is returned. After the API call, if there is an error on the server side, you can subscribe to the **_preferences_error_** event listener to get the server-side errors **_PreferenceErrorData_** object.

#### Data Structure

```typescript TypeScript Types
update_channel_preference_in_category(
    channel: string,
    preference: PreferenceOptions,
    category: string,
    args?: {
      brand_id?: string;
      show_opt_out_channels?: boolean
    }
  ): PreferenceData | PreferenceErrorData;

enum PreferenceOptions {
  OPT_IN = "opt_in",
  OPT_OUT = "opt_out",
}

interface PreferenceErrorData {
  error: boolean;
  api_error?: boolean;
  message: string;
  status_code?: number | null;
  error_obj?: Error | null;
}
```

#### Example

```javascript
import suprsend, { PreferenceOptions } from "@suprsend/web-sdk";

const response =
  suprsend.user.preferences.update_channel_preference_in_category(
    "email",
    PreferenceOptions.OPT_IN,
    "category_id",
    { show_opt_out_channels: true }
  );
if (response.error) {
  console.log(response.message); // some issue with validation like updating uneditable field etc
} else {
  console.log(response); // access updated preference data and update UI
}
```

<br />

## update_overall_channel_preference()

This method updated the channel-level preference of the user.

#### Parameters

**_channel_**: This is the channel id for which you want to change the preference.

**_preference_**: This is the enum value that indicates the category should be selected ALL or only REQUIRED. This field can take either **_ChannelLevelPreferenceOptions.ALL_** or **_ChannelLevelPreferenceOptions.REQUIRED_**.

#### Returns

**_PreferenceData_** or **_PreferenceErrorData_**: If the request doesn't have any client-side validation errors then **_PreferenceData_** is returned and If it has any client-side validation errors **_PreferenceErrorData_** is returned. After the API call, if there is an error on the server side, you can subscribe to the **_preferences_error_** event listener to get the server-side errors **_PreferenceErrorData_** object.

#### Data Structure

```typescript TypeScript Types
update_overall_channel_preference(
    channel: string,
    preference: ChannelLevelPreferenceOptions
  ): PreferenceData | PreferenceErrorData;

enum ChannelLevelPreferenceOptions {
  ALL = "all",
  REQUIRED = "required",
}

interface PreferenceErrorData {
  error: boolean;
  api_error?: boolean;
  message: string;
  status_code?: number | null;
  error_obj?: Error | null;
}
```

#### Example

```javascript
import suprsend, { ChannelLevelPreferenceOptions } from "@suprsend/web-sdk";

const response = suprsend.user.preferences.update_overall_channel_preference(
  "email",
  ChannelLevelPreferenceOptions.ALL
);
if (response.error) {
  console.log(response.message); // some issue with validation like updating uneditable field etc
} else {
  console.log(response); // access updated preference data and update UI
}
```

<br />

# Event Listeners

These event listeners can be handled once on your preference page to listen to events emitted by all methods.

## preferences_updated

Update operations can be interdependent, so SDK will send a **_preference_updated_** event when there is an update in preferences data after calling updating preference methods. The data you get in the callback is different from the response object which you get after calling update preferences methods, so you have to get the latest preference data and update UI in both cases. On your preference page, listen to this event, and whenever it's fired, get an updated preference data object in callback so that you can update your UI.

```javascript
suprsend.emitter.on(
  "preferences_updated",
  (preference_data: PreferenceData) => {
    console.log(preference_data); // access updated preference data and update UI
  }
);
```

<br />

## preferences_error

This error event is fired when there are errors in API requests or implementation.

Following are some of the errors thrown by SDK:

- The mandatory parameter is missing.
- The invalid parameter is provided. For example, passing values other than **PreferenceOptions.OPT_IN** and **PreferenceOptions.OPT_OUT** in **preferences** parameter of **update_category_preference** method.
- Calling any update methods before successful completion of the **get_preferences** method.
- Updating values that are not editable.
- The object you are updating like category or channel is not found in the preferences tree. ie... invalid id is provided while updating.
- when an API request is not successful for any reason.

When code is implemented properly, except for API errors most of these above validation errors won't come.

```typescript TypeScript Types
interface PreferenceErrorData {
  error: boolean;
  api_error?: boolean;
  message: string;
  status_code?: number | null;
  error_obj?: Error | null;
}
```

```javascript
suprsend.emitter.on("preferences_error", (error: PreferenceErrorData) => {
  console.log("ERROR:", error);
});
```

<br />

# Enums

## PreferenceOptions

This enum has 2 values **_OPT_IN_** and **_OPT_OUT_**. You can send this as a preference parameter for **_update_category_preference_** and **_update_channel_preference_in_category_** and can also be used to check if a value in the preference key of the subcategory or subcategory's channel is opt-in or opt-out.

#### Data Structure

```typescript TypeScript Type
enum PreferenceOptions {
  OPT_IN = "opt_in",
  OPT_OUT = "opt_out",
}
```

#### Example

```javascript
import suprsend, { PreferenceOptions } from "@suprsend/web-sdk";

const response = await suprsend.user.preferences.update_category_preference(
  "category_id",
  PreferenceOptions.OPT_IN
);
// or
subcategory.preference === PreferenceOptions.OPT_IN;
```

<br />

## ChannelLevelPreferenceOptions

This enum has 2 values **_ALL_** and **_REQUIRED_**. You can send this as a preference parameter for **_update_overall_channel_preference_** and can also be used to check if a value in the preference key of the channel_preference item is all or required.

#### Data Structure

```typescript TypeScript Type
enum ChannelLevelPreferenceOptions {
  ALL = "all",
  REQUIRED = "required",
}
```

#### Example

```javascript
import suprsend, { ChannelLevelPreferenceOptions } from "@suprsend/web-sdk";

const response =
  await suprsend.user.preferences.update_overall_channel_preference(
    "email",
    ChannelLevelPreferenceOptions.ALL
  );
// or
channel_preference.is_restricted === true
  ? ChannelLevelPreferenceOptions.REQUIRED
  : ChannelLevelPreferenceOptions.ALL;
```
