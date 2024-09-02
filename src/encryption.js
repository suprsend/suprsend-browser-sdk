import config from "./config";
import { constants } from "./constants";
import { md5 } from "js-md5";

const getUtf8Bytes = (str) =>
  new Uint8Array(
    [...unescape(encodeURIComponent(str))].map((c) => c.charCodeAt(0))
  );

export default async function create_signature(
  str,
  date,
  method,
  route = `/${constants.api_events_route}`
) {
  if (!window.crypto) {
    return;
  }
  const key = config.signing_key;
  const content_type = "application/json";
  let md5_str = "";
  if (str) {
    md5_str = md5(str);
  }
  const message = `${method}\n${md5_str}\n${content_type}\n${date}\n${route}`;
  const keyBytes = getUtf8Bytes(key);
  const messageBytes = getUtf8Bytes(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", cryptoKey, messageBytes);

  // to lowercase hexits
  [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");

  // to base64
  return window.btoa(String.fromCharCode(...new Uint8Array(sig)));
}
