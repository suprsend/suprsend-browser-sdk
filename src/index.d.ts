import { Emitter } from "mitt";

interface Dictionary {
  [key: string]: any;
}

export enum PreferenceOptions {
  OPT_IN = "opt_in",
  OPT_OUT = "opt_out",
}

export enum ChannelLevelPreferenceOptions {
  ALL = "all",
  REQUIRED = "required",
}

type EmitterEvents = {
  preferences_updated: PreferenceData;
  preferences_error: PreferenceErrorData;
};

interface CategoryChannel {
  channel: string;
  preference: PreferenceOptions;
  is_editable: boolean;
}

interface Category {
  name: string;
  category: string;
  description?: string | null;
  preference: PreferenceOptions;
  is_editable: boolean;
  channels?: CategoryChannel[] | null;
}

interface Section {
  name?: string | null;
  description?: string | null;
  subcategories?: Category[] | null;
}

interface ChannelPreference {
  channel: string;
  is_restricted: boolean;
}

interface PreferenceData {
  sections: Section[] | null;
  channel_preferences: ChannelPreference[] | null;
}

interface PreferenceErrorData {
  error: boolean;
  api_error?: boolean;
  message: string;
  status_code?: number | null;
  error_obj?: Error | null;
}

interface PreferencesResponse extends PreferenceData, PreferenceErrorData {}

interface GetCategoriesResponse extends PreferenceErrorData {
  meta: { count: number; limit: number; offset: number };
  results: Category[] | null;
}

interface GetOverAllChannelPreferencesResponse extends PreferenceErrorData {
  channel_preferences: ChannelPreference[] | null;
}

interface Preferences {
  data: PreferenceData;

  get_preferences(args?: { brand_id?: string }): Promise<PreferencesResponse>;

  get_categories(args?: {
    brand_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<GetCategoriesResponse>;

  get_category(
    category: string,
    args?: { brand_id?: string }
  ): Promise<Category>;

  get_overall_channel_preferences(): Promise<GetOverAllChannelPreferencesResponse>;

  update_category_preference(
    category: string,
    preference: PreferenceOptions,
    args?: {
      brand_id?: string;
    }
  ): PreferencesResponse;

  update_channel_preference_in_category(
    channel: string,
    preference: PreferenceOptions,
    category: string,
    args?: {
      brand_id?: string;
    }
  ): PreferencesResponse;

  update_overall_channel_preference(
    channel: string,
    preference: ChannelLevelPreferenceOptions
  ): PreferencesResponse;
}

interface User {
  preferences: Preferences;

  set(key: string, value: any): void;
  set(prop: Dictionary): void;

  set_once(key: string, value: any): void;
  set_once(prop: Dictionary): void;

  increment(key: string, value: number): void;
  increment(prop: Dictionary): void;

  append(key: string, value: any): void;
  append(prop: Dictionary): void;

  remove(key: string, value: any): void;
  remove(prop: Dictionary): void;

  unset(key: string): void;
  unset(keys: string[]): void;

  add_email(email: string): void;
  remove_email(email: string): void;

  add_sms(mobile: string): void;
  remove_sms(mobile: string): void;

  add_whatsapp(mobile: string): void;
  remove_whatsapp(mobile: string): void;

  add_webpush(push: Dictionary): void;
  remove_webpush(push: Dictionary): void;
}

export interface WebPush {
  register_push(): void;
  notification_permission(): NotificationPermission;
}

export interface SuprSend {
  init(
    ENV_API_KEY: string,
    SIGNING_KEY: string,
    config_keys?: {
      api_url?: string;
      vapid_key?: string;
      service_worker_file?: string;
    }
  ): void;
  identify(unique_id: any): void;
  track(event: string, properties?: Dictionary): void;
  purchase_made(properties: Dictionary): void;
  reset(options?: { unsubscribe_push?: boolean }): void;
  set_super_properties(properties: Dictionary): void;

  user: User;
  web_push: WebPush;
  emitter: Emitter<EmitterEvents>;
}

declare const suprsend: SuprSend;
export default suprsend;
