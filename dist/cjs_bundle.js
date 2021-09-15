!(function () {
  "use strict";
  var e = {
      d: function (t, r) {
        for (var n in r)
          e.o(r, n) &&
            !e.o(t, n) &&
            Object.defineProperty(t, n, { enumerable: !0, get: r[n] });
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
  var r = "_suprsend_dist_id",
    n = "bulk_api_call",
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
    l = {
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
    u = {
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
    var r =
      ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (!r) {
      if (
        Array.isArray(e) ||
        (r = (function (e, t) {
          if (e) {
            if ("string" == typeof e) return v(e, t);
            var r = Object.prototype.toString.call(e).slice(8, -1);
            return (
              "Object" === r && e.constructor && (r = e.constructor.name),
              "Map" === r || "Set" === r
                ? Array.from(e)
                : "Arguments" === r ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                ? v(e, t)
                : void 0
            );
          }
        })(e)) ||
        (t && e && "number" == typeof e.length)
      ) {
        r && (e = r);
        var n = 0,
          i = function () {};
        return {
          s: i,
          n: function () {
            return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
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
        r = r.call(e);
      },
      n: function () {
        var e = r.next();
        return (a = e.done), e;
      },
      e: function (e) {
        (c = !0), (o = e);
      },
      f: function () {
        try {
          a || null == r.return || r.return();
        } finally {
          if (c) throw o;
        }
      },
    };
  }
  function v(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
    return n;
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
      var r,
        n = d(c[t]);
      try {
        for (n.s(); !(r = n.n()).done; ) {
          var i = r.value;
          if (e.indexOf(i) >= 0) return t;
        }
      } catch (e) {
        n.e(e);
      } finally {
        n.f();
      }
    }
  }
  function b() {
    var e = g(n) || "[]";
    return JSON.parse(e);
  }
  function m(e, t) {
    var r =
      arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "post";
    return fetch("".concat(s, "/").concat(e), {
      method: r,
      body: JSON.stringify(t),
      headers: { "Content-Type": "application/json" },
    });
  }
  function O() {
    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
      t = b();
    if (t.length) {
      var r = t.slice(0, 20);
      m(i, r)
        .then(function (e) {
          if (!e.ok) throw new Error("Error in Fetch");
          var t = b();
          t.splice(0, 20), y(n, JSON.stringify(t)), O();
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
  const x = {
    uuid: function () {
      var e = new Date().getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (t) {
          var r = (e + 16 * Math.random()) % 16 | 0;
          return (
            (e = Math.floor(e / 16)), ("x" == t ? r : (3 & r) | 8).toString(16)
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
      var r =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 365,
        n = "";
      if (r) {
        var i = new Date();
        i.setTime(i.getTime() + 24 * r * 60 * 60 * 1e3),
          (n = "; expires=" + i.toUTCString());
      }
      document.cookie = e + "=" + (t || "") + n + "; path=/";
    },
    get_cookie: function (e) {
      for (
        var t = e + "=", r = document.cookie.split(";"), n = 0;
        n < r.length;
        n++
      ) {
        for (var i = r[n]; " " == i.charAt(0); ) i = i.substring(1, i.length);
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
        r = g(e);
      return r ? JSON.parse(r) : t;
    },
    browser: h,
    browser_version: function () {
      var e = navigator.userAgent,
        t = h(),
        r = l[t];
      if (r) {
        var n = e.match(r);
        if (n && n.length > 1) return n[1];
      }
    },
    os: function () {
      var e = navigator.userAgent;
      for (var t in u) if (e.indexOf(u[t]) >= 0) return t;
    },
    call_api: function (e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : i;
      return m(t, e).catch(function () {
        var t = b();
        null == t || t.push(e), y(n, JSON.stringify(t)), w();
      });
    },
    bulk_call_api: O,
    format_props: function (e, t) {
      var r;
      if (e instanceof Object) {
        r = {};
        for (var n = Object.keys(e), i = 0; i < n.length; i++) {
          var o = n[i];
          void 0 !== e[o] && (r[String(o)] = e[o]);
        }
      } else
        null != t &&
          (r = (function (e, t, r) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = r),
              e
            );
          })({}, String(e), t));
      return r;
    },
  };
  function k(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      t &&
        (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, n);
    }
    return r;
  }
  function j(e, t, r) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  function S(e, t) {
    for (var r = 0; r < t.length; r++) {
      var n = t[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(e, n.key, n);
    }
  }
  const P = (function () {
    function e(t, r) {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      })(this, e),
        (this.env = t),
        (this.instance = r);
    }
    var t, r;
    return (
      (t = e),
      (r = [
        {
          key: "_call_indetity",
          value: function (e) {
            x.call_api(
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var r = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? k(Object(r), !0).forEach(function (t) {
                        j(e, t, r[t]);
                      })
                    : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(r)
                      )
                    : k(Object(r)).forEach(function (t) {
                        Object.defineProperty(
                          e,
                          t,
                          Object.getOwnPropertyDescriptor(r, t)
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
            var r = x.format_props(e, t);
            r && this._call_indetity({ $set: r });
          },
        },
        {
          key: "set_once",
          value: function (e, t) {
            var r = x.format_props(e, t);
            r && this._call_indetity({ $set_once: r });
          },
        },
        {
          key: "increment",
          value: function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 1,
              r = x.format_props(e, t);
            if (r) {
              for (var n = Object.keys(r), i = 0; i < n.length; i++) {
                var o = n[i],
                  a = Number(r[o]);
                a || delete r[o];
              }
              this._call_indetity({ $add: r });
            }
          },
        },
        {
          key: "append",
          value: function (e, t) {
            var r = x.format_props(e, t);
            r && this._call_indetity({ $append: r });
          },
        },
        {
          key: "remove",
          value: function (e, t) {
            var r = x.format_props(e, t);
            r && this._call_indetity({ $remove: r });
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
      ]) && S(t.prototype, r),
      e
    );
  })();
  function E(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      t &&
        (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, n);
    }
    return r;
  }
  function M(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? E(Object(r), !0).forEach(function (t) {
            A(e, t, r[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : E(Object(r)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
          });
    }
    return e;
  }
  function $(e, t) {
    for (var r = 0; r < t.length; r++) {
      var n = t[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(e, n.key, n);
    }
  }
  function A(e, t, r) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  var I;
  window.addEventListener("load", function () {
    p &&
      (clearTimeout(p),
      setTimeout(function () {
        x.bulk_call_api(!0);
      }, 2e3));
  }),
    window.addEventListener("online", function () {
      p &&
        (clearTimeout(p),
        setTimeout(function () {
          x.bulk_call_api(!0);
        }, 2e3));
    });
  var T = (function () {
    function e() {
      !(function (e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      })(this, e);
    }
    var t, n, i;
    return (
      (t = e),
      (i = [
        {
          key: "setEnvProperties",
          value: function () {
            var e = x.get_local_storage_item(a);
            e || ((e = x.uuid()), x.set_local_storage_item(a, e)),
              (I.env_properties = {
                $os: x.os(),
                $browser: x.browser(),
                $browser_version: x.browser_version(),
                $sdk_type: "Browser",
                $device_id: e,
                $sdk_version: f,
              });
          },
        },
      ]),
      (n = [
        {
          key: "initialize",
          value: function (t) {
            var n = x.get_cookie(r);
            I || ((e.ENV_API_KEY = t), (I = {})),
              n || ((n = x.uuid()), x.set_cookie(r, n)),
              (I.distinct_id = n),
              (this.user = new P(e.ENV_API_KEY, I)),
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
              t = x.get_parsed_local_store_data(o),
              r = M(M({}, t), e);
            x.set_local_storage_item(o, JSON.stringify(r)),
              (I.env_properties = M(M({}, I.env_properties), r));
          },
        },
        {
          key: "identify",
          value: function (t) {
            I._user_identified ||
              x
                .call_api({
                  env: e.ENV_API_KEY,
                  event: "$identify",
                  properties: { $identified_id: t, $anon_id: I.distinct_id },
                })
                .then(function (e) {
                  e.ok &&
                    (x.set_cookie(r, t),
                    (I.distinct_id = t),
                    (I._user_identified = !0));
                });
          },
        },
        {
          key: "track",
          value: function (t) {
            var r =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            if (null != t) {
              var n = x.get_parsed_local_store_data(o),
                i = x.format_props(
                  M(
                    M(M(M({}, r), I.env_properties), n),
                    {},
                    { $current_url: window.location.href }
                  )
                );
              x.call_api({
                event: String(t),
                distinct_id: I.distinct_id,
                env: e.ENV_API_KEY,
                properties: i,
                $insert_id: x.uuid(),
                $time: x.epoch_milliseconds(),
              });
            }
          },
        },
        {
          key: "reset",
          value: function () {
            var t = x.uuid();
            x.set_cookie(r, t),
              (I = { distinct_id: t, _user_identified: !1 }),
              x.remove_local_storage_item(o),
              (this.user = new P(e.ENV_API_KEY, I)),
              e.setEnvProperties();
          },
        },
      ]) && $(t.prototype, n),
      i && $(t, i),
      e
    );
  })();
  A(T, "ENV_API_KEY", void 0);
  const N = new T();
  var C = exports;
  for (var D in t) C[D] = t[D];
  t.__esModule && Object.defineProperty(C, "__esModule", { value: !0 });
})();
