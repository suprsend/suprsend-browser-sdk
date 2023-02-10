interface Dictionary {
  [key: string]: any;
}

interface User {
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
}

export interface SuprSend {
  init(
    ENV_API_KEY: string,
    SIGNING_KEY: string,
    config_keys: {
      api_url?: string;
      vapid_key?: string;
      service_worker_file?: string;
    }
  ): void;
  identify(unique_id: string): void;
  track(event: string, properties?: Dictionary): void;
  purchase_made(properties: Dictionary): void;
  reset(options?: { unsubscribe_push?: boolean }): void;
  set_super_properties(properties: Dictionary): void;

  user: User;
  web_push: WebPush;
}

declare const suprsend: SuprSend;
export default suprsend;
