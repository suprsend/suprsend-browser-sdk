!function(){"use strict";var e={d:function(n,r){for(var t in r)e.o(r,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:r[t]})},o:function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r:function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:function(){return V}});var r="_suprsend_dist_id",t="bulk_api_call",i="event/",o={Edge:["Edge"],"Opera Mini":["Opera Mini"],"Opera Mobile":["Opera Mobi"],Opera:["Opera"],"Internet Explorer":["Trident","MSIE"],Chrome:["Chrome"],Firefox:["Firefox"],Safari:["Safari"],Mozilla:["Mozilla"]},a={Edge:/Edge\/([0-9]+(\.[0-9]+)?)/,"Opera Mini":/Opera Mini\/([0-9]+(\.[0-9]+)?)/,"Opera Mobile":/Version\/([0-9]+(\.[0-9]+)?)/,Opera:/Version\/([0-9]+(\.[0-9]+)?)/,"Internet Explorer":"rv:",Chrome:/Chrome\/([0-9]+(\.[0-9]+)?)/,Firefox:/rv:([0-9]+(\.[0-9]+)?)/,Safari:/Version\/([0-9]+(\.[0-9]+)?)/,Mozilla:/rv:([0-9]+(\.[0-9]+)?)/},u={"Chrome OS":"CrOS","Mac OS":"Macintosh",Windows:"Windows",iOS:"like Mac",Android:"Android",Linux:"Linux"};const c="https://collector.suprsend.workers.dev",s="1.0.0",l="suprsend_service_worker.js";function f(e,n){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,n){if(e){if("string"==typeof e)return p(e,n);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?p(e,n):void 0}}(e))||n&&e&&"number"==typeof e.length){r&&(e=r);var t=0,i=function(){};return{s:i,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,u=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){u=!0,o=e},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw o}}}}function p(e,n){(null==n||n>e.length)&&(n=e.length);for(var r=0,t=new Array(n);r<n;r++)t[r]=e[r];return t}var v;function d(e,n){localStorage.setItem(e,n)}function h(){var e=navigator.userAgent;for(var n in o){var r,t=f(o[n]);try{for(t.s();!(r=t.n()).done;){var i=r.value;if(e.indexOf(i)>=0)return n}}catch(e){t.e(e)}finally{t.f()}}}function b(){var e=(t,localStorage.getItem("bulk_api_call")||"[]");return JSON.parse(e)}function _(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return fetch("".concat(c,"/").concat(e),{method:r,body:JSON.stringify(n),headers:{"Content-Type":"application/json"}})}function g(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=b();if(n.length){var r=n.slice(0,20);_(i,r).then((function(e){if(!e.ok)throw new Error("Error in Fetch");var n=b();n.splice(0,20),d(t,JSON.stringify(n)),g()})).catch((function(){e&&y()}))}}function y(){v||(v=setInterval((function(){b().length?g():clearInterval(v)}),12e4))}const m={uuid:function(){var e=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(n){var r=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==n?r:3&r|8).toString(16)}))},epoch_milliseconds:function(){return Math.round(Date.now())},cookie_enabled:function(){return navigator.cookieEnabled},set_cookie:function(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:365,t="";if(r){var i=new Date;i.setTime(i.getTime()+24*r*60*60*1e3),t="; expires="+i.toUTCString()}document.cookie=e+"="+(n||"")+t+"; path=/"},get_cookie:function(e){for(var n=e+"=",r=document.cookie.split(";"),t=0;t<r.length;t++){for(var i=r[t];" "==i.charAt(0);)i=i.substring(1,i.length);if(0==i.indexOf(n))return i.substring(n.length,i.length)}return null},remove_cookie:function(e){document.cookie=e+"=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"},browser:h,browser_version:function(){var e=navigator.userAgent,n=h(),r=a[n];if(r){var t=e.match(r);if(t&&t.length>1)return t[1]}},os:function(){var e=navigator.userAgent;for(var n in u)if(e.indexOf(u[n])>=0)return n},call_api:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i;return _(n,e).catch((function(){var n=b();null==n||n.push(e),d(t,JSON.stringify(n)),y()}))},bulk_call_api:g,format_props:function(e,n){var r;if(e instanceof Object){r={};for(var t=Object.keys(e),i=0;i<t.length;i++){var o=t[i];void 0!==e[o]&&(r[String(o)]=e[o])}}else null!=n&&(r=function(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}({},String(e),n));return r},urlB64ToUint8Array:function(e){for(var n=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),t=new Uint8Array(r.length),i=0;i<r.length;++i)t[i]=r.charCodeAt(i);return t}};function w(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function O(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function k(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}const x=function(){function e(n,r){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.env=n,this.instance=r}var n,r;return n=e,(r=[{key:"_call_indetity",value:function(e){m.call_api(function(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?w(Object(r),!0).forEach((function(n){O(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):w(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}({env:this.env,distinct_id:this.instance.distinct_id},e))}},{key:"set",value:function(e,n){var r=m.format_props(e,n);r&&this._call_indetity({$set:r})}},{key:"set_once",value:function(e,n){var r=m.format_props(e,n);r&&this._call_indetity({$set_once:r})}},{key:"increment",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=m.format_props(e,n);if(r){for(var t=Object.keys(r),i=0;i<t.length;i++){var o=t[i],a=Number(r[o]);a||delete r[o]}this._call_indetity({$add:r})}}},{key:"append",value:function(e,n){var r=m.format_props(e,n);r&&this._call_indetity({$append:r})}},{key:"remove",value:function(e,n){var r=m.format_props(e,n);r&&this._call_indetity({$remove:r})}},{key:"unset",value:function(e){var n;if("string"==typeof e)n=[String(e)];else{if(!(e instanceof Array))return;n=e.map((function(e){return String(e)}))}this._call_indetity({$unset:n})}},{key:"add_email",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.append("$email",e)}},{key:"remove_email",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.remove("$email",e)}},{key:"add_sms",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.append("$sms",e)}},{key:"add_whatsapp",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.append("$whatsapp",e)}}])&&k(n.prototype,r),e}();function P(e,n,r,t,i,o,a){try{var u=e[o](a),c=u.value}catch(e){return void r(e)}u.done?n(c):Promise.resolve(c).then(t,i)}function j(e){return function(){var n=this,r=arguments;return new Promise((function(t,i){var o=e.apply(n,r);function a(e){P(o,t,i,a,u,"next",e)}function u(e){P(o,t,i,a,u,"throw",e)}a(void 0)}))}}function E(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function S(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}const A=function(){function e(n,r){var t=this;!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),S(this,"_check_push_support",(function(){return!(!("serviceWorker"in navigator)||!("PushManager"in window))})),S(this,"_ask_notification_permission",j(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Notification.requestPermission();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))),S(this,"_register_sw",(function(){return navigator.serviceWorker.register("/".concat(l)).then((function(e){console.log("Service worker successfully registered."),t._subscribe_push(e)})).catch((function(e){console.error("Unable to register service worker.",e)}))})),S(this,"_get_subscription",(function(){return navigator.serviceWorker.ready.then((function(e){return e.pushManager.getSubscription()})).then(function(){var e=j(regeneratorRuntime.mark((function e(n){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n){e.next=3;break}return console.log("No subscription"),e.abrupt("return");case 3:return e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}())})),S(this,"_subscribe_push",function(){var e=j(regeneratorRuntime.mark((function e(n){var r,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t._ask_notification_permission();case 2:if("granted"!==e.sent){e.next=17;break}return e.next=6,t._get_subscription();case 6:if(e.sent){e.next=16;break}return console.log("API_CALL: get public vapid from server"),r=m.urlB64ToUint8Array("BADMgGsRZWdjJPH34F0v9OTQfrxHArhk_sVawIACOFHTcaPF_Cfpq1uBX6lOwHByQDjt8f05h3ESK3dldpG3Q9Q"),e.next=12,n.pushManager.subscribe({applicationServerKey:r,userVisibleOnly:!0});case 12:i=e.sent,console.log("API_CALL: save subscription",i),e.next=17;break;case 16:console.log("Push already subscribed");case 17:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),S(this,"register_push",(function(){t._check_push_support()?t._register_sw():console.log("OOPS, Web Push isn't supported")})),S(this,"is_subscribed",j(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t._get_subscription();case 2:return n=e.sent,e.abrupt("return",!!n);case 4:case"end":return e.stop()}}),e)})))),S(this,"unsubscribe_push",(function(){navigator.serviceWorker.ready.then((function(e){return e.pushManager.getSubscription()})).then((function(e){return e.unsubscribe().then((function(){console.log("API_CALL: unsubscription")}))}))})),this.env=n,this.instance=r}var n,r,t;return n=e,null,(r=[{key:"update_subscription",value:(t=j(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:navigator.serviceWorker.ready.then((function(e){return e.pushManager.getSubscription()})).then(function(){var e=j(regeneratorRuntime.mark((function e(n){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n){e.next=3;break}return console.log("No subscription"),e.abrupt("return");case 3:console.log("API_CALL: save subscription",n);case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}}),e)}))),function(){return t.apply(this,arguments)})}])&&E(n,r),e}();function M(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function I(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?M(Object(r),!0).forEach((function(n){$(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):M(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function T(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function $(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}var C;window.addEventListener("load",(function(){setTimeout((function(){N.ENV_API_KEY&&A.update_subscription()}),3e4),v&&(clearTimeout(v),setTimeout((function(){m.bulk_call_api(!0)}),2e3))})),window.addEventListener("online",(function(){v&&(clearTimeout(v),setTimeout((function(){m.bulk_call_api(!0)}),2e3))}));var N=function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e)}var n,t,i;return n=e,i=[{key:"setEnvProperties",value:function(){C.env_properties={$os:m.os(),$browser:m.browser(),$browser_version:m.browser_version(),$sdk_type:"Browser",$sdk_version:s}}}],(t=[{key:"initialize",value:function(n){var t=m.get_cookie(r);C||(e.ENV_API_KEY=n,C={}),t||(t=m.uuid(),m.set_cookie(r,t)),C.distinct_id=t,this.user=new x(e.ENV_API_KEY,C),this.sw=new A(e.ENV_API_KEY,C),e.setEnvProperties()}},{key:"identify",value:function(n){C._user_identified||m.call_api({env:e.ENV_API_KEY,event:"$identify",properties:{$identified_id:n,$anon_id:C.distinct_id}}).then((function(e){e.ok&&(m.set_cookie(r,n),C.distinct_id=n,C._user_identified=!0)}))}},{key:"track",value:function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(null!=n){var t=m.format_props(I(I(I({},r),C.env_properties),{},{current_url:window.location.href}));m.call_api({event:String(n),distinct_id:C.distinct_id,env:e.ENV_API_KEY,properties:t,$insert_id:m.uuid(),$time:m.epoch_milliseconds()})}}},{key:"reset",value:function(){var n=m.uuid();m.set_cookie(r,n),C={distinct_id:n,_user_identified:!1},this.user=new x(e.ENV_API_KEY,C),this.sw=new A(e.ENV_API_KEY,C),e.setEnvProperties()}}])&&T(n.prototype,t),i&&T(n,i),e}();$(N,"ENV_API_KEY",void 0);const V=new N;window.suprsend=n}();