!(function () {
  "use strict";
  var e = {
      d: function (t, n) {
        for (var r in n)
          e.o(n, r) &&
            !e.o(t, r) &&
            Object.defineProperty(t, r, { enumerable: !0, get: n[r] });
      },
      o: function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      },
      r: function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      },
    },
    t = {};
  e.r(t),
    e.d(t, {
      default: function () {
        return N;
      },
    });
  var n = "_suprsend_dist_id",
    r = "bulk_api_call",
    i = "event/",
    o = "_suprsend_super_props",
    a = "_suprsend_device_id",
    c = {
      Edge: ["Edge"],
      "Opera Mini": ["Opera Mini"],
      "Opera Mobile": ["Opera Mobi"],
      Opera: ["Opera"],
      "Internet Explorer": ["Trident", "MSIE"],
      Chrome: ["Chrome"],
      Firefox: ["Firefox"],
      Safari: ["Safari"],
      Mozilla: ["Mozilla"],
    },
    u = {
      Edge: /Edge\/([0-9]+(\.[0-9]+)?)/,
      "Opera Mini": /Opera Mini\/([0-9]+(\.[0-9]+)?)/,
      "Opera Mobile": /Version\/([0-9]+(\.[0-9]+)?)/,
      Opera: /Version\/([0-9]+(\.[0-9]+)?)/,
      "Internet Explorer": "rv:",
      Chrome: /Chrome\/([0-9]+(\.[0-9]+)?)/,
      Firefox: /rv:([0-9]+(\.[0-9]+)?)/,
      Safari: /Version\/([0-9]+(\.[0-9]+)?)/,
      Mozilla: /rv:([0-9]+(\.[0-9]+)?)/,
    },
    l = {
      "Chrome OS": "CrOS",
      "Mac OS": "Macintosh",
      Windows: "Windows",
      iOS: "like Mac",
      Android: "Android",
      Linux: "Linux",
    };
  const s = "https://hub.relayroad.com",
    f = "1.0.0";
  function d(e, t) {
    var n =
      ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (!n) {
      if (
        Array.isArray(e) ||
        (n = (function (e, t) {
          if (e) {
            if ("string" == typeof e) return v(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return (
              "Object" === n && e.constructor && (n = e.constructor.name),
              "Map" === n || "Set" === n
                ? Array.from(e)
                : "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                ? v(e, t)
                : void 0
            );
          }
        })(e)) ||
        (t && e && "number" == typeof e.length)
      ) {
        n && (e = n);
        var r = 0,
          i = function () {};
        return {
          s: i,
          n: function () {
            return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
          },
          e: function (e) {
            throw e;
          },
          f: i,
        };
      }
      throw new TypeError(
        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    }
    var o,
      a = !0,
      c = !1;
    return {
      s: function () {
        n = n.call(e);
      },
      n: function () {
        var e = n.next();
        return (a = e.done), e;
      },
      e: function (e) {
        (c = !0), (o = e);
      },
      f: function () {
        try {
          a || null == n.return || n.return();
        } finally {
          if (c) throw o;
        }
      },
    };
  }
  function v(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  var p;
  function _() {
    var e = !0;
    try {
      window.localStorage;
    } catch (t) {
      e = !1;
    }
    return e;
  }
  function g(e) {
    if (_()) return localStorage.getItem(e);
  }
  function y(e, t) {
    _() && localStorage.setItem(e, t);
  }
  function h() {
    var e = navigator.userAgent;
    for (var t in c) {
      var n,
        r = d(c[t]);
      try {
        for (r.s(); !(n = r.n()).done; ) {
          var i = n.value;
          if (e.indexOf(i) >= 0) return t;
        }
      } catch (e) {
        r.e(e);
      } finally {
        r.f();
      }
    }
  }
  function b() {
    var e = g(r) || "[]";
    return JSON.parse(e);
  }
  function m(e, t) {
    var n =
      arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "post";
    return fetch("".concat(s, "/").concat(e), {
      method: n,
      body: JSON.stringify(t),
      headers: { "Content-Type": "application/json" },
    });
  }
  function O() {
    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
      t = b();
    if (t.length) {
      var n = t.slice(0, 20);
      m(i, n)
        .then(function (e) {
          if (!e.ok) throw new Error("Error in Fetch");
          var t = b();
          t.splice(0, 20), y(r, JSON.stringify(t)), O();
        })
        .catch(function () {
          e && w();
        });
    }
  }
  function w() {
    p ||
      (p = setInterval(function () {
        b().length ? O() : clearInterval(p);
      }, 12e4));
  }
  const k = {
    uuid: function () {
      var e = new Date().getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (t) {
          var n = (e + 16 * Math.random()) % 16 | 0;
          return (
            (e = Math.floor(e / 16)), ("x" == t ? n : (3 & n) | 8).toString(16)
          );
        }
      );
    },
    epoch_milliseconds: function () {
      return Math.round(Date.now());
    },
    cookie_enabled: function () {
      return navigator.cookieEnabled;
    },
    set_cookie: function (e, t) {
      var n =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 365,
        r = "";
      if (n) {
        var i = new Date();
        i.setTime(i.getTime() + 24 * n * 60 * 60 * 1e3),
          (r = "; expires=" + i.toUTCString());
      }
      document.cookie = e + "=" + (t || "") + r + "; path=/";
    },
    get_cookie: function (e) {
      for (
        var t = e + "=", n = document.cookie.split(";"), r = 0;
        r < n.length;
        r++
      ) {
        for (var i = n[r]; " " == i.charAt(0); ) i = i.substring(1, i.length);
        if (0 == i.indexOf(t)) return i.substring(t.length, i.length);
      }
      return null;
    },
    remove_cookie: function (e) {
      document.cookie = e + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },
    local_storage_enabled: _,
    get_local_storage_item: g,
    set_local_storage_item: y,
    remove_local_storage_item: function (e) {
      _() && localStorage.removeItem(e);
    },
    get_parsed_local_store_data: function (e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = g(e);
      return n ? JSON.parse(n) : t;
    },
    browser: h,
    browser_version: function () {
      var e = navigator.userAgent,
        t = h(),
        n = u[t];
      if (n) {
        var r = e.match(n);
        if (r && r.length > 1) return r[1];
      }
    },
    os: function () {
      var e = navigator.userAgent;
      for (var t in l) if (e.indexOf(l[t]) >= 0) return t;
    },
    call_api: function (e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : i;
      return m(t, e).catch(function () {
        var t = b();
        null == t || t.push(e), y(r, JSON.stringify(t)), w();
      });
    },
    bulk_call_api: O,
    format_props: function (e, t) {
      var n;
      if (e instanceof Object) {
        n = {};
        for (var r = Object.keys(e), i = 0; i < r.length; i++) {
          var o = r[i];
          void 0 !== e[o] && (n[String(o)] = e[o]);
        }
      } else
        null != t &&
          (n = (function (e, t, n) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = n),
              e
            );
          })({}, String(e), t));
      return n;
    },
  };
  function x(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function S(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function j(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(e, r.key, r);
    }
  }
  const E = (function () {
    function e(t, n) {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      })(this, e),
        (this.env = t),
        (this.instance = n);
    }
    var t, n;
    return (
      (t = e),
      (n = [
        {
          key: "_call_indetity",
          value: function (e) {
            k.call_api(
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? x(Object(n), !0).forEach(function (t) {
                        S(e, t, n[t]);
                      })
                    : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(n)
                      )
                    : x(Object(n)).forEach(function (t) {
                        Object.defineProperty(
                          e,
                          t,
                          Object.getOwnPropertyDescriptor(n, t)
                        );
                      });
                }
                return e;
              })({ env: this.env, distinct_id: this.instance.distinct_id }, e)
            );
          },
        },
        {
          key: "set",
          value: function (e, t) {
            var n = k.format_props(e, t);
            n && this._call_indetity({ $set: n });
          },
        },
        {
          key: "set_once",
          value: function (e, t) {
            var n = k.format_props(e, t);
            n && this._call_indetity({ $set_once: n });
          },
        },
        {
          key: "increment",
          value: function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 1,
              n = k.format_props(e, t);
            if (n) {
              for (var r = Object.keys(n), i = 0; i < r.length; i++) {
                var o = r[i],
                  a = Number(n[o]);
                a || delete n[o];
              }
              this._call_indetity({ $add: n });
            }
          },
        },
        {
          key: "append",
          value: function (e, t) {
            var n = k.format_props(e, t);
            n && this._call_indetity({ $append: n });
          },
        },
        {
          key: "remove",
          value: function (e, t) {
            var n = k.format_props(e, t);
            n && this._call_indetity({ $remove: n });
          },
        },
        {
          key: "unset",
          value: function (e) {
            var t;
            if ("string" == typeof e) t = [String(e)];
            else {
              if (!(e instanceof Array)) return;
              t = e.map(function (e) {
                return String(e);
              });
            }
            this._call_indetity({ $unset: t });
          },
        },
        {
          key: "add_email",
          value: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : "";
            this.append("$email", e);
          },
        },
        {
          key: "remove_email",
          value: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : "";
            this.remove("$email", e);
          },
        },
        {
          key: "add_sms",
          value: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : "";
            this.append("$sms", e);
          },
        },
        {
          key: "add_whatsapp",
          value: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : "";
            this.append("$whatsapp", e);
          },
        },
      ]) && j(t.prototype, n),
      e
    );
  })();
  function P(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function $(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? P(Object(n), !0).forEach(function (t) {
            A(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : P(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function M(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(e, r.key, r);
    }
  }
  function A(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  var I;
  window.addEventListener("load", function () {
    p &&
      (clearTimeout(p),
      setTimeout(function () {
        k.bulk_call_api(!0);
      }, 2e3));
  }),
    window.addEventListener("online", function () {
      p &&
        (clearTimeout(p),
        setTimeout(function () {
          k.bulk_call_api(!0);
        }, 2e3));
    });
  var T = (function () {
    function e() {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      })(this, e);
    }
    var t, r, i;
    return (
      (t = e),
      (i = [
        {
          key: "setEnvProperties",
          value: function () {
            var e = k.get_local_storage_item(a);
            e || ((e = k.uuid()), k.set_local_storage_item(a, e)),
              (I.env_properties = {
                $os: k.os(),
                $browser: k.browser(),
                $browser_version: k.browser_version(),
                $sdk_type: "Browser",
                $device_id: e,
                $sdk_version: f,
              });
          },
        },
      ]),
      (r = [
        {
          key: "initialize",
          value: function (t) {
            var r = k.get_cookie(n);
            I || ((e.ENV_API_KEY = t), (I = {})),
              r || ((r = k.uuid()), k.set_cookie(n, r)),
              (I.distinct_id = r),
              (this.user = new E(e.ENV_API_KEY, I)),
              e.setEnvProperties();
          },
        },
        {
          key: "set_super_properties",
          value: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              t = k.get_parsed_local_store_data(o),
              n = $($({}, t), e);
            k.set_local_storage_item(o, JSON.stringify(n)),
              (I.env_properties = $($({}, I.env_properties), n));
          },
        },
        {
          key: "identify",
          value: function (t) {
            I._user_identified ||
              k
                .call_api({
                  env: e.ENV_API_KEY,
                  event: "$identify",
                  properties: { $identified_id: t, $anon_id: I.distinct_id },
                })
                .then(function (e) {
                  e.ok &&
                    (k.set_cookie(n, t),
                    (I.distinct_id = t),
                    (I._user_identified = !0));
                });
          },
        },
        {
          key: "track",
          value: function (t) {
            var n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            if (null != t) {
              var r = k.get_parsed_local_store_data(o),
                i = k.format_props(
                  $(
                    $($($({}, n), I.env_properties), r),
                    {},
                    { $current_url: window.location.href }
                  )
                );
              k.call_api({
                event: String(t),
                distinct_id: I.distinct_id,
                env: e.ENV_API_KEY,
                properties: i,
                $insert_id: k.uuid(),
                $time: k.epoch_milliseconds(),
              });
            }
          },
        },
        {
          key: "reset",
          value: function () {
            var t = k.uuid();
            k.set_cookie(n, t),
              (I = { distinct_id: t, _user_identified: !1 }),
              k.remove_local_storage_item(o),
              (this.user = new E(e.ENV_API_KEY, I)),
              e.setEnvProperties();
          },
        },
      ]) && M(t.prototype, r),
      i && M(t, i),
      e
    );
  })();
  A(T, "ENV_API_KEY", void 0);
  const N = new T();
  window.suprsend = t;
})();
