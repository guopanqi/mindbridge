(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/dingtalk-jsapi/lib/sdk/sdkLib.js
  var require_sdkLib = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/sdkLib.js"(exports) {
      "use strict";
      function isFunction(o) {
        return "function" == typeof o;
      }
      function compareVersion(o, n) {
        function t(o2) {
          return parseInt(o2, 10) || 0;
        }
        for (var r = o.split(".").map(t), e = n.split(".").map(t), E = 0; E < r.length; E++) {
          if (void 0 === e[E]) return false;
          if (r[E] < e[E]) return false;
          if (r[E] > e[E]) return true;
        }
        return true;
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.LogLevel = exports.APP_TYPE = exports.ENV_ENUM_SUB = exports.ENV_ENUM = exports.ERROR_CODE = exports.compareVersion = exports.isFunction = void 0, exports.isFunction = isFunction, exports.compareVersion = compareVersion;
      var ERROR_CODE;
      !(function(o) {
        o.cancel = "-1", o.not_exist = "1", o.no_permission = "7";
      })(ERROR_CODE = exports.ERROR_CODE || (exports.ERROR_CODE = {}));
      var ENV_ENUM;
      !(function(o) {
        o.pc = "pc", o.android = "android", o.ios = "ios", o.gdtPc = "gdtPc", o.gdtAndroid = "gdtAndroid", o.gdtIos = "gdtIos", o.gdtStandardAndroid = "gdtStandardAndroid", o.gdtStandardIos = "gdtStandardIos", o.notInDingTalk = "notInDingTalk", o.windows = "windows", o.mac = "mac", o.harmony = "harmony";
      })(ENV_ENUM = exports.ENV_ENUM || (exports.ENV_ENUM = {}));
      var ENV_ENUM_SUB;
      !(function(o) {
        o.mac = "mac", o.win = "win", o.noSub = "noSub";
      })(ENV_ENUM_SUB = exports.ENV_ENUM_SUB || (exports.ENV_ENUM_SUB = {}));
      var APP_TYPE;
      !(function(o) {
        o.WEB = "WEB", o.MINI_APP = "MINI_APP", o.WEEX = "WEEX", o.WEBVIEW_IN_MINIAPP = "WEBVIEW_IN_MINIAPP", o.WEEX_WIDGET = "WEEX_WIDGET";
      })(APP_TYPE = exports.APP_TYPE || (exports.APP_TYPE = {}));
      var LogLevel;
      !(function(o) {
        o[o.INFO = 1] = "INFO", o[o.WARNING = 2] = "WARNING", o[o.ERROR = 3] = "ERROR";
      })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/middlewares/bridge.js
  var require_bridge = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/middlewares/bridge.js"(exports) {
      "use strict";
      function bridge(e) {
        return __awaiter(this, void 0, void 0, function() {
          var t, n, r, o;
          return __generator(this, function(i) {
            return t = e.invokeName, n = e.method, r = e.callParams, o = e.JSBridge, o ? [2, o(t || n, r)] : [2, this.bridgeInitFn().then(function(e2) {
              return e2(t || n, r);
            })];
          });
        });
      }
      var __awaiter = exports && exports.__awaiter || function(e, t, n, r) {
        function o(e2) {
          return e2 instanceof n ? e2 : new n(function(t2) {
            t2(e2);
          });
        }
        return new (n || (n = Promise))(function(n2, i) {
          function a(e2) {
            try {
              c(r.next(e2));
            } catch (e3) {
              i(e3);
            }
          }
          function u(e2) {
            try {
              c(r.throw(e2));
            } catch (e3) {
              i(e3);
            }
          }
          function c(e2) {
            e2.done ? n2(e2.value) : o(e2.value).then(a, u);
          }
          c((r = r.apply(e, t || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(e, t) {
        function n(e2) {
          return function(t2) {
            return r([e2, t2]);
          };
        }
        function r(n2) {
          if (o) throw new TypeError("Generator is already executing.");
          for (; c; ) try {
            if (o = 1, i && (a = 2 & n2[0] ? i.return : n2[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, n2[1])).done) return a;
            switch (i = 0, a && (n2 = [2 & n2[0], a.value]), n2[0]) {
              case 0:
              case 1:
                a = n2;
                break;
              case 4:
                return c.label++, { value: n2[1], done: false };
              case 5:
                c.label++, i = n2[1], n2 = [0];
                continue;
              case 7:
                n2 = c.ops.pop(), c.trys.pop();
                continue;
              default:
                if (a = c.trys, !(a = a.length > 0 && a[a.length - 1]) && (6 === n2[0] || 2 === n2[0])) {
                  c = 0;
                  continue;
                }
                if (3 === n2[0] && (!a || n2[1] > a[0] && n2[1] < a[3])) {
                  c.label = n2[1];
                  break;
                }
                if (6 === n2[0] && c.label < a[1]) {
                  c.label = a[1], a = n2;
                  break;
                }
                if (a && c.label < a[2]) {
                  c.label = a[2], c.ops.push(n2);
                  break;
                }
                a[2] && c.ops.pop(), c.trys.pop();
                continue;
            }
            n2 = t.call(e, c);
          } catch (e2) {
            n2 = [6, e2], i = 0;
          } finally {
            o = a = 0;
          }
          if (5 & n2[0]) throw n2[1];
          return { value: n2[0] ? n2[1] : void 0, done: true };
        }
        var o, i, a, u, c = { label: 0, sent: function() {
          if (1 & a[0]) throw a[1];
          return a[1];
        }, trys: [], ops: [] };
        return u = { next: n(0), throw: n(1), return: n(2) }, "function" == typeof Symbol && (u[Symbol.iterator] = function() {
          return this;
        }), u;
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.bridge = void 0, exports.bridge = bridge;
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/middlewares/retry.js
  var require_retry = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/middlewares/retry.js"(exports) {
      "use strict";
      function retry(e, t) {
        return __awaiter(this, void 0, void 0, function() {
          var r, n, i, o, s, a, u, c, f, l, h;
          return __generator(this, function(p) {
            switch (p.label) {
              case 0:
                return p.trys.push([0, 2, , 3]), [4, t()];
              case 1:
                return [2, p.sent()];
              case 2:
                return r = p.sent(), n = e.method, i = e.isAuthApi, o = e.apiConfig, s = this.hadConfig && void 0 === this.isReady && -1 !== this.configJsApiList.indexOf(n), a = "object" == typeof r && "string" == typeof r.errorCode && r.errorCode === sdkLib_1.ERROR_CODE.no_permission, u = "object" == typeof r && "string" == typeof r.errorCode && r.errorCode === sdkLib_1.ERROR_CODE.cancel, c = __1.getTargetApiConfigVS(o, this.env), f = c && this.env.version && sdkLib_1.compareVersion(this.env.version, c), l = (this.env.platform === sdkLib_1.ENV_ENUM.ios || this.env.platform === sdkLib_1.ENV_ENUM.android) && s && a, h = this.env.platform === sdkLib_1.ENV_ENUM.pc && s && (f && !u && i || a), l || h ? [2, this.config$.then(function() {
                  return t();
                })] : [2, Promise.reject(r)];
              case 3:
                return [2];
            }
          });
        });
      }
      var __awaiter = exports && exports.__awaiter || function(e, t, r, n) {
        function i(e2) {
          return e2 instanceof r ? e2 : new r(function(t2) {
            t2(e2);
          });
        }
        return new (r || (r = Promise))(function(r2, o) {
          function s(e2) {
            try {
              u(n.next(e2));
            } catch (e3) {
              o(e3);
            }
          }
          function a(e2) {
            try {
              u(n.throw(e2));
            } catch (e3) {
              o(e3);
            }
          }
          function u(e2) {
            e2.done ? r2(e2.value) : i(e2.value).then(s, a);
          }
          u((n = n.apply(e, t || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(e, t) {
        function r(e2) {
          return function(t2) {
            return n([e2, t2]);
          };
        }
        function n(r2) {
          if (i) throw new TypeError("Generator is already executing.");
          for (; u; ) try {
            if (i = 1, o && (s = 2 & r2[0] ? o.return : r2[0] ? o.throw || ((s = o.return) && s.call(o), 0) : o.next) && !(s = s.call(o, r2[1])).done) return s;
            switch (o = 0, s && (r2 = [2 & r2[0], s.value]), r2[0]) {
              case 0:
              case 1:
                s = r2;
                break;
              case 4:
                return u.label++, { value: r2[1], done: false };
              case 5:
                u.label++, o = r2[1], r2 = [0];
                continue;
              case 7:
                r2 = u.ops.pop(), u.trys.pop();
                continue;
              default:
                if (s = u.trys, !(s = s.length > 0 && s[s.length - 1]) && (6 === r2[0] || 2 === r2[0])) {
                  u = 0;
                  continue;
                }
                if (3 === r2[0] && (!s || r2[1] > s[0] && r2[1] < s[3])) {
                  u.label = r2[1];
                  break;
                }
                if (6 === r2[0] && u.label < s[1]) {
                  u.label = s[1], s = r2;
                  break;
                }
                if (s && u.label < s[2]) {
                  u.label = s[2], u.ops.push(r2);
                  break;
                }
                s[2] && u.ops.pop(), u.trys.pop();
                continue;
            }
            r2 = t.call(e, u);
          } catch (e2) {
            r2 = [6, e2], o = 0;
          } finally {
            i = s = 0;
          }
          if (5 & r2[0]) throw r2[1];
          return { value: r2[0] ? r2[1] : void 0, done: true };
        }
        var i, o, s, a, u = { label: 0, sent: function() {
          if (1 & s[0]) throw s[1];
          return s[1];
        }, trys: [], ops: [] };
        return a = { next: r(0), throw: r(1), return: r(2) }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
          return this;
        }), a;
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.retry = void 0;
      var __1 = require_sdk();
      var sdkLib_1 = require_sdkLib();
      exports.retry = retry;
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/middlewares/dealParamsAndResult.js
  var require_dealParamsAndResult = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/middlewares/dealParamsAndResult.js"(exports) {
      "use strict";
      function dealParamsAndResult(e, n) {
        return __awaiter(this, void 0, void 0, function() {
          var t, r, i, a, s, o, u, c, l, f = this;
          return __generator(this, function(d) {
            switch (d.label) {
              case 0:
                return t = e.method, r = e.params, i = e.apiConfig, a = this.devConfig.forceEnableDealApiFnMap && this.devConfig.forceEnableDealApiFnMap[t] && true === this.devConfig.forceEnableDealApiFnMap[t](r), s = !a && (true === this.devConfig.isDisableDeal || this.devConfig.disbaleDealApiWhiteList && -1 !== this.devConfig.disbaleDealApiWhiteList.indexOf(t)), o = {}, !s && i && i.paramsDeal && sdkLib_1.isFunction(i.paramsDeal) ? [4, i.paramsDeal(r)] : [3, 2];
              case 1:
                return o = d.sent(), [3, 3];
              case 2:
                o = Object.assign({}, r), d.label = 3;
              case 3:
                return u = function(e2) {
                  return __awaiter(f, void 0, void 0, function() {
                    return __generator(this, function(n2) {
                      return !s && i && i.resultDeal && sdkLib_1.isFunction(i.resultDeal) ? [2, i.resultDeal(e2)] : [2, e2];
                    });
                  });
                }, sdkLib_1.isFunction(o.onSuccess) && (c = o.onSuccess, o.onSuccess = function(e2) {
                  return __awaiter(f, void 0, void 0, function() {
                    var n2;
                    return __generator(this, function(t2) {
                      switch (t2.label) {
                        case 0:
                          return n2 = c, [4, u(e2)];
                        case 1:
                          return n2.apply(void 0, [t2.sent()]), [2];
                      }
                    });
                  });
                }), sdkLib_1.isFunction(o.success) && (l = o.success, o.success = function(e2) {
                  return __awaiter(f, void 0, void 0, function() {
                    var n2;
                    return __generator(this, function(t2) {
                      switch (t2.label) {
                        case 0:
                          return n2 = l, [4, u(e2)];
                        case 1:
                          return n2.apply(void 0, [t2.sent()]), [2];
                      }
                    });
                  });
                }), Object.assign(e, { callParams: o, invokeName: null === i || void 0 === i ? void 0 : i.invokeName }), [2, n().then(u)];
            }
          });
        });
      }
      var __awaiter = exports && exports.__awaiter || function(e, n, t, r) {
        function i(e2) {
          return e2 instanceof t ? e2 : new t(function(n2) {
            n2(e2);
          });
        }
        return new (t || (t = Promise))(function(t2, a) {
          function s(e2) {
            try {
              u(r.next(e2));
            } catch (e3) {
              a(e3);
            }
          }
          function o(e2) {
            try {
              u(r.throw(e2));
            } catch (e3) {
              a(e3);
            }
          }
          function u(e2) {
            e2.done ? t2(e2.value) : i(e2.value).then(s, o);
          }
          u((r = r.apply(e, n || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(e, n) {
        function t(e2) {
          return function(n2) {
            return r([e2, n2]);
          };
        }
        function r(t2) {
          if (i) throw new TypeError("Generator is already executing.");
          for (; u; ) try {
            if (i = 1, a && (s = 2 & t2[0] ? a.return : t2[0] ? a.throw || ((s = a.return) && s.call(a), 0) : a.next) && !(s = s.call(a, t2[1])).done) return s;
            switch (a = 0, s && (t2 = [2 & t2[0], s.value]), t2[0]) {
              case 0:
              case 1:
                s = t2;
                break;
              case 4:
                return u.label++, { value: t2[1], done: false };
              case 5:
                u.label++, a = t2[1], t2 = [0];
                continue;
              case 7:
                t2 = u.ops.pop(), u.trys.pop();
                continue;
              default:
                if (s = u.trys, !(s = s.length > 0 && s[s.length - 1]) && (6 === t2[0] || 2 === t2[0])) {
                  u = 0;
                  continue;
                }
                if (3 === t2[0] && (!s || t2[1] > s[0] && t2[1] < s[3])) {
                  u.label = t2[1];
                  break;
                }
                if (6 === t2[0] && u.label < s[1]) {
                  u.label = s[1], s = t2;
                  break;
                }
                if (s && u.label < s[2]) {
                  u.label = s[2], u.ops.push(t2);
                  break;
                }
                s[2] && u.ops.pop(), u.trys.pop();
                continue;
            }
            t2 = n.call(e, u);
          } catch (e2) {
            t2 = [6, e2], a = 0;
          } finally {
            i = s = 0;
          }
          if (5 & t2[0]) throw t2[1];
          return { value: t2[0] ? t2[1] : void 0, done: true };
        }
        var i, a, s, o, u = { label: 0, sent: function() {
          if (1 & s[0]) throw s[1];
          return s[1];
        }, trys: [], ops: [] };
        return o = { next: t(0), throw: t(1), return: t(2) }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
          return this;
        }), o;
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.dealParamsAndResult = void 0;
      var sdkLib_1 = require_sdkLib();
      exports.dealParamsAndResult = dealParamsAndResult;
    }
  });

  // node_modules/dingtalk-jsapi/lib/log.js
  var require_log = __commonJS({
    "node_modules/dingtalk-jsapi/lib/log.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.formatLog = exports.diagnosticMessageMap = exports.LogLevel = void 0;
      var LogLevel;
      !(function(e) {
        e.INFO = "INFO", e.WARN = "WARN", e.ERROR = "ERROR";
      })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
      var diagLog = function(e, o, r, t) {
        return void 0 === t && (t = void 0), { code: e, category: o, message: r, solution: t };
      };
      exports.diagnosticMessageMap = { config_debug_deprecated: diagLog(1010, LogLevel.WARN, "This is a deprecated feature (dd.debug - debug:true), recommend use dd.devConfig"), dd_config_wrap_deprecated: diagLog(1020, LogLevel.WARN, "You don 't use a dd.config, so you don't need to wrap dd.ready, recommend remove dd.ready"), not_support_event_on: diagLog(1030, LogLevel.WARN, `"event.on" do not support the current platform ('{0}')`), not_support_event_off: diagLog(1040, LogLevel.WARN, `"event.off" do not support the current platform ('{0}')`), repeat_config: diagLog(1040, LogLevel.WARN, "dd.config has been executed, please don't repeat config"), JsBridge_init_fail: diagLog(5010, LogLevel.ERROR, "JsBridge initialization fails, jsapi will not work"), auto_bridge_init_error: diagLog(5020, LogLevel.ERROR, "auto bridgeInit error"), JsBridge_init_fail_dd_config: diagLog(5010, LogLevel.ERROR, 'JsBridge initialization failed and "dd.config" failed to call'), not_support_env: diagLog(4040, LogLevel.ERROR, "Do not support the current environment\uFF1A'{0}'"), call_api_support_platform_error: diagLog(4050, LogLevel.ERROR, "'{0}' do not support the current platform ('{1}')"), call_api_config_platform_error: diagLog(4060, LogLevel.ERROR, "This API method is not configured for the platform ('{0}')"), call_api_on_before_error: diagLog(4060, LogLevel.ERROR, "Call Hook:onBeforeInvokeAPI failed , reason: '{0}'"), call_api_on_after_error: diagLog(4060, LogLevel.ERROR, "Call Hook:onAfterInvokeAPI failed , reason: '{0}'") }, exports.formatLog = function(e) {
        for (var o, r = [], t = 1; t < arguments.length; t++) r[t - 1] = arguments[t];
        var i = "[DINGTALK-JSAPI] " + e.category + " " + e.code + ": " + e.message.replace(/{(\d)}/g, function(e2, o2) {
          return r[o2] || e2;
        });
        return "object" == typeof process && "production" !== (null === (o = null === process || void 0 === process ? void 0 : process.env) || void 0 === o ? void 0 : o.NODE_ENV) && console.warn(i), i;
      };
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/middlewares/checkConfig.js
  var require_checkConfig = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/middlewares/checkConfig.js"(exports) {
      "use strict";
      function checkConfig(e, r) {
        return __awaiter(this, void 0, void 0, function() {
          var t, o, n, i, a, a;
          return __generator(this, function(c) {
            return false === this.devConfig.isAuthApi && (e.isAuthApi = false), t = e.isAuthApi, o = e.method, n = this.invokeAPIConfigMapByMethod[o], n || !t ? (i = void 0, n && (i = n[this.env.platform]), e.apiConfig = i, i || !t ? [2, r()] : (a = log_1.formatLog(log_1.diagnosticMessageMap.call_api_support_platform_error, o, this.env.platform), [2, Promise.reject({ errorCode: log_1.diagnosticMessageMap.call_api_support_platform_error.code, errorMessage: a })])) : (a = log_1.formatLog(log_1.diagnosticMessageMap.call_api_config_platform_error, this.env.platform), [2, Promise.reject({ errorCode: log_1.diagnosticMessageMap.call_api_config_platform_error.code, errorMessage: a })]);
          });
        });
      }
      var __awaiter = exports && exports.__awaiter || function(e, r, t, o) {
        function n(e2) {
          return e2 instanceof t ? e2 : new t(function(r2) {
            r2(e2);
          });
        }
        return new (t || (t = Promise))(function(t2, i) {
          function a(e2) {
            try {
              l(o.next(e2));
            } catch (e3) {
              i(e3);
            }
          }
          function c(e2) {
            try {
              l(o.throw(e2));
            } catch (e3) {
              i(e3);
            }
          }
          function l(e2) {
            e2.done ? t2(e2.value) : n(e2.value).then(a, c);
          }
          l((o = o.apply(e, r || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(e, r) {
        function t(e2) {
          return function(r2) {
            return o([e2, r2]);
          };
        }
        function o(t2) {
          if (n) throw new TypeError("Generator is already executing.");
          for (; l; ) try {
            if (n = 1, i && (a = 2 & t2[0] ? i.return : t2[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, t2[1])).done) return a;
            switch (i = 0, a && (t2 = [2 & t2[0], a.value]), t2[0]) {
              case 0:
              case 1:
                a = t2;
                break;
              case 4:
                return l.label++, { value: t2[1], done: false };
              case 5:
                l.label++, i = t2[1], t2 = [0];
                continue;
              case 7:
                t2 = l.ops.pop(), l.trys.pop();
                continue;
              default:
                if (a = l.trys, !(a = a.length > 0 && a[a.length - 1]) && (6 === t2[0] || 2 === t2[0])) {
                  l = 0;
                  continue;
                }
                if (3 === t2[0] && (!a || t2[1] > a[0] && t2[1] < a[3])) {
                  l.label = t2[1];
                  break;
                }
                if (6 === t2[0] && l.label < a[1]) {
                  l.label = a[1], a = t2;
                  break;
                }
                if (a && l.label < a[2]) {
                  l.label = a[2], l.ops.push(t2);
                  break;
                }
                a[2] && l.ops.pop(), l.trys.pop();
                continue;
            }
            t2 = r.call(e, l);
          } catch (e2) {
            t2 = [6, e2], i = 0;
          } finally {
            n = a = 0;
          }
          if (5 & t2[0]) throw t2[1];
          return { value: t2[0] ? t2[1] : void 0, done: true };
        }
        var n, i, a, c, l = { label: 0, sent: function() {
          if (1 & a[0]) throw a[1];
          return a[1];
        }, trys: [], ops: [] };
        return c = { next: t(0), throw: t(1), return: t(2) }, "function" == typeof Symbol && (c[Symbol.iterator] = function() {
          return this;
        }), c;
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.checkConfig = void 0;
      var log_1 = require_log();
      exports.checkConfig = checkConfig;
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/middlewares/initBridge.js
  var require_initBridge = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/middlewares/initBridge.js"(exports) {
      "use strict";
      function initBridge(t, e) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(n) {
            return [2, this.bridgeInitFn().then(function(n2) {
              return t.JSBridge = n2, e();
            })];
          });
        });
      }
      var __awaiter = exports && exports.__awaiter || function(t, e, n, r) {
        function i(t2) {
          return t2 instanceof n ? t2 : new n(function(e2) {
            e2(t2);
          });
        }
        return new (n || (n = Promise))(function(n2, o) {
          function u(t2) {
            try {
              c(r.next(t2));
            } catch (t3) {
              o(t3);
            }
          }
          function a(t2) {
            try {
              c(r.throw(t2));
            } catch (t3) {
              o(t3);
            }
          }
          function c(t2) {
            t2.done ? n2(t2.value) : i(t2.value).then(u, a);
          }
          c((r = r.apply(t, e || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(t, e) {
        function n(t2) {
          return function(e2) {
            return r([t2, e2]);
          };
        }
        function r(n2) {
          if (i) throw new TypeError("Generator is already executing.");
          for (; c; ) try {
            if (i = 1, o && (u = 2 & n2[0] ? o.return : n2[0] ? o.throw || ((u = o.return) && u.call(o), 0) : o.next) && !(u = u.call(o, n2[1])).done) return u;
            switch (o = 0, u && (n2 = [2 & n2[0], u.value]), n2[0]) {
              case 0:
              case 1:
                u = n2;
                break;
              case 4:
                return c.label++, { value: n2[1], done: false };
              case 5:
                c.label++, o = n2[1], n2 = [0];
                continue;
              case 7:
                n2 = c.ops.pop(), c.trys.pop();
                continue;
              default:
                if (u = c.trys, !(u = u.length > 0 && u[u.length - 1]) && (6 === n2[0] || 2 === n2[0])) {
                  c = 0;
                  continue;
                }
                if (3 === n2[0] && (!u || n2[1] > u[0] && n2[1] < u[3])) {
                  c.label = n2[1];
                  break;
                }
                if (6 === n2[0] && c.label < u[1]) {
                  c.label = u[1], u = n2;
                  break;
                }
                if (u && c.label < u[2]) {
                  c.label = u[2], c.ops.push(n2);
                  break;
                }
                u[2] && c.ops.pop(), c.trys.pop();
                continue;
            }
            n2 = e.call(t, c);
          } catch (t2) {
            n2 = [6, t2], o = 0;
          } finally {
            i = u = 0;
          }
          if (5 & n2[0]) throw n2[1];
          return { value: n2[0] ? n2[1] : void 0, done: true };
        }
        var i, o, u, a, c = { label: 0, sent: function() {
          if (1 & u[0]) throw u[1];
          return u[1];
        }, trys: [], ops: [] };
        return a = { next: n(0), throw: n(1), return: n(2) }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
          return this;
        }), a;
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.initBridge = void 0, exports.initBridge = initBridge;
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/middlewares/hookBeforeAndAfter.js
  var require_hookBeforeAndAfter = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/middlewares/hookBeforeAndAfter.js"(exports) {
      "use strict";
      function hookBeforeAndAfter(e, t) {
        return __awaiter(this, void 0, void 0, function() {
          var r, o, n, a, i, s, c, l, u;
          return __generator(this, function(f) {
            switch (f.label) {
              case 0:
                if (r = e.method, o = e.params, n = +/* @__PURE__ */ new Date(), a = n + "_" + Math.floor(1e3 * Math.random()), this.devConfig.onBeforeInvokeAPI) try {
                  this.devConfig.onBeforeInvokeAPI({ invokeId: a, method: r, params: o, startTime: n });
                } catch (e2) {
                  log_1.formatLog(log_1.diagnosticMessageMap.call_api_on_before_error, e2.toString());
                }
                c = true, f.label = 1;
              case 1:
                return f.trys.push([1, 3, , 4]), [4, t()];
              case 2:
                return i = f.sent(), [3, 4];
              case 3:
                return l = f.sent(), s = l, c = false, [3, 4];
              case 4:
                if (u = c ? i : s, this.devConfig.onAfterInvokeAPI) try {
                  this.devConfig.onAfterInvokeAPI({ invokeId: a, method: r, params: o, payload: u, startTime: n, duration: +/* @__PURE__ */ new Date() - n, isSuccess: c });
                } catch (e2) {
                  log_1.formatLog(log_1.diagnosticMessageMap.call_api_on_after_error, e2.toString());
                }
                return [2, c ? Promise.resolve(u) : Promise.reject(u)];
            }
          });
        });
      }
      var __awaiter = exports && exports.__awaiter || function(e, t, r, o) {
        function n(e2) {
          return e2 instanceof r ? e2 : new r(function(t2) {
            t2(e2);
          });
        }
        return new (r || (r = Promise))(function(r2, a) {
          function i(e2) {
            try {
              c(o.next(e2));
            } catch (e3) {
              a(e3);
            }
          }
          function s(e2) {
            try {
              c(o.throw(e2));
            } catch (e3) {
              a(e3);
            }
          }
          function c(e2) {
            e2.done ? r2(e2.value) : n(e2.value).then(i, s);
          }
          c((o = o.apply(e, t || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(e, t) {
        function r(e2) {
          return function(t2) {
            return o([e2, t2]);
          };
        }
        function o(r2) {
          if (n) throw new TypeError("Generator is already executing.");
          for (; c; ) try {
            if (n = 1, a && (i = 2 & r2[0] ? a.return : r2[0] ? a.throw || ((i = a.return) && i.call(a), 0) : a.next) && !(i = i.call(a, r2[1])).done) return i;
            switch (a = 0, i && (r2 = [2 & r2[0], i.value]), r2[0]) {
              case 0:
              case 1:
                i = r2;
                break;
              case 4:
                return c.label++, { value: r2[1], done: false };
              case 5:
                c.label++, a = r2[1], r2 = [0];
                continue;
              case 7:
                r2 = c.ops.pop(), c.trys.pop();
                continue;
              default:
                if (i = c.trys, !(i = i.length > 0 && i[i.length - 1]) && (6 === r2[0] || 2 === r2[0])) {
                  c = 0;
                  continue;
                }
                if (3 === r2[0] && (!i || r2[1] > i[0] && r2[1] < i[3])) {
                  c.label = r2[1];
                  break;
                }
                if (6 === r2[0] && c.label < i[1]) {
                  c.label = i[1], i = r2;
                  break;
                }
                if (i && c.label < i[2]) {
                  c.label = i[2], c.ops.push(r2);
                  break;
                }
                i[2] && c.ops.pop(), c.trys.pop();
                continue;
            }
            r2 = t.call(e, c);
          } catch (e2) {
            r2 = [6, e2], a = 0;
          } finally {
            n = i = 0;
          }
          if (5 & r2[0]) throw r2[1];
          return { value: r2[0] ? r2[1] : void 0, done: true };
        }
        var n, a, i, s, c = { label: 0, sent: function() {
          if (1 & i[0]) throw i[1];
          return i[1];
        }, trys: [], ops: [] };
        return s = { next: r(0), throw: r(1), return: r(2) }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
          return this;
        }), s;
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.hookBeforeAndAfter = void 0;
      var log_1 = require_log();
      exports.hookBeforeAndAfter = hookBeforeAndAfter;
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/middlewares/simpleLogger.js
  var require_simpleLogger = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/middlewares/simpleLogger.js"(exports) {
      "use strict";
      function simpleLogger(e, t) {
        return __awaiter(this, void 0, void 0, function() {
          var r, n, o, i, a, u, s, l, c;
          return __generator(this, function(f) {
            switch (f.label) {
              case 0:
                r = e.method, n = e.params, a = true, f.label = 1;
              case 1:
                return f.trys.push([1, 3, , 4]), [4, t()];
              case 2:
                return o = f.sent(), [3, 4];
              case 3:
                return u = f.sent(), i = u, a = false, [3, 4];
              case 4:
                return s = a ? o : i, l = a ? __1.LogLevel.INFO : __1.LogLevel.WARNING, c = a ? "success" : "fail", [2, a ? Promise.resolve(s) : Promise.reject(s)];
            }
          });
        });
      }
      var __awaiter = exports && exports.__awaiter || function(e, t, r, n) {
        function o(e2) {
          return e2 instanceof r ? e2 : new r(function(t2) {
            t2(e2);
          });
        }
        return new (r || (r = Promise))(function(r2, i) {
          function a(e2) {
            try {
              s(n.next(e2));
            } catch (e3) {
              i(e3);
            }
          }
          function u(e2) {
            try {
              s(n.throw(e2));
            } catch (e3) {
              i(e3);
            }
          }
          function s(e2) {
            e2.done ? r2(e2.value) : o(e2.value).then(a, u);
          }
          s((n = n.apply(e, t || [])).next());
        });
      };
      var __generator = exports && exports.__generator || function(e, t) {
        function r(e2) {
          return function(t2) {
            return n([e2, t2]);
          };
        }
        function n(r2) {
          if (o) throw new TypeError("Generator is already executing.");
          for (; s; ) try {
            if (o = 1, i && (a = 2 & r2[0] ? i.return : r2[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, r2[1])).done) return a;
            switch (i = 0, a && (r2 = [2 & r2[0], a.value]), r2[0]) {
              case 0:
              case 1:
                a = r2;
                break;
              case 4:
                return s.label++, { value: r2[1], done: false };
              case 5:
                s.label++, i = r2[1], r2 = [0];
                continue;
              case 7:
                r2 = s.ops.pop(), s.trys.pop();
                continue;
              default:
                if (a = s.trys, !(a = a.length > 0 && a[a.length - 1]) && (6 === r2[0] || 2 === r2[0])) {
                  s = 0;
                  continue;
                }
                if (3 === r2[0] && (!a || r2[1] > a[0] && r2[1] < a[3])) {
                  s.label = r2[1];
                  break;
                }
                if (6 === r2[0] && s.label < a[1]) {
                  s.label = a[1], a = r2;
                  break;
                }
                if (a && s.label < a[2]) {
                  s.label = a[2], s.ops.push(r2);
                  break;
                }
                a[2] && s.ops.pop(), s.trys.pop();
                continue;
            }
            r2 = t.call(e, s);
          } catch (e2) {
            r2 = [6, e2], i = 0;
          } finally {
            o = a = 0;
          }
          if (5 & r2[0]) throw r2[1];
          return { value: r2[0] ? r2[1] : void 0, done: true };
        }
        var o, i, a, u, s = { label: 0, sent: function() {
          if (1 & a[0]) throw a[1];
          return a[1];
        }, trys: [], ops: [] };
        return u = { next: r(0), throw: r(1), return: r(2) }, "function" == typeof Symbol && (u[Symbol.iterator] = function() {
          return this;
        }), u;
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.simpleLogger = void 0;
      var __1 = require_sdk();
      exports.simpleLogger = simpleLogger;
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/middlewares/index.js
  var require_middlewares = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/middlewares/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(e, r, t, i) {
        void 0 === i && (i = t), Object.defineProperty(e, i, { enumerable: true, get: function() {
          return r[t];
        } });
      } : function(e, r, t, i) {
        void 0 === i && (i = t), e[i] = r[t];
      });
      var __exportStar = exports && exports.__exportStar || function(e, r) {
        for (var t in e) "default" === t || r.hasOwnProperty(t) || __createBinding(r, e, t);
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.ApiHandler = void 0;
      var ApiHandler = /* @__PURE__ */ (function() {
        function e() {
          var e2 = this;
          this.middlewares = [], this.use = function(r) {
            e2.middlewares.push(r);
          }, this.start = function(r) {
            var t = e2.middlewares.slice().reverse(), i = function(e3) {
              return e3 < t.length ? function() {
                return t[e3](r, i(e3 + 1));
              } : function() {
              };
            };
            return i(0)();
          };
        }
        return e;
      })();
      exports.ApiHandler = ApiHandler, __exportStar(require_bridge(), exports), __exportStar(require_retry(), exports), __exportStar(require_dealParamsAndResult(), exports), __exportStar(require_checkConfig(), exports), __exportStar(require_initBridge(), exports), __exportStar(require_hookBeforeAndAfter(), exports), __exportStar(require_simpleLogger(), exports);
    }
  });

  // node_modules/dingtalk-jsapi/constant/apiMapping.js
  var require_apiMapping = __commonJS({
    "node_modules/dingtalk-jsapi/constant/apiMapping.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.default = { datePicker: "biz.util.datetimepicker", chooseOneDayInCalendar: "biz.calendar.chooseOneDay", disableWebViewBounce: "ui.webViewBounce.disable", openPageInSlidePanelForPC: "biz.util.openSlidePanel", disablePullDownRefresh: "ui.pullToRefresh.disable", compressImage: "biz.util.compressImage", openPageInWorkBenchForPC: "biz.util.invokeWorkbench", chooseHalfDayInCalendar: "biz.calendar.chooseHalfDay", dateRangePicker: "biz.calendar.chooseInterval", stopPullDownRefresh: "ui.pullToRefresh.stop", chooseDateRangeInCalendar: "biz.calendar.chooseInterval", stopRecord: "device.audio.stopRecord", navigateToPage: "biz.navigation.navigateToPage", chooseDateTime: "biz.calendar.chooseDateTime", enablePullDownRefresh: "ui.pullToRefresh.enable", downloadAudio: "device.audio.download", openLink: "biz.util.openLink", openMicroApp: "biz.microApp.openApp", timePicker: "biz.util.timepicker", openPageInMicroApp: "biz.util.open", previewImage: "biz.util.previewImage", openPageInModalForPC: "biz.util.openModal", enableWebViewBounce: "ui.webViewBounce.enable", generateImageFromCode: "biz.util.generateImageFromCode", navigateBackPage: "biz.navigation.navigateBackPage", openLocation: "biz.map.view", playAudio: "device.audio.play", chooseImage: "biz.util.chooseImage", onRecordEnd: "device.audio.onRecordEnd", stopAudio: "device.audio.stop", vibrate: "device.notification.vibrate", onPlayAudioEnd: "device.audio.onPlayEnd", getStorage: "util.domainStorage.getItem", searchMap: "biz.map.search", stopLocating: "device.geolocation.stop", resumeAudio: "device.audio.resume", getLocatingStatus: "device.geolocation.status", startLocating: "device.geolocation.start", startRecord: "device.audio.startRecord", setStorage: "util.domainStorage.setItem", openLocalFile: "biz.util.openLocalFile", share: "biz.util.share", writeNFC: "device.nfc.nfcWrite", choosePhonebook: "biz.contact.chooseMobileContacts", pauseAudio: "device.audio.pause", getDeviceUUID: "device.base.getUUID", getSystemSettings: "device.base.openSystemSetting", customChooseUsers: "biz.customContact.multipleChoose", removeStorage: "util.domainStorage.removeItem", setClipboard: "biz.clipboardData.setData", scan: "biz.util.scan", decrypt: "biz.util.decrypt", getWifiHotspotStatus: "device.base.getInterface", readNFC: "device.nfc.nfcRead", showCallMenu: "biz.telephone.showCallMenu", getLocation: "device.geolocation.get", locateInMap: "biz.map.locate", clearShake: "device.accelerometer.clearShake", chooseStaffForPC: "biz.contact.choose", uploadAttachmentToDingTalk: "biz.util.uploadAttachment", rotateScreenView: "device.screen.rotateView", isLocalFileExist: "biz.util.isLocalFileExist", openChatByChatId: "biz.chat.toConversation", createGroupChat: "biz.contact.createGroup", watchShake: "device.accelerometer.watchShake", scanCard: "biz.util.scanCard", createDing: "biz.ding.create", openChatByUserId: "biz.chat.openSingleChat", chooseUserFromList: "biz.customContact.choose", exclusiveLiveCheck: "biz.ATMBle.exclusiveLiveCheck", chooseExternalUsers: "biz.contact.externalComplexPicker", saveFileToDingTalk: "biz.cspace.saveFile", resetScreenView: "device.screen.resetView", getCloudCallList: "biz.conference.getCloudCallList", translateVoice: "device.audio.translateVoice", complexChoose: "biz.contact.complexPicker", editExternalUser: "biz.contact.externalEditForm", checkBizCall: "biz.telephone.checkBizCall", getWifiStatus: "device.base.getWifiStatus", chooseDepartments: "biz.contact.departmentsPicker", getSystemInfo: "device.base.getPhoneInfo", getNetworkType: "device.connection.getNetworkType", makeVideoConfCall: "biz.conference.videoConfCall", createDingForPC: "biz.ding.post", encrypt: "biz.util.encrypt", quickCallList: "biz.telephone.quickCallList", getUserExclusiveInfo: "biz.realm.getUserExclusiveInfo", getAuthCode: "runtime.permission.requestAuthCode", previewImagesInDingTalkBatch: "biz.cspace.previewDentryImages", chooseChat: "biz.chat.chooseConversationByCorpId", getCloudCallInfo: "biz.conference.getCloudCallInfo", previewFileInDingTalk: "biz.cspace.preview", openChatByConversationId: "biz.chat.toConversationByOpenConversationId", chooseDingTalkDir: "biz.cspace.chooseSpaceDir", getOperateAuthCode: "runtime.permission.requestOperateAuthCode", isInTabWindow: "biz.tabwindow.isTab", createLiveClassRoom: "biz.live.startClassRoom", callUsers: "biz.telephone.call", makeCloudCall: "biz.conference.createCloudCall", ExternalChannelPublish: "biz.channel.externalChannelPublish", nfcReadCardNumber: "device.nfc.nfcReadCardNumber", liveChooseConversationAndUser: "biz.live.chooseConversationAndUser", getAuthCodeV2: "runtime.permission.requestAuthCodeV2", queryUserProfile: "biz.conference.queryUserProfile", requestMoneySubmmitOrder: "biz.requestMoney.startSubmittingOrder", requestAuthCode: "runtime.permission.requestAuthCodeV2", liveShare: "biz.live.share", chooseFile: "biz.file.chooseFile", setColorScheme: "internal.theme.setColorScheme", chooseConversation: "biz.chat.chooseConversation", saveVideoToPhotosAlbum: "biz.util.saveVideoToPhotosAlbum", setLanguage: "internal.setting.setLanguage", changeAppIcon: "internal.setting.changeAppIcon", editPicture: "biz.util.editPicture", "biz.resource.getInfo": "biz.resource.getInfo", "biz.resource.reportPerf": "biz.resource.reportPerf", openDocument: "biz.util.openDocument", getImageInfo: "biz.util.getImageInfo", previewMedia: "biz.util.previewMedia", popGesture: "biz.navigation.popGesture", startAdvertising: "biz.realm.startAdvertising", stopAdvertising: "biz.realm.stopAdvertising", getAdvertisingStatus: "biz.realm.getAdvertisingStatus", chooseMedia: "biz.util.chooseMedia", cropImage: "biz.util.cropImage", saveImageToPhotosAlbum: "biz.util.saveImageToPhotosAlbum", setGestures: "biz.navigation.gestures", getAuthInfo: "runtime.permission.getAuthInfo", getBackgroundFetchData: "biz.resource.getBackgroundFetchData", getBackgroundFetchDataWithID: "biz.resource.getBackgroundFetchDataWithID", getThirdAppConfCustomData: "biz.conference.getThirdAppConfCustomData", getThirdAppUserCustomData: "biz.conference.getThirdAppUserCustomData", getDeviceId: "device.base.getDeviceId", onBLEPeripheralCharacteristicReadRequest: "biz.realm.onBLEPeripheralCharacteristicReadRequest", onBLEPeripheralCharacteristicWriteRequest: "biz.realm.onBLEPeripheralCharacteristicWriteRequest", createBLEPeripheralServer: "biz.realm.createBLEPeripheralServer", writeBLEPeripheralCharacteristicValue: "biz.realm.writeBLEPeripheralCharacteristicValue", onBLEPeripheralConnectionStateChanged: "biz.realm.onBLEPeripheralConnectionStateChanged", translate: "biz.i18n.translate", subscribe: "biz.notify.subscribe", getTranslateStatus: "biz.i18n.getTranslateStatus", notifyTranslateEvent: "biz.i18n.notifyTranslateEvent", minutesCreateFromVideo: "biz.minutes.createFromVideo", minutesStart: "biz.minutes.startMinutes", minutesViewDetail: "biz.minutes.viewDetail", showNavigatorEditView: "biz.live.showNavigatorEditView", liveH5IsPresentOnNavigator: "biz.live.liveH5IsPresentOnNavigator", getCurrentCorpId: "biz.minutes.getCurrentCorpId", getAccountType: "biz.i18n.getAccountType", createPayOrder: "biz.enterprise.createPayOrder", chooseOrg: "biz.contact.chooseOrg", removeCachedAPIResponse: "biz.util.removeCachedAPIResponse", getPageTerminateInfo: "biz.util.getPageTerminateInfo", getCachedAPIResponse: "biz.util.getCachedAPIResponse", getNavigationStack: "biz.navigation.getNavigationStack", getTodaysStepCount: "biz.sports.getTodaysStepCount", startDingerRecord: "biz.dinger.startDingerRecord", stopDingerRecord: "biz.dinger.stopDingerRecord", minutesUploadVideo: "biz.minutes.uploadVideo", getDingerDeviceStatus: "biz.dinger.getDingerDeviceStatus", getActiveConferenceInfo: "biz.conference.getConferenceInfo", getPersonalWorkInfo: "biz.user.get", showRecordTabRedDot: "biz.minutes.showRecordTabRedDot" };
    }
  });

  // node_modules/dingtalk-jsapi/lib/sdk/index.js
  var require_sdk = __commonJS({
    "node_modules/dingtalk-jsapi/lib/sdk/index.js"(exports) {
      "use strict";
      function getTargetApiConfigVS(e, i) {
        var t = e && e.vs;
        return "object" == typeof t && i.platformSub ? t[i.platformSub] : "string" == typeof t ? t : void 0;
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var i, t = 1, n = arguments.length; t < n; t++) {
            i = arguments[t];
            for (var o in i) Object.prototype.hasOwnProperty.call(i, o) && (e[o] = i[o]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.Sdk = exports.getTargetApiConfigVS = exports.LogLevel = exports.APP_TYPE = exports.isFunction = exports.compareVersion = exports.ENV_ENUM_SUB = exports.ENV_ENUM = void 0;
      var sdkLib_1 = require_sdkLib();
      Object.defineProperty(exports, "APP_TYPE", { enumerable: true, get: function() {
        return sdkLib_1.APP_TYPE;
      } }), Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function() {
        return sdkLib_1.LogLevel;
      } }), Object.defineProperty(exports, "isFunction", { enumerable: true, get: function() {
        return sdkLib_1.isFunction;
      } }), Object.defineProperty(exports, "compareVersion", { enumerable: true, get: function() {
        return sdkLib_1.compareVersion;
      } }), Object.defineProperty(exports, "ENV_ENUM", { enumerable: true, get: function() {
        return sdkLib_1.ENV_ENUM;
      } }), Object.defineProperty(exports, "ENV_ENUM_SUB", { enumerable: true, get: function() {
        return sdkLib_1.ENV_ENUM_SUB;
      } });
      var middlewares_1 = require_middlewares();
      var log_1 = require_log();
      var apiMapping_1 = require_apiMapping();
      exports.getTargetApiConfigVS = getTargetApiConfigVS;
      var Sdk = (function() {
        function e(e2) {
          var i = this;
          this.configJsApiList = [], this.hadConfig = false, this.devConfig = { debug: false }, this.invokeAPIConfigMapByMethod = {}, this.p = {}, this.config$ = new Promise(function(e3, t2) {
            i.p.reject = t2, i.p.resolve = e3;
          }), this.apiHandler = new middlewares_1.ApiHandler(), this.platformConfigMap = {}, this.isBridgeDrity = true, this.getExportSdk = function() {
            return i.exportSdk;
          }, this.setAPI = function(e3, t2) {
            i.invokeAPIConfigMapByMethod[e3] = Object.assign(i.invokeAPIConfigMapByMethod[e3] || {}, t2);
          }, this.setPlatform = function(e3) {
            i.isBridgeDrity = true, i.platformConfigMap[e3.platform] = i.withDefaultEvent(e3), e3.platform === i.env.platform && e3.bridgeInit().catch(function(e4) {
              log_1.formatLog(log_1.diagnosticMessageMap.auto_bridge_init_error, null === e4 || void 0 === e4 ? void 0 : e4.toString());
            });
          }, this.getPlatformConfigMap = function() {
            return i.platformConfigMap;
          }, this.deleteApiConfig = function(e3, t2) {
            var n = i.invokeAPIConfigMapByMethod[e3];
            n && delete n[t2];
          }, this.invokeAPI = function(e3, t2, n) {
            return void 0 === t2 && (t2 = {}), void 0 === n && (n = true), i.apiHandler.start({ method: e3, params: t2, isAuthApi: n });
          }, this.withDefaultEvent = function(e3) {
            var i2 = Object.assign({ on: function() {
              return log_1.formatLog(log_1.diagnosticMessageMap.not_support_event_on);
            }, off: function() {
              return log_1.formatLog(log_1.diagnosticMessageMap.not_support_event_off);
            } }, e3.event);
            return __assign(__assign({}, e3), { event: i2 });
          }, this.env = e2, this.bridgeInitFn = function() {
            if (i.bridgeInitFnPromise && !i.isBridgeDrity) return i.bridgeInitFnPromise;
            i.isBridgeDrity = false;
            var t2 = i.platformConfigMap[e2.platform];
            if (t2) i.bridgeInitFnPromise = t2.bridgeInit().catch(function(e3) {
              return log_1.formatLog(log_1.diagnosticMessageMap.JsBridge_init_fail), Promise.reject(e3);
            });
            else {
              var n = log_1.formatLog(log_1.diagnosticMessageMap.not_support_env, e2.platform);
              i.bridgeInitFnPromise = Promise.reject(new Error(n));
            }
            return i.bridgeInitFnPromise;
          };
          var t = function(e3) {
            void 0 === e3 && (e3 = {}), i.devConfig = Object.assign(i.devConfig, e3), e3.extraPlatform && i.setPlatform(e3.extraPlatform);
          };
          this.exportSdk = { config: function(n) {
            void 0 === n && (n = {});
            var o = true;
            Object.keys(n).forEach(function(e3) {
              -1 === ["debug", "usePromise"].indexOf(e3) && (o = false);
            }), o ? (log_1.formatLog(log_1.diagnosticMessageMap.config_debug_deprecated), t(n)) : i.hadConfig ? log_1.formatLog(log_1.diagnosticMessageMap.repeat_config) : (n.jsApiList && (i.configJsApiList = n.jsApiList.map(function(e3) {
              return apiMapping_1.default[e3] ? apiMapping_1.default[e3] : e3;
            })), i.hadConfig = true, i.bridgeInitFn().then(function(t2) {
              var o2 = i.platformConfigMap[e2.platform], r = n;
              o2.authParamsDeal && (r = o2.authParamsDeal(r)), t2(o2.authMethod, r).then(function(e3) {
                i.isReady = true, i.p.resolve(e3);
              }).catch(function(e3) {
                i.isReady = false, i.p.reject(e3);
              });
            }, function(e3) {
              log_1.formatLog(log_1.diagnosticMessageMap.JsBridge_init_fail_dd_config), i.p.reject(e3);
            }));
          }, devConfig: t, ready: function(e3) {
            false === i.hadConfig ? (log_1.formatLog(log_1.diagnosticMessageMap.dd_config_wrap_deprecated), i.bridgeInitFn().then(function() {
              e3();
            })) : i.config$.then(function(i2) {
              e3();
            });
          }, error: function(e3) {
            i.config$.catch(function(i2) {
              e3(i2);
            });
          }, on: function(t2, n) {
            i.bridgeInitFn().then(function() {
              var o;
              null === (o = i.platformConfigMap[e2.platform].event) || void 0 === o || o.on(t2, n);
            });
          }, off: function(t2, n) {
            i.bridgeInitFn().then(function() {
              var o;
              null === (o = i.platformConfigMap[e2.platform].event) || void 0 === o || o.off(t2, n);
            });
          }, env: e2, checkJsApi: function(t2) {
            void 0 === t2 && (t2 = {});
            var n = {};
            return t2.jsApiList && t2.jsApiList.forEach(function(t3) {
              var o = apiMapping_1.default[t3] || t3, r = i.invokeAPIConfigMapByMethod[o];
              if (r) {
                var a = r[e2.platform], s = getTargetApiConfigVS(a, e2);
                s && e2.version && sdkLib_1.compareVersion(e2.version, s) && (n[t3] = true);
              }
              n[t3] || (n[t3] = false);
            }), Promise.resolve(n);
          }, _invoke: function(e3, t2) {
            return void 0 === t2 && (t2 = {}), i.invokeAPI(e3, t2, false);
          } }, this.initApiMiddleware();
        }
        return e.prototype.useApiMiddleware = function(e2) {
          if (!sdkLib_1.isFunction(e2)) throw TypeError("middleware must be a function");
          this.apiHandler.use(e2);
        }, e.prototype.initApiMiddleware = function() {
          this.apiHandler.use(middlewares_1.bridge.bind(this)), this.apiHandler.use(middlewares_1.retry.bind(this)), this.apiHandler.use(middlewares_1.dealParamsAndResult.bind(this)), this.apiHandler.use(middlewares_1.checkConfig.bind(this)), this.apiHandler.use(middlewares_1.initBridge.bind(this)), this.apiHandler.use(middlewares_1.hookBeforeAndAfter.bind(this));
        }, e;
      })();
      exports.Sdk = Sdk;
    }
  });

  // node_modules/dingtalk-jsapi/lib/packages/dingtalk-javascript-env/whichOneRuntime.js
  var require_whichOneRuntime = __commonJS({
    "node_modules/dingtalk-jsapi/lib/packages/dingtalk-javascript-env/whichOneRuntime.js"(exports) {
      "use strict";
      function snifferMachine(e, n) {
        for (var i = e.length, a = 0, f = true; a < i; a++) try {
          if (!(e[a] in n)) {
            f = false;
            break;
          }
        } catch (e2) {
          f = false;
          break;
        }
        return f;
      }
      function whichOneRuntime() {
        return maybeInWebView && maybeInWeexVueEnv ? snifferMachine(snifferWeexVueMap, weex) ? "Web.Vue" : "Web.Unknown" : !maybeInWebView && maybeInWeexVueEnv ? snifferMachine(snifferWeexVueMap, weex) ? "Weex.Vue" : "Weex.Unknown" : maybeInWebView && maybeInNative && !maybeInWeexVueEnv ? snifferMachine(snifferWeexRaxMap, window) ? "Weex.Rax" : "Weex.Unknown" : maybeInWebView && snifferMachine(snifferWebViewMap, window) ? "Web.Unknown" : "Unknown.Unknown";
      }
      Object.defineProperty(exports, "__esModule", { value: true });
      var maybeInWebView = "undefined" != typeof window;
      var maybeInWeexVueEnv = "undefined" != typeof weex;
      var maybeInNative = "undefined" != typeof callNative;
      var snifferWeexRaxMap = ["__weex_config__", "__weex_options__", "__weex_require__"];
      var snifferWebViewMap = ["localStorage", "location", "navigator", "XMLHttpRequest"];
      var snifferWeexVueMap = ["config", "requireModule", "document"];
      exports.default = whichOneRuntime;
    }
  });

  // node_modules/dingtalk-jsapi/lib/packages/dingtalk-javascript-env/constants.js
  var require_constants = __commonJS({
    "node_modules/dingtalk-jsapi/lib/packages/dingtalk-javascript-env/constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.FRAMEWORK = exports.PLATFORM = exports.RUNTIME = void 0, exports.RUNTIME = { WEB: "Web", WEEX: "Weex", UNKNOWN: "Unknown" }, exports.PLATFORM = { MAC: "Mac", WINDOWS: "Windows", IOS: "iOS", ANDROID: "Android", IPAD: "iPad", BROWSER: "Browser", UNKNOWN: "Unknown" }, exports.FRAMEWORK = { VUE: "Vue", RAX: "Rax", UNKNOWN: "Unknown" };
    }
  });

  // node_modules/dingtalk-jsapi/lib/packages/dingtalk-javascript-env/environment.js
  var require_environment = __commonJS({
    "node_modules/dingtalk-jsapi/lib/packages/dingtalk-javascript-env/environment.js"(exports) {
      "use strict";
      function environment(n, i, a) {
        var t = "Web" === a.platform, e = "iOS" === a.platform, r = "android" === a.platform, o = r || e, s = (function() {
          return t ? window.navigator.userAgent.toLowerCase() : "";
        })(), c = (function() {
          var n2 = {};
          if (t) {
            var i2 = window.name;
            try {
              var a2 = JSON.parse(i2);
              n2.containerId = a2.containerId, n2.version = a2.hostVersion, n2.language = a2.language || "*";
            } catch (n3) {
            }
          }
          return n2;
        })(), d = (function() {
          return o ? "DingTalk" === a.appName || "com.alibaba.android.rimet" === a.appName : s.indexOf("dingtalk") > -1 || !!c.containerId;
        })(), O = (function() {
          if (t) {
            if (c.version) return c.version;
            var n2 = s.match(/aliapp\(\w+\/([a-zA-Z0-9.-]+)\)/);
            null === n2 && (n2 = s.match(/dingtalk\/([a-zA-Z0-9.-]+)/));
            return n2 && n2[1] || "Unknown";
          }
          return a.appVersion;
        })(), u = !!c.containerId, l = /iphone|ipod|ios/.test(s), f = /ipad/.test(s), p = s.indexOf("android") > -1, m = s.indexOf("mac") > -1 && u, A = s.indexOf("win") > -1 && u, g = !m && !A && u, v = u, P = "";
        return P = d ? l || e ? constants_1.PLATFORM.IOS : p || r ? constants_1.PLATFORM.ANDROID : f ? constants_1.PLATFORM.IPAD : m ? constants_1.PLATFORM.MAC : A ? constants_1.PLATFORM.WINDOWS : g ? constants_1.PLATFORM.BROWSER : constants_1.PLATFORM.UNKNOWN : constants_1.PLATFORM.UNKNOWN, { isDingTalk: d, isWebiOS: l, isWebAndroid: p, isWeexiOS: e, isWeexAndroid: r, isDingTalkPCMac: m, isDingTalkPCWeb: g, isDingTalkPCWindows: A, isDingTalkPC: v, runtime: n, framework: i, platform: P, version: O, isWeex: o };
      }
      Object.defineProperty(exports, "__esModule", { value: true });
      var constants_1 = require_constants();
      exports.default = environment;
    }
  });

  // node_modules/dingtalk-jsapi/lib/packages/dingtalk-javascript-env/index.js
  var require_dingtalk_javascript_env = __commonJS({
    "node_modules/dingtalk-jsapi/lib/packages/dingtalk-javascript-env/index.js"(exports) {
      "use strict";
      function getVirtualEnv() {
        var n = {};
        switch (framework) {
          case constants_1.FRAMEWORK.VUE:
            var t = weex.config, e = t.env;
            n.platform = e.platform, constants_1.RUNTIME.WEEX === runtime && (n.appVersion = e.appVersion, n.appName = e.appName);
            break;
          case constants_1.FRAMEWORK.RAX:
            constants_1.RUNTIME.WEEX === runtime && (n.platform = navigator.platform, n.appName = navigator.appName, n.appVersion = navigator.appVersion);
            break;
          case constants_1.FRAMEWORK.UNKNOWN:
            constants_1.RUNTIME.WEB === runtime && (n.platform = constants_1.RUNTIME.WEB), constants_1.RUNTIME.UNKNOWN === runtime && (n.platform = constants_1.RUNTIME.UNKNOWN);
        }
        return n;
      }
      Object.defineProperty(exports, "__esModule", { value: true });
      var whichOneRuntime_1 = require_whichOneRuntime();
      var environment_1 = require_environment();
      var constants_1 = require_constants();
      var _a = whichOneRuntime_1.default().split(".");
      var runtime = _a[0];
      var framework = _a[1];
      var virtualEnv = getVirtualEnv();
      var env = environment_1.default(runtime, framework, virtualEnv);
      exports.default = env;
    }
  });

  // node_modules/dingtalk-jsapi/lib/apiHelper.js
  var require_apiHelper = __commonJS({
    "node_modules/dingtalk-jsapi/lib/apiHelper.js"(exports) {
      "use strict";
      function getGlobalSelf() {
        return "undefined" != typeof window ? window : "undefined" != typeof dd ? dd : self;
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var a, t = 1, r = arguments.length; t < r; t++) {
            a = arguments[t];
            for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getGlobalSelf = exports.getNetWorkTypeResultDeal = exports.scanParamsDeal = exports.removeStorageParamsDeal = exports.getStorageParamsDeal = exports.setStorageParamsDeal = exports.genBizStoreParamsDealFn = exports.genBoolResultDealFn = exports.forceChangeParamsDealFn = exports.genDefaultParamsDealFn = exports.addDefaultCorpIdParamsDeal = exports.addWatchParamsDeal = void 0, exports.addWatchParamsDeal = function(e) {
        var a = Object.assign({}, e);
        return a.watch = true, a;
      }, exports.addDefaultCorpIdParamsDeal = function(e) {
        var a = Object.assign({}, e);
        return a.corpId = "corpId", a;
      }, exports.genDefaultParamsDealFn = function(e) {
        var a = Object.assign({}, e);
        return function(e2) {
          return Object.assign({}, a, e2);
        };
      }, exports.forceChangeParamsDealFn = function(e) {
        var a = Object.assign({}, e);
        return function(e2) {
          return Object.assign(e2, a);
        };
      }, exports.genBoolResultDealFn = function(e) {
        return function(a) {
          var t = Object.assign({}, a);
          return e.forEach(function(e2) {
            void 0 !== t[e2] && (t[e2] = !!t[e2]);
          }), t;
        };
      }, exports.genBizStoreParamsDealFn = function(e) {
        var a = Object.assign({}, e);
        return "string" != typeof a.params ? (a.params = JSON.stringify(a), a) : a;
      }, exports.setStorageParamsDeal = function(e) {
        return { name: e.key, value: e.data };
      }, exports.getStorageParamsDeal = function(e) {
        return { name: e.key };
      }, exports.removeStorageParamsDeal = function(e) {
        return { name: e.key };
      }, exports.scanParamsDeal = function(e) {
        return "qr" === e.type ? __assign(__assign({}, e), { type: "qrCode" }) : "bar" === e.type ? __assign(__assign({}, e), { type: "barCode" }) : __assign(__assign({}, e), { type: "all" });
      }, exports.getNetWorkTypeResultDeal = function(e) {
        return "none" !== e.result && "unknown" !== e.result ? { netWorkAvailable: true, netWorkType: e.result } : { newWorkAvailable: false };
      }, exports.getGlobalSelf = getGlobalSelf;
    }
  });

  // node_modules/dingtalk-jsapi/lib/env.js
  var require_env = __commonJS({
    "node_modules/dingtalk-jsapi/lib/env.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getENV = exports.getUA = void 0;
      var sdk_1 = require_sdk();
      var sdk_2 = require_sdk();
      Object.defineProperty(exports, "ENV_ENUM", { enumerable: true, get: function() {
        return sdk_2.ENV_ENUM;
      } }), Object.defineProperty(exports, "APP_TYPE", { enumerable: true, get: function() {
        return sdk_2.APP_TYPE;
      } }), Object.defineProperty(exports, "ENV_ENUM_SUB", { enumerable: true, get: function() {
        return sdk_2.ENV_ENUM_SUB;
      } });
      var dingtalk_javascript_env_1 = require_dingtalk_javascript_env();
      var apiHelper_1 = require_apiHelper();
      var getTopBridge = function() {
        try {
          if ("undefined" != typeof window && void 0 !== window.top) {
            return window.top.__dingtalk_jsapi_top_platfrom_config__;
          }
        } catch (e) {
          return;
        }
      };
      var EDdWeexEnv;
      !(function(e) {
        e.singlePage = "singlePage", e.miniApp = "miniApp", e.miniWidget = "miniWidget";
      })(EDdWeexEnv || (EDdWeexEnv = {})), exports.getUA = function() {
        var e = "";
        try {
          "undefined" != typeof navigator && (e = navigator && (navigator.userAgent || navigator.swuserAgent) || "");
        } catch (t) {
          e = "";
        }
        return e;
      }, exports.getENV = function() {
        var e, t, i = exports.getUA(), n = /iPhone|iPad|iPod|iOS/i.test(i), d = /Android/i.test(i), a = /OpenHarmony/i.test(i) && /ArkWeb/i.test(i), r = /DingTalk/i.test(i), _ = /dd-web/i.test(i), o = "object" == typeof nuva, s = "object" == typeof dd && "function" == typeof dd.dtBridge, E = /TaurusApp/.test(i), p = E && !r, g = E && r, l = p && "undefined" != typeof my && null !== my && void 0 !== my.alert, v = E && /dingtalk-win/.test(i), u = !v && p && n, f = !v && p && d, k = !v && g && n, c = !v && g && d, N = s && n || o && n, P = r || dingtalk_javascript_env_1.default.isDingTalk, A = n && P || dingtalk_javascript_env_1.default.isWeexiOS || N, w = d && P || dingtalk_javascript_env_1.default.isWeexAndroid, U = s, m = _, M = a && P, y = sdk_1.APP_TYPE.WEB;
        if (l) y = sdk_1.APP_TYPE.MINI_APP;
        else if (m) y = sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP;
        else if (U) y = sdk_1.APP_TYPE.MINI_APP;
        else if (dingtalk_javascript_env_1.default.isWeexiOS || dingtalk_javascript_env_1.default.isWeexAndroid) try {
          var V = weex.config.ddWeexEnv;
          y = V === EDdWeexEnv.miniWidget ? sdk_1.APP_TYPE.WEEX_WIDGET : sdk_1.APP_TYPE.WEEX;
        } catch (e2) {
          y = sdk_1.APP_TYPE.WEEX;
        }
        var x, W = "*", S = i.match(/AliApp\(\w+\/([a-zA-Z0-9.-]+)\)/);
        null === S && (S = i.match(/DingTalk\/([a-zA-Z0-9.-]+)/));
        var T;
        S && S[1] && (T = S[1]);
        var I = "";
        "undefined" != typeof name && (I = name);
        var b = getTopBridge();
        try {
          b && "undefined" != typeof window && void 0 !== window.top && window.top !== window && (I = top.name);
        } catch (e2) {
        }
        if (I) try {
          var j = JSON.parse(I);
          j.hostVersion && (T = j.hostVersion), W = j.language || navigator.language || "*", x = j.containerId;
        } catch (e2) {
        }
        var h = !!x || "undefined" != typeof window && (null === (t = null === (e = null === window || void 0 === window ? void 0 : window.dingtalk) || void 0 === e ? void 0 : e.platform) || void 0 === t ? void 0 : t.invokeAPI);
        h && !T && (S = i.match(/DingTalk\(([a-zA-Z0-9\.-]+)\)/)) && S[1] && (T = S[1]);
        var D, B = sdk_1.ENV_ENUM_SUB.noSub;
        if (v ? (D = sdk_1.ENV_ENUM.gdtPc, B = sdk_1.ENV_ENUM_SUB.win) : D = u ? sdk_1.ENV_ENUM.gdtIos : f ? sdk_1.ENV_ENUM.gdtAndroid : k ? sdk_1.ENV_ENUM.gdtStandardIos : c ? sdk_1.ENV_ENUM.gdtStandardAndroid : A ? sdk_1.ENV_ENUM.ios : w && !M ? sdk_1.ENV_ENUM.android : M ? sdk_1.ENV_ENUM.harmony : h ? sdk_1.ENV_ENUM.pc : b && b.platform ? b.platform : sdk_1.ENV_ENUM.notInDingTalk, D === sdk_1.ENV_ENUM.pc) {
          B = i.indexOf("Macintosh; Intel Mac OS") > -1 ? sdk_1.ENV_ENUM_SUB.mac : sdk_1.ENV_ENUM_SUB.win;
        }
        var O = apiHelper_1.getGlobalSelf();
        return O.__ddSDK && O.__ddSDK.getEnv ? O.__ddSDK.getEnv() : { platform: D, platformSub: B, version: T, appType: y, language: W };
      };
    }
  });

  // node_modules/promise-polyfill/dist/polyfill.js
  var require_polyfill = __commonJS({
    "node_modules/promise-polyfill/dist/polyfill.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory() : typeof define === "function" && define.amd ? define(factory) : factory();
      })(exports, (function() {
        "use strict";
        var setTimeoutFunc = setTimeout;
        function noop() {
        }
        function bind(fn, thisArg) {
          return function() {
            fn.apply(thisArg, arguments);
          };
        }
        function Promise2(fn) {
          if (!(this instanceof Promise2))
            throw new TypeError("Promises must be constructed via new");
          if (typeof fn !== "function") throw new TypeError("not a function");
          this._state = 0;
          this._handled = false;
          this._value = void 0;
          this._deferreds = [];
          doResolve(fn, this);
        }
        function handle(self2, deferred) {
          while (self2._state === 3) {
            self2 = self2._value;
          }
          if (self2._state === 0) {
            self2._deferreds.push(deferred);
            return;
          }
          self2._handled = true;
          Promise2._immediateFn(function() {
            var cb = self2._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
              (self2._state === 1 ? resolve : reject)(deferred.promise, self2._value);
              return;
            }
            var ret;
            try {
              ret = cb(self2._value);
            } catch (e) {
              reject(deferred.promise, e);
              return;
            }
            resolve(deferred.promise, ret);
          });
        }
        function resolve(self2, newValue) {
          try {
            if (newValue === self2)
              throw new TypeError("A promise cannot be resolved with itself.");
            if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
              var then = newValue.then;
              if (newValue instanceof Promise2) {
                self2._state = 3;
                self2._value = newValue;
                finale(self2);
                return;
              } else if (typeof then === "function") {
                doResolve(bind(then, newValue), self2);
                return;
              }
            }
            self2._state = 1;
            self2._value = newValue;
            finale(self2);
          } catch (e) {
            reject(self2, e);
          }
        }
        function reject(self2, newValue) {
          self2._state = 2;
          self2._value = newValue;
          finale(self2);
        }
        function finale(self2) {
          if (self2._state === 2 && self2._deferreds.length === 0) {
            Promise2._immediateFn(function() {
              if (!self2._handled) {
                Promise2._unhandledRejectionFn(self2._value);
              }
            });
          }
          for (var i = 0, len = self2._deferreds.length; i < len; i++) {
            handle(self2, self2._deferreds[i]);
          }
          self2._deferreds = null;
        }
        function Handler(onFulfilled, onRejected, promise) {
          this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
          this.onRejected = typeof onRejected === "function" ? onRejected : null;
          this.promise = promise;
        }
        function doResolve(fn, self2) {
          var done = false;
          try {
            fn(
              function(value) {
                if (done) return;
                done = true;
                resolve(self2, value);
              },
              function(reason) {
                if (done) return;
                done = true;
                reject(self2, reason);
              }
            );
          } catch (ex) {
            if (done) return;
            done = true;
            reject(self2, ex);
          }
        }
        Promise2.prototype["catch"] = function(onRejected) {
          return this.then(null, onRejected);
        };
        Promise2.prototype.then = function(onFulfilled, onRejected) {
          var prom = new this.constructor(noop);
          handle(this, new Handler(onFulfilled, onRejected, prom));
          return prom;
        };
        Promise2.prototype["finally"] = function(callback) {
          var constructor = this.constructor;
          return this.then(
            function(value) {
              return constructor.resolve(callback()).then(function() {
                return value;
              });
            },
            function(reason) {
              return constructor.resolve(callback()).then(function() {
                return constructor.reject(reason);
              });
            }
          );
        };
        Promise2.all = function(arr) {
          return new Promise2(function(resolve2, reject2) {
            if (!arr || typeof arr.length === "undefined")
              throw new TypeError("Promise.all accepts an array");
            var args = Array.prototype.slice.call(arr);
            if (args.length === 0) return resolve2([]);
            var remaining = args.length;
            function res(i2, val) {
              try {
                if (val && (typeof val === "object" || typeof val === "function")) {
                  var then = val.then;
                  if (typeof then === "function") {
                    then.call(
                      val,
                      function(val2) {
                        res(i2, val2);
                      },
                      reject2
                    );
                    return;
                  }
                }
                args[i2] = val;
                if (--remaining === 0) {
                  resolve2(args);
                }
              } catch (ex) {
                reject2(ex);
              }
            }
            for (var i = 0; i < args.length; i++) {
              res(i, args[i]);
            }
          });
        };
        Promise2.resolve = function(value) {
          if (value && typeof value === "object" && value.constructor === Promise2) {
            return value;
          }
          return new Promise2(function(resolve2) {
            resolve2(value);
          });
        };
        Promise2.reject = function(value) {
          return new Promise2(function(resolve2, reject2) {
            reject2(value);
          });
        };
        Promise2.race = function(values) {
          return new Promise2(function(resolve2, reject2) {
            for (var i = 0, len = values.length; i < len; i++) {
              values[i].then(resolve2, reject2);
            }
          });
        };
        Promise2._immediateFn = typeof setImmediate === "function" && function(fn) {
          setImmediate(fn);
        } || function(fn) {
          setTimeoutFunc(fn, 0);
        };
        Promise2._unhandledRejectionFn = function _unhandledRejectionFn(err) {
          if (typeof console !== "undefined" && console) {
            console.warn("Possible Unhandled Promise Rejection:", err);
          }
        };
        var globalNS = (function() {
          if (typeof self !== "undefined") {
            return self;
          }
          if (typeof window !== "undefined") {
            return window;
          }
          if (typeof global !== "undefined") {
            return global;
          }
          throw new Error("unable to locate global object");
        })();
        if (!globalNS.Promise) {
          globalNS.Promise = Promise2;
        }
      }));
    }
  });

  // node_modules/dingtalk-jsapi/lib/polyfills/es6Promise.js
  var require_es6Promise = __commonJS({
    "node_modules/dingtalk-jsapi/lib/polyfills/es6Promise.js"() {
      "function" != typeof Promise && require_polyfill();
    }
  });

  // node_modules/dingtalk-jsapi/lib/polyfills/objectAssign.js
  var require_objectAssign = __commonJS({
    "node_modules/dingtalk-jsapi/lib/polyfills/objectAssign.js"() {
      "function" != typeof Object.assign && Object.defineProperty(Object, "assign", { value: function(e, t) {
        "use strict";
        if (null == e) throw new TypeError("Cannot convert undefined or null to object");
        for (var n = Object(e), r = 1; r < arguments.length; r++) {
          var o = arguments[r];
          if (null != o) for (var c in o) Object.prototype.hasOwnProperty.call(o, c) && (n[c] = o[c]);
        }
        return n;
      }, writable: true, configurable: true });
    }
  });

  // node_modules/dingtalk-jsapi/lib/polyfills/objectKeys.js
  var require_objectKeys = __commonJS({
    "node_modules/dingtalk-jsapi/lib/polyfills/objectKeys.js"() {
      Object.keys || (Object.keys = function(e) {
        if (e !== Object(e)) throw new TypeError("Object.keys called on a non-object");
        var t, r = [];
        for (t in e) Object.prototype.hasOwnProperty.call(e, t) && r.push(t);
        return r;
      });
    }
  });

  // node_modules/dingtalk-jsapi/lib/polyfills/index.js
  var require_polyfills = __commonJS({
    "node_modules/dingtalk-jsapi/lib/polyfills/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), require_es6Promise(), require_objectAssign(), require_objectKeys();
    }
  });

  // node_modules/dingtalk-jsapi/lib/ddSdk.js
  var require_ddSdk = __commonJS({
    "node_modules/dingtalk-jsapi/lib/ddSdk.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.ddSdk = void 0;
      var env_1 = require_env();
      var env_2 = require_env();
      Object.defineProperty(exports, "ENV_ENUM", { enumerable: true, get: function() {
        return env_2.ENV_ENUM;
      } }), Object.defineProperty(exports, "ENV_ENUM_SUB", { enumerable: true, get: function() {
        return env_2.ENV_ENUM_SUB;
      } });
      var sdk_1 = require_sdk();
      require_polyfills();
      var apiHelper_1 = require_apiHelper();
      var g = apiHelper_1.getGlobalSelf();
      exports.ddSdk = g.__useNativeSDK ? g.__ddSDK : new sdk_1.Sdk(env_1.getENV());
    }
  });

  // node_modules/dingtalk-jsapi/lib/otherApi.js
  var require_otherApi = __commonJS({
    "node_modules/dingtalk-jsapi/lib/otherApi.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.version = exports.language = exports.compareVersion = exports.other = exports.harmony = exports.pc = exports.android = exports.ios = void 0;
      var env_1 = require_env();
      var ENV = env_1.getENV();
      exports.ios = ENV.platform === env_1.ENV_ENUM.ios, exports.android = ENV.platform === env_1.ENV_ENUM.android, exports.pc = ENV.platform === env_1.ENV_ENUM.pc, exports.harmony = ENV.platform === env_1.ENV_ENUM.harmony, exports.other = ENV.platform === env_1.ENV_ENUM.notInDingTalk, exports.compareVersion = function(e, r, o) {
        function t(e2) {
          return parseInt(e2, 10) || 0;
        }
        if ("string" != typeof e || "string" != typeof r) return false;
        for (var n, p, s = e.split("-")[0].split(".").map(t), i = r.split("-")[0].split(".").map(t); n === p && i.length > 0; ) n = s.shift(), p = i.shift();
        return o ? (p || 0) >= (n || 0) : (p || 0) > (n || 0);
      }, exports.language = ENV.language, exports.version = ENV.version;
    }
  });

  // node_modules/dingtalk-jsapi/core.js
  var require_core = __commonJS({
    "node_modules/dingtalk-jsapi/core.js"(exports, module) {
      "use strict";
      var ddSdk_1 = require_ddSdk();
      var otherApi = require_otherApi();
      var core = Object.assign({}, otherApi, ddSdk_1.ddSdk.getExportSdk());
      module.exports = core;
    }
  });

  // node_modules/dingtalk-jsapi/lib/packages/frame-talk-client-pc/index.js
  var require_frame_talk_client_pc = __commonJS({
    "node_modules/dingtalk-jsapi/lib/packages/frame-talk-client-pc/index.js"(exports, module) {
      !(function(t, e) {
        "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.dd = e() : t.dd = e();
      })(exports, function() {
        return (function(t) {
          function e(r) {
            if (n[r]) return n[r].exports;
            var o = n[r] = { i: r, l: false, exports: {} };
            return t[r].call(o.exports, o, o.exports, e), o.l = true, o.exports;
          }
          var n = {};
          return e.m = t, e.c = n, e.i = function(t2) {
            return t2;
          }, e.d = function(t2, n2, r) {
            e.o(t2, n2) || Object.defineProperty(t2, n2, { configurable: false, enumerable: true, get: r });
          }, e.n = function(t2) {
            var n2 = t2 && t2.__esModule ? function() {
              return t2.default;
            } : function() {
              return t2;
            };
            return e.d(n2, "a", n2), n2;
          }, e.o = function(t2, e2) {
            return Object.prototype.hasOwnProperty.call(t2, e2);
          }, e.p = "", e(e.s = 5);
        })([function(t, e, n) {
          "use strict";
          var r = n(2), o = n(3), i = n(1), u = n(4), c = new i(), a = false, s = "", f = null, l = [".dingtalk.com", "7ding.ai"], p = {}, h = /{.*}/;
          try {
            if (window.dd_bridge_config) var d = window.dd_bridge_config.match(h);
            else var d = window.name.match(h);
            if (d && d[0]) var p = JSON.parse(d[0]);
          } catch (t2) {
            p = {};
          }
          if (p.hostOrigin) {
            var v = p.hostOrigin.split(":")[1];
            l.forEach(function(t2) {
              v.slice(0 - t2.length) === t2 && p.containerId && (a = true, s = p.hostOrigin, f = p.containerId);
            });
          }
          var y = {}, _ = new Promise(function(t2, e2) {
            y._resolve = t2, y._reject = e2;
          }), b = {}, g = null;
          window.top !== window ? (g = p.corsIframe ? window : window.top, y._resolve()) : "object" == typeof dingtalk && "object" == typeof dingtalk.platform && "function" == typeof dingtalk.platform.invokeAPI && (g = window, y._resolve()), b[u.SYS_INIT] = function(t2) {
            g = t2.frameWindow, y._resolve(), t2.respond({});
          }, window.addEventListener("message", function(t2) {
            var e2 = t2.data, n2 = t2.origin;
            if (n2 === s) {
              if ("response" === e2.type && e2.msgId) {
                var r2 = e2.msgId, i2 = c.getMsyById(r2);
                i2 && i2.methodName !== u.SYS_EVENT && i2.receiveResponse(e2.body, !e2.success);
              } else if ("event" === e2.type && e2.msgId) {
                var r2 = e2.msgId, i2 = c.getMsyById(r2);
                i2 && i2.receiveEvent(e2.eventName, e2.body);
              } else if ("request" === e2.type && e2.msgId) {
                var i2 = new o(t2.source, n2, e2);
                b[i2.methodName] && b[i2.methodName](i2);
              }
            }
          }), e.invokeAPI = function(t2, e2) {
            var n2 = new r(f, t2, e2);
            return a && _.then(function() {
              g && g.postMessage(n2.getPayload(), s), c.addPending(n2);
            }), n2;
          };
          var m = null;
          e.addEventListener = function(t2, n2) {
            m || (m = e.invokeAPI(u.SYS_EVENT, {})), m.addEventListener(t2, n2);
          }, e.removeEventListener = function(t2, e2) {
            m && m.removeEventListener(t2, e2);
          };
        }, function(t, e, n) {
          "use strict";
          var r = function() {
            this.pendingMsgs = {};
          };
          r.prototype.addPending = function(t2) {
            this.pendingMsgs[t2.id] = t2;
            var e2 = (function() {
              delete this.pendingMsgs[t2.id], t2.removeEventListener("_finish", e2);
            }).bind(this);
            t2.addEventListener("_finish", e2);
          }, r.prototype.getMsyById = function(t2) {
            return this.pendingMsgs[t2];
          }, t.exports = r;
        }, function(t, e, n) {
          "use strict";
          var r = n(8), o = n(7), i = 0, u = Math.floor(1e3 * Math.random()), c = function() {
            return 1e3 * (1e3 * u + Math.floor(1e3 * Math.random())) + ++i % 1e3;
          }, a = { code: 408, reason: "timeout" }, s = { TIMEOUT: "_timeout", FINISH: "_finish" }, f = { timeout: -1 }, l = function(t2, e2, n2, r2) {
            this.id = c(), this.methodName = e2, this.containerId = t2, this.option = o({}, f, r2);
            var n2 = n2 || {};
            this._p = {}, this.result = new Promise((function(t3, e3) {
              this._p._resolve = t3, this._p._reject = e3;
            }).bind(this)), this.callbacks = {}, this.plainMsg = this._handleMsg(n2), this._eventsHandle = {}, this._timeoutTimer = null, this._initTimeout(), this.isFinish = false;
          };
          l.prototype._initTimeout = function() {
            this._clearTimeout(), this.option.timeout > 0 && (this._timeoutTimer = setTimeout((function() {
              this.receiveEvent(s.TIMEOUT), this.receiveResponse(a, true);
            }).bind(this), this.option.timeout));
          }, l.prototype._clearTimeout = function() {
            clearTimeout(this._timeoutTimer);
          }, l.prototype._handleMsg = function(t2) {
            var e2 = {};
            return Object.keys(t2).forEach((function(n2) {
              var o2 = t2[n2];
              "function" == typeof o2 && "on" === n2.slice(0, 2) ? this.callbacks[n2] = o2 : e2[n2] = r(o2);
            }).bind(this)), e2;
          }, l.prototype.getPayload = function() {
            return { msgId: this.id, containerId: this.containerId, methodName: this.methodName, body: this.plainMsg, type: "request" };
          }, l.prototype.receiveEvent = function(t2, e2) {
            if (this.isFinish && t2 !== s.FINISH) return false;
            t2 !== s.FINISH && t2 !== s.TIMEOUT && this._initTimeout(), Array.isArray(this._eventsHandle[t2]) && this._eventsHandle[t2].forEach(function(t3) {
              try {
                t3(e2);
              } catch (t4) {
                console.error(e2);
              }
            });
            var n2 = "on" + t2.charAt(0).toUpperCase() + t2.slice(1);
            return this.callbacks[n2] && this.callbacks[n2](e2), true;
          }, l.prototype.addEventListener = function(t2, e2) {
            if (!t2 || "function" != typeof e2) throw "eventName is null or handle is not a function, addEventListener fail";
            Array.isArray(this._eventsHandle[t2]) || (this._eventsHandle[t2] = []), this._eventsHandle[t2].push(e2);
          }, l.prototype.removeEventListener = function(t2, e2) {
            if (!t2 || !e2) throw "eventName is null or handle is null, invoke removeEventListener fail";
            if (Array.isArray(this._eventsHandle[t2])) {
              var n2 = this._eventsHandle[t2].indexOf(e2);
              -1 !== n2 && this._eventsHandle[t2].splice(n2, 1);
            }
          }, l.prototype.receiveResponse = function(t2, e2) {
            if (true === this.isFinish) return false;
            this._clearTimeout();
            var e2 = !!e2;
            return e2 ? this._p._reject(t2) : this._p._resolve(t2), setTimeout((function() {
              this.receiveEvent(s.FINISH);
            }).bind(this), 0), this.isFinish = true, true;
          }, t.exports = l;
        }, function(t, e, n) {
          "use strict";
          var r = function(t2, e2, n2) {
            if (this._msgId = n2.msgId, this.frameWindow = t2, this.methodName = n2.methodName, this.clientOrigin = e2, this.containerId = n2.containerId, this.params = n2.body, !this._msgId) throw "msgId not exist";
            if (!this.frameWindow) throw "frameWindow not exist";
            if (!this.methodName) throw "methodName not exits";
            if (!this.clientOrigin) throw "clientOrigin not exist";
            this.hasResponded = false;
          };
          r.prototype.respond = function(t2, e2) {
            var e2 = !!e2;
            if (true !== this.hasResponded) {
              var n2 = { type: "response", success: !e2, body: t2, msgId: this._msgId };
              this.frameWindow.postMessage(n2, this.clientOrigin), this.hasResponded = true;
            }
          }, r.prototype.emit = function(t2, e2) {
            var n2 = { type: "event", eventName: t2, body: e2, msgId: this._msgId };
            this.frameWindow.postMessage(n2, this.clientOrigin);
          }, t.exports = r;
        }, function(t, e, n) {
          "use strict";
          t.exports = { SYS_EVENT: "SYS_openAPIContainerInitEvent", SYS_INIT: "SYS_openAPIContainerInit" };
        }, function(t, e, n) {
          "use strict";
          var r = n(0);
          t.exports = r;
        }, function(t, e, n) {
          (function(t2, n2) {
            function r(t3, e2) {
              return t3.set(e2[0], e2[1]), t3;
            }
            function o(t3, e2) {
              return t3.add(e2), t3;
            }
            function i(t3, e2) {
              for (var n3 = -1, r2 = t3.length; ++n3 < r2 && false !== e2(t3[n3], n3, t3); ) ;
              return t3;
            }
            function u(t3, e2) {
              for (var n3 = -1, r2 = e2.length, o2 = t3.length; ++n3 < r2; ) t3[o2 + n3] = e2[n3];
              return t3;
            }
            function c(t3, e2, n3, r2) {
              var o2 = -1, i2 = t3.length;
              for (r2 && i2 && (n3 = t3[++o2]); ++o2 < i2; ) n3 = e2(n3, t3[o2], o2, t3);
              return n3;
            }
            function a(t3, e2) {
              for (var n3 = -1, r2 = Array(t3); ++n3 < t3; ) r2[n3] = e2(n3);
              return r2;
            }
            function s(t3) {
              return t3 && t3.Object === Object ? t3 : null;
            }
            function f(t3) {
              var e2 = false;
              if (null != t3 && "function" != typeof t3.toString) try {
                e2 = !!(t3 + "");
              } catch (t4) {
              }
              return e2;
            }
            function l(t3) {
              var e2 = -1, n3 = Array(t3.size);
              return t3.forEach(function(t4, r2) {
                n3[++e2] = [r2, t4];
              }), n3;
            }
            function p(t3) {
              var e2 = -1, n3 = Array(t3.size);
              return t3.forEach(function(t4) {
                n3[++e2] = t4;
              }), n3;
            }
            function h(t3) {
              var e2 = -1, n3 = t3 ? t3.length : 0;
              for (this.clear(); ++e2 < n3; ) {
                var r2 = t3[e2];
                this.set(r2[0], r2[1]);
              }
            }
            function d() {
              this.__data__ = ke ? ke(null) : {};
            }
            function v(t3) {
              return this.has(t3) && delete this.__data__[t3];
            }
            function y(t3) {
              var e2 = this.__data__;
              if (ke) {
                var n3 = e2[t3];
                return n3 === St ? void 0 : n3;
              }
              return ye.call(e2, t3) ? e2[t3] : void 0;
            }
            function _(t3) {
              var e2 = this.__data__;
              return ke ? void 0 !== e2[t3] : ye.call(e2, t3);
            }
            function b(t3, e2) {
              return this.__data__[t3] = ke && void 0 === e2 ? St : e2, this;
            }
            function g(t3) {
              var e2 = -1, n3 = t3 ? t3.length : 0;
              for (this.clear(); ++e2 < n3; ) {
                var r2 = t3[e2];
                this.set(r2[0], r2[1]);
              }
            }
            function m() {
              this.__data__ = [];
            }
            function w(t3) {
              var e2 = this.__data__, n3 = W(e2, t3);
              return !(n3 < 0 || (n3 == e2.length - 1 ? e2.pop() : Ae.call(e2, n3, 1), 0));
            }
            function j(t3) {
              var e2 = this.__data__, n3 = W(e2, t3);
              return n3 < 0 ? void 0 : e2[n3][1];
            }
            function I(t3) {
              return W(this.__data__, t3) > -1;
            }
            function O(t3, e2) {
              var n3 = this.__data__, r2 = W(n3, t3);
              return r2 < 0 ? n3.push([t3, e2]) : n3[r2][1] = e2, this;
            }
            function A(t3) {
              var e2 = -1, n3 = t3 ? t3.length : 0;
              for (this.clear(); ++e2 < n3; ) {
                var r2 = t3[e2];
                this.set(r2[0], r2[1]);
              }
            }
            function x() {
              this.__data__ = { hash: new h(), map: new (Me || g)(), string: new h() };
            }
            function E(t3) {
              return rt(this, t3).delete(t3);
            }
            function S(t3) {
              return rt(this, t3).get(t3);
            }
            function M(t3) {
              return rt(this, t3).has(t3);
            }
            function N(t3, e2) {
              return rt(this, t3).set(t3, e2), this;
            }
            function P(t3) {
              this.__data__ = new g(t3);
            }
            function T() {
              this.__data__ = new g();
            }
            function k(t3) {
              return this.__data__.delete(t3);
            }
            function F(t3) {
              return this.__data__.get(t3);
            }
            function H(t3) {
              return this.__data__.has(t3);
            }
            function L(t3, e2) {
              var n3 = this.__data__;
              return n3 instanceof g && n3.__data__.length == Et && (n3 = this.__data__ = new A(n3.__data__)), n3.set(t3, e2), this;
            }
            function $(t3, e2, n3) {
              var r2 = t3[e2];
              ye.call(t3, e2) && yt(r2, n3) && (void 0 !== n3 || e2 in t3) || (t3[e2] = n3);
            }
            function W(t3, e2) {
              for (var n3 = t3.length; n3--; ) if (yt(t3[n3][0], e2)) return n3;
              return -1;
            }
            function U(t3, e2) {
              return t3 && tt(e2, xt(e2), t3);
            }
            function R(t3, e2, n3, r2, o2, u2, c2) {
              var a2;
              if (r2 && (a2 = u2 ? r2(t3, o2, u2, c2) : r2(t3)), void 0 !== a2) return a2;
              if (!jt(t3)) return t3;
              var s2 = Ye(t3);
              if (s2) {
                if (a2 = at(t3), !e2) return Z(t3, a2);
              } else {
                var l2 = ct(t3), p2 = l2 == kt || l2 == Ft;
                if (Ce(t3)) return D(t3, e2);
                if (l2 == $t || l2 == Nt || p2 && !u2) {
                  if (f(t3)) return u2 ? t3 : {};
                  if (a2 = st(p2 ? {} : t3), !e2) return et(t3, U(a2, t3));
                } else {
                  if (!re[l2]) return u2 ? t3 : {};
                  a2 = ft(t3, l2, R, e2);
                }
              }
              c2 || (c2 = new P());
              var h2 = c2.get(t3);
              if (h2) return h2;
              if (c2.set(t3, a2), !s2) var d2 = n3 ? nt(t3) : xt(t3);
              return i(d2 || t3, function(o3, i2) {
                d2 && (i2 = o3, o3 = t3[i2]), $(a2, i2, R(o3, e2, n3, r2, i2, t3, c2));
              }), a2;
            }
            function B(t3) {
              return jt(t3) ? Ie(t3) : {};
            }
            function Y(t3, e2, n3) {
              var r2 = e2(t3);
              return Ye(t3) ? r2 : u(r2, n3(t3));
            }
            function C(t3, e2) {
              return ye.call(t3, e2) || "object" == typeof t3 && e2 in t3 && null === it(t3);
            }
            function V(t3) {
              return Ee(Object(t3));
            }
            function D(t3, e2) {
              if (e2) return t3.slice();
              var n3 = new t3.constructor(t3.length);
              return t3.copy(n3), n3;
            }
            function G(t3) {
              var e2 = new t3.constructor(t3.byteLength);
              return new we(e2).set(new we(t3)), e2;
            }
            function q(t3, e2) {
              var n3 = e2 ? G(t3.buffer) : t3.buffer;
              return new t3.constructor(n3, t3.byteOffset, t3.byteLength);
            }
            function z(t3, e2, n3) {
              return c(e2 ? n3(l(t3), true) : l(t3), r, new t3.constructor());
            }
            function J(t3) {
              var e2 = new t3.constructor(t3.source, te.exec(t3));
              return e2.lastIndex = t3.lastIndex, e2;
            }
            function K(t3, e2, n3) {
              return c(e2 ? n3(p(t3), true) : p(t3), o, new t3.constructor());
            }
            function Q(t3) {
              return Re ? Object(Re.call(t3)) : {};
            }
            function X(t3, e2) {
              var n3 = e2 ? G(t3.buffer) : t3.buffer;
              return new t3.constructor(n3, t3.byteOffset, t3.length);
            }
            function Z(t3, e2) {
              var n3 = -1, r2 = t3.length;
              for (e2 || (e2 = Array(r2)); ++n3 < r2; ) e2[n3] = t3[n3];
              return e2;
            }
            function tt(t3, e2, n3, r2) {
              n3 || (n3 = {});
              for (var o2 = -1, i2 = e2.length; ++o2 < i2; ) {
                var u2 = e2[o2];
                $(n3, u2, r2 ? r2(n3[u2], t3[u2], u2, n3, t3) : t3[u2]);
              }
              return n3;
            }
            function et(t3, e2) {
              return tt(t3, ut(t3), e2);
            }
            function nt(t3) {
              return Y(t3, xt, ut);
            }
            function rt(t3, e2) {
              var n3 = t3.__data__;
              return ht(e2) ? n3["string" == typeof e2 ? "string" : "hash"] : n3.map;
            }
            function ot(t3, e2) {
              var n3 = t3[e2];
              return Ot(n3) ? n3 : void 0;
            }
            function it(t3) {
              return xe(Object(t3));
            }
            function ut(t3) {
              return je(Object(t3));
            }
            function ct(t3) {
              return _e.call(t3);
            }
            function at(t3) {
              var e2 = t3.length, n3 = t3.constructor(e2);
              return e2 && "string" == typeof t3[0] && ye.call(t3, "index") && (n3.index = t3.index, n3.input = t3.input), n3;
            }
            function st(t3) {
              return "function" != typeof t3.constructor || dt(t3) ? {} : B(it(t3));
            }
            function ft(t3, e2, n3, r2) {
              var o2 = t3.constructor;
              switch (e2) {
                case Yt:
                  return G(t3);
                case Pt:
                case Tt:
                  return new o2(+t3);
                case Ct:
                  return q(t3, r2);
                case Vt:
                case Dt:
                case Gt:
                case qt:
                case zt:
                case Jt:
                case Kt:
                case Qt:
                case Xt:
                  return X(t3, r2);
                case Ht:
                  return z(t3, r2, n3);
                case Lt:
                case Rt:
                  return new o2(t3);
                case Wt:
                  return J(t3);
                case Ut:
                  return K(t3, r2, n3);
                case Bt:
                  return Q(t3);
              }
            }
            function lt(t3) {
              var e2 = t3 ? t3.length : void 0;
              return wt(e2) && (Ye(t3) || At(t3) || _t(t3)) ? a(e2, String) : null;
            }
            function pt(t3, e2) {
              return !!(e2 = null == e2 ? Mt : e2) && ("number" == typeof t3 || ne.test(t3)) && t3 > -1 && t3 % 1 == 0 && t3 < e2;
            }
            function ht(t3) {
              var e2 = typeof t3;
              return "string" == e2 || "number" == e2 || "symbol" == e2 || "boolean" == e2 ? "__proto__" !== t3 : null === t3;
            }
            function dt(t3) {
              var e2 = t3 && t3.constructor;
              return t3 === ("function" == typeof e2 && e2.prototype || de);
            }
            function vt(t3) {
              if (null != t3) {
                try {
                  return ve.call(t3);
                } catch (t4) {
                }
                try {
                  return t3 + "";
                } catch (t4) {
                }
              }
              return "";
            }
            function yt(t3, e2) {
              return t3 === e2 || t3 !== t3 && e2 !== e2;
            }
            function _t(t3) {
              return gt(t3) && ye.call(t3, "callee") && (!Oe.call(t3, "callee") || _e.call(t3) == Nt);
            }
            function bt(t3) {
              return null != t3 && wt(Be(t3)) && !mt(t3);
            }
            function gt(t3) {
              return It(t3) && bt(t3);
            }
            function mt(t3) {
              var e2 = jt(t3) ? _e.call(t3) : "";
              return e2 == kt || e2 == Ft;
            }
            function wt(t3) {
              return "number" == typeof t3 && t3 > -1 && t3 % 1 == 0 && t3 <= Mt;
            }
            function jt(t3) {
              var e2 = typeof t3;
              return !!t3 && ("object" == e2 || "function" == e2);
            }
            function It(t3) {
              return !!t3 && "object" == typeof t3;
            }
            function Ot(t3) {
              return !!jt(t3) && (mt(t3) || f(t3) ? be : ee).test(vt(t3));
            }
            function At(t3) {
              return "string" == typeof t3 || !Ye(t3) && It(t3) && _e.call(t3) == Rt;
            }
            function xt(t3) {
              var e2 = dt(t3);
              if (!e2 && !bt(t3)) return V(t3);
              var n3 = lt(t3), r2 = !!n3, o2 = n3 || [], i2 = o2.length;
              for (var u2 in t3) !C(t3, u2) || r2 && ("length" == u2 || pt(u2, i2)) || e2 && "constructor" == u2 || o2.push(u2);
              return o2;
            }
            var Et = 200, St = "__lodash_hash_undefined__", Mt = 9007199254740991, Nt = "[object Arguments]", Pt = "[object Boolean]", Tt = "[object Date]", kt = "[object Function]", Ft = "[object GeneratorFunction]", Ht = "[object Map]", Lt = "[object Number]", $t = "[object Object]", Wt = "[object RegExp]", Ut = "[object Set]", Rt = "[object String]", Bt = "[object Symbol]", Yt = "[object ArrayBuffer]", Ct = "[object DataView]", Vt = "[object Float32Array]", Dt = "[object Float64Array]", Gt = "[object Int8Array]", qt = "[object Int16Array]", zt = "[object Int32Array]", Jt = "[object Uint8Array]", Kt = "[object Uint8ClampedArray]", Qt = "[object Uint16Array]", Xt = "[object Uint32Array]", Zt = /[\\^$.*+?()[\]{}|]/g, te = /\w*$/, ee = /^\[object .+?Constructor\]$/, ne = /^(?:0|[1-9]\d*)$/, re = {};
            re[Nt] = re["[object Array]"] = re[Yt] = re[Ct] = re[Pt] = re[Tt] = re[Vt] = re[Dt] = re[Gt] = re[qt] = re[zt] = re[Ht] = re[Lt] = re[$t] = re[Wt] = re[Ut] = re[Rt] = re[Bt] = re[Jt] = re[Kt] = re[Qt] = re[Xt] = true, re["[object Error]"] = re[kt] = re["[object WeakMap]"] = false;
            var oe = { function: true, object: true }, ie = oe[typeof e] && e && !e.nodeType ? e : void 0, ue = oe[typeof t2] && t2 && !t2.nodeType ? t2 : void 0, ce = ue && ue.exports === ie ? ie : void 0, ae = s(ie && ue && "object" == typeof n2 && n2), se = s(oe[typeof self] && self), fe = s(oe[typeof window] && window), le = s(oe[typeof this] && this), pe = ae || fe !== (le && le.window) && fe || se || le || Function("return this")(), he = Array.prototype, de = Object.prototype, ve = Function.prototype.toString, ye = de.hasOwnProperty, _e = de.toString, be = RegExp("^" + ve.call(ye).replace(Zt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), ge = ce ? pe.Buffer : void 0, me = pe.Symbol, we = pe.Uint8Array, je = Object.getOwnPropertySymbols, Ie = Object.create, Oe = de.propertyIsEnumerable, Ae = he.splice, xe = Object.getPrototypeOf, Ee = Object.keys, Se = ot(pe, "DataView"), Me = ot(pe, "Map"), Ne = ot(pe, "Promise"), Pe = ot(pe, "Set"), Te = ot(pe, "WeakMap"), ke = ot(Object, "create"), Fe = vt(Se), He = vt(Me), Le = vt(Ne), $e = vt(Pe), We = vt(Te), Ue = me ? me.prototype : void 0, Re = Ue ? Ue.valueOf : void 0;
            h.prototype.clear = d, h.prototype.delete = v, h.prototype.get = y, h.prototype.has = _, h.prototype.set = b, g.prototype.clear = m, g.prototype.delete = w, g.prototype.get = j, g.prototype.has = I, g.prototype.set = O, A.prototype.clear = x, A.prototype.delete = E, A.prototype.get = S, A.prototype.has = M, A.prototype.set = N, P.prototype.clear = T, P.prototype.delete = k, P.prototype.get = F, P.prototype.has = H, P.prototype.set = L;
            var Be = /* @__PURE__ */ (function(t3) {
              return function(t4) {
                return null == t4 ? void 0 : t4.length;
              };
            })();
            je || (ut = function() {
              return [];
            }), (Se && ct(new Se(new ArrayBuffer(1))) != Ct || Me && ct(new Me()) != Ht || Ne && "[object Promise]" != ct(Ne.resolve()) || Pe && ct(new Pe()) != Ut || Te && "[object WeakMap]" != ct(new Te())) && (ct = function(t3) {
              var e2 = _e.call(t3), n3 = e2 == $t ? t3.constructor : void 0, r2 = n3 ? vt(n3) : void 0;
              if (r2) switch (r2) {
                case Fe:
                  return Ct;
                case He:
                  return Ht;
                case Le:
                  return "[object Promise]";
                case $e:
                  return Ut;
                case We:
                  return "[object WeakMap]";
              }
              return e2;
            });
            var Ye = Array.isArray, Ce = ge ? function(t3) {
              return t3 instanceof ge;
            } : /* @__PURE__ */ (function(t3) {
              return function() {
                return false;
              };
            })();
            t2.exports = R;
          }).call(e, n(12)(t), n(11));
        }, function(t, e, n) {
          function r(t2, e2, n2) {
            var r2 = t2[e2];
            m.call(t2, e2) && a(r2, n2) && (void 0 !== n2 || e2 in t2) || (t2[e2] = n2);
          }
          function o(t2, e2, n2, o2) {
            n2 || (n2 = {});
            for (var i2 = -1, u2 = e2.length; ++i2 < u2; ) {
              var c2 = e2[i2];
              r(n2, c2, o2 ? o2(n2[c2], t2[c2], c2, n2, t2) : t2[c2]);
            }
            return n2;
          }
          function i(t2, e2) {
            return !!(e2 = null == e2 ? v : e2) && ("number" == typeof t2 || b.test(t2)) && t2 > -1 && t2 % 1 == 0 && t2 < e2;
          }
          function u(t2, e2, n2) {
            if (!p(n2)) return false;
            var r2 = typeof e2;
            return !!("number" == r2 ? s(n2) && i(e2, n2.length) : "string" == r2 && e2 in n2) && a(n2[e2], t2);
          }
          function c(t2) {
            var e2 = t2 && t2.constructor;
            return t2 === ("function" == typeof e2 && e2.prototype || g);
          }
          function a(t2, e2) {
            return t2 === e2 || t2 !== t2 && e2 !== e2;
          }
          function s(t2) {
            return null != t2 && l(O(t2)) && !f(t2);
          }
          function f(t2) {
            var e2 = p(t2) ? w.call(t2) : "";
            return e2 == y || e2 == _;
          }
          function l(t2) {
            return "number" == typeof t2 && t2 > -1 && t2 % 1 == 0 && t2 <= v;
          }
          function p(t2) {
            var e2 = typeof t2;
            return !!t2 && ("object" == e2 || "function" == e2);
          }
          var h = n(9), d = n(10), v = 9007199254740991, y = "[object Function]", _ = "[object GeneratorFunction]", b = /^(?:0|[1-9]\d*)$/, g = Object.prototype, m = g.hasOwnProperty, w = g.toString, j = g.propertyIsEnumerable, I = !j.call({ valueOf: 1 }, "valueOf"), O = /* @__PURE__ */ (function(t2) {
            return function(t3) {
              return null == t3 ? void 0 : t3.length;
            };
          })(), A = (function(t2) {
            return d(function(e2, n2) {
              var r2 = -1, o2 = n2.length, i2 = o2 > 1 ? n2[o2 - 1] : void 0, c2 = o2 > 2 ? n2[2] : void 0;
              for (i2 = t2.length > 3 && "function" == typeof i2 ? (o2--, i2) : void 0, c2 && u(n2[0], n2[1], c2) && (i2 = o2 < 3 ? void 0 : i2, o2 = 1), e2 = Object(e2); ++r2 < o2; ) {
                var a2 = n2[r2];
                a2 && t2(e2, a2);
              }
              return e2;
            });
          })(function(t2, e2) {
            if (I || c(e2) || s(e2)) return void o(e2, h(e2), t2);
            for (var n2 in e2) m.call(e2, n2) && r(t2, n2, e2[n2]);
          });
          t.exports = A;
        }, function(t, e, n) {
          function r(t2) {
            return o(t2, true, true);
          }
          var o = n(6);
          t.exports = r;
        }, function(t, e) {
          function n(t2, e2) {
            for (var n2 = -1, r2 = Array(t2); ++n2 < t2; ) r2[n2] = e2(n2);
            return r2;
          }
          function r(t2, e2) {
            var r2 = A(t2) || c(t2) ? n(t2.length, String) : [], o2 = r2.length, u2 = !!o2;
            for (var a2 in t2) !e2 && !w.call(t2, a2) || u2 && ("length" == a2 || i(a2, o2)) || r2.push(a2);
            return r2;
          }
          function o(t2) {
            if (!u(t2)) return O(t2);
            var e2 = [];
            for (var n2 in Object(t2)) w.call(t2, n2) && "constructor" != n2 && e2.push(n2);
            return e2;
          }
          function i(t2, e2) {
            return !!(e2 = null == e2 ? v : e2) && ("number" == typeof t2 || g.test(t2)) && t2 > -1 && t2 % 1 == 0 && t2 < e2;
          }
          function u(t2) {
            var e2 = t2 && t2.constructor;
            return t2 === ("function" == typeof e2 && e2.prototype || m);
          }
          function c(t2) {
            return s(t2) && w.call(t2, "callee") && (!I.call(t2, "callee") || j.call(t2) == y);
          }
          function a(t2) {
            return null != t2 && l(t2.length) && !f(t2);
          }
          function s(t2) {
            return h(t2) && a(t2);
          }
          function f(t2) {
            var e2 = p(t2) ? j.call(t2) : "";
            return e2 == _ || e2 == b;
          }
          function l(t2) {
            return "number" == typeof t2 && t2 > -1 && t2 % 1 == 0 && t2 <= v;
          }
          function p(t2) {
            var e2 = typeof t2;
            return !!t2 && ("object" == e2 || "function" == e2);
          }
          function h(t2) {
            return !!t2 && "object" == typeof t2;
          }
          function d(t2) {
            return a(t2) ? r(t2) : o(t2);
          }
          var v = 9007199254740991, y = "[object Arguments]", _ = "[object Function]", b = "[object GeneratorFunction]", g = /^(?:0|[1-9]\d*)$/, m = Object.prototype, w = m.hasOwnProperty, j = m.toString, I = m.propertyIsEnumerable, O = /* @__PURE__ */ (function(t2, e2) {
            return function(n2) {
              return t2(e2(n2));
            };
          })(Object.keys, Object), A = Array.isArray;
          t.exports = d;
        }, function(t, e) {
          function n(t2, e2, n2) {
            switch (n2.length) {
              case 0:
                return t2.call(e2);
              case 1:
                return t2.call(e2, n2[0]);
              case 2:
                return t2.call(e2, n2[0], n2[1]);
              case 3:
                return t2.call(e2, n2[0], n2[1], n2[2]);
            }
            return t2.apply(e2, n2);
          }
          function r(t2, e2) {
            return e2 = I(void 0 === e2 ? t2.length - 1 : e2, 0), function() {
              for (var r2 = arguments, o2 = -1, i2 = I(r2.length - e2, 0), u2 = Array(i2); ++o2 < i2; ) u2[o2] = r2[e2 + o2];
              o2 = -1;
              for (var c2 = Array(e2 + 1); ++o2 < e2; ) c2[o2] = r2[o2];
              return c2[e2] = u2, n(t2, this, c2);
            };
          }
          function o(t2, e2) {
            if ("function" != typeof t2) throw new TypeError(l);
            return e2 = void 0 === e2 ? e2 : s(e2), r(t2, e2);
          }
          function i(t2) {
            var e2 = typeof t2;
            return !!t2 && ("object" == e2 || "function" == e2);
          }
          function u(t2) {
            return !!t2 && "object" == typeof t2;
          }
          function c(t2) {
            return "symbol" == typeof t2 || u(t2) && j.call(t2) == v;
          }
          function a(t2) {
            return t2 ? (t2 = f(t2)) === p || t2 === -p ? (t2 < 0 ? -1 : 1) * h : t2 === t2 ? t2 : 0 : 0 === t2 ? t2 : 0;
          }
          function s(t2) {
            var e2 = a(t2), n2 = e2 % 1;
            return e2 === e2 ? n2 ? e2 - n2 : e2 : 0;
          }
          function f(t2) {
            if ("number" == typeof t2) return t2;
            if (c(t2)) return d;
            if (i(t2)) {
              var e2 = "function" == typeof t2.valueOf ? t2.valueOf() : t2;
              t2 = i(e2) ? e2 + "" : e2;
            }
            if ("string" != typeof t2) return 0 === t2 ? t2 : +t2;
            t2 = t2.replace(y, "");
            var n2 = b.test(t2);
            return n2 || g.test(t2) ? m(t2.slice(2), n2 ? 2 : 8) : _.test(t2) ? d : +t2;
          }
          var l = "Expected a function", p = 1 / 0, h = 17976931348623157e292, d = NaN, v = "[object Symbol]", y = /^\s+|\s+$/g, _ = /^[-+]0x[0-9a-f]+$/i, b = /^0b[01]+$/i, g = /^0o[0-7]+$/i, m = parseInt, w = Object.prototype, j = w.toString, I = Math.max;
          t.exports = o;
        }, function(t, e) {
          var n;
          n = /* @__PURE__ */ (function() {
            return this;
          })();
          try {
            n = n || Function("return this")() || (0, eval)("this");
          } catch (t2) {
            "object" == typeof window && (n = window);
          }
          t.exports = n;
        }, function(t, e) {
          t.exports = function(t2) {
            return t2.webpackPolyfill || (t2.deprecate = function() {
            }, t2.paths = [], t2.children || (t2.children = []), Object.defineProperty(t2, "loaded", { enumerable: true, get: function() {
              return t2.l;
            } }), Object.defineProperty(t2, "id", { enumerable: true, get: function() {
              return t2.i;
            } }), t2.webpackPolyfill = 1), t2;
          };
        }]);
      });
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/h5Pc.js
  var require_h5Pc = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/h5Pc.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.h5PcBridgeInit = void 0, exports.h5PcBridgeInit = function() {
        return Promise.resolve(require_frame_talk_client_pc());
      };
      var h5PcBridge = function(e, n) {
        return new Promise(function(t, c) {
          return require_frame_talk_client_pc().invokeAPI(e, n).result.then(function(e2) {
            return "function" == typeof n.success ? n.success.call(null, e2) : "function" == typeof n.onSuccess && n.onSuccess.call(null, e2), t(e2);
          }, function(e2) {
            return "function" == typeof n.fail ? n.fail.call(null, e2) : "function" == typeof n.onFail && n.onFail.call(null, e2), c(e2);
          });
        });
      };
      exports.default = h5PcBridge;
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/eapp.js
  var require_eapp = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/eapp.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var eappBridge = function(e, n) {
        return new Promise(function(o, t) {
          dd.dtBridge({ m: e, args: n, onSuccess: function(e2) {
            "function" == typeof n.success ? n.success(e2) : "function" == typeof n.onSuccess && n.onSuccess(e2), o(e2);
          }, onFail: function(e2) {
            "function" == typeof n.fail ? n.fail(e2) : "function" == typeof n.onFail && n.onFail(e2), t(e2);
          } });
        });
      };
      exports.default = eappBridge;
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/h5PcEvent.js
  var require_h5PcEvent = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/h5PcEvent.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.off = exports.on = void 0, exports.on = function(e, t) {
        require_frame_talk_client_pc().addEventListener(e, t);
      }, exports.off = function(e, t) {
        require_frame_talk_client_pc().removeEventListener(e, t);
      };
    }
  });

  // node_modules/dingtalk-jsapi/platform/pc.js
  var require_pc = __commonJS({
    "node_modules/dingtalk-jsapi/platform/pc.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var ddSdk_1 = require_ddSdk();
      var env_1 = require_env();
      var h5Pc_1 = require_h5Pc();
      var eapp_1 = require_eapp();
      var sdk_1 = require_sdk();
      var h5PcEvent_1 = require_h5PcEvent();
      var apiMapping_1 = require_apiMapping();
      ddSdk_1.ddSdk.setPlatform({ platform: env_1.ENV_ENUM.pc, bridgeInit: function() {
        switch (env_1.getENV().appType) {
          case sdk_1.APP_TYPE.MINI_APP:
            return Promise.resolve(eapp_1.default);
          default:
            return h5Pc_1.h5PcBridgeInit().then(function() {
              return h5Pc_1.default;
            });
        }
      }, authMethod: "config", authParamsDeal: function(e) {
        var i = Object.assign({}, e);
        return e.jsApiList && (i.jsApiList = e.jsApiList.map(function(e2) {
          return apiMapping_1.default[e2] ? apiMapping_1.default[e2] : e2;
        })), i.url = window.location.href.split("#")[0], i;
      }, event: { on: function(e, i) {
        if (env_1.getENV().appType === sdk_1.APP_TYPE.WEB) return h5PcEvent_1.on(e, i);
      }, off: function(e, i) {
        if (env_1.getENV().appType === sdk_1.APP_TYPE.WEB) return h5PcEvent_1.off(e, i);
      } } });
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/webviewInMiniApp.js
  var require_webviewInMiniApp = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/webviewInMiniApp.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var noop = function() {
      };
      var webviewInMiniappBridgeReadyPromise;
      var webviewInMiniappBridgeInit = function() {
        return webviewInMiniappBridgeReadyPromise || (webviewInMiniappBridgeReadyPromise = new Promise(function(e, i) {
          window.AlipayJSBridge ? e() : document.addEventListener("AlipayJSBridgeReady", function() {
            e();
          }, false);
        })), webviewInMiniappBridgeReadyPromise;
      };
      var webviewInMiniappBridge = function(e, i) {
        return webviewInMiniappBridgeInit().then(function() {
          return new Promise(function(n, r) {
            var a = i.onSuccess || noop, o = i.onFail || noop;
            if (delete i.onSuccess, delete i.onFail, AlipayJSBridge) {
              var p = e.split("."), t = p.pop() || "", d = p.join(".");
              AlipayJSBridge.call.apply(null, ["webDdExec", { serviceName: d, actionName: t, args: i }, function(e2) {
                var i2 = {}, p2 = e2.content;
                if (p2) try {
                  i2 = JSON.parse(p2);
                } catch (e3) {
                  console.error("parse dt api result error", p2, e3);
                }
                e2.success ? (a.apply(null, [i2]), n(i2)) : (o.apply(null, [i2]), r(i2));
              }]);
            } else {
              var s = new Error("Fatal error, cannot find bridge ,current env is WebView in MiniApp");
              o(s), r(s);
            }
          });
        });
      };
      exports.default = webviewInMiniappBridge;
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/h5Android.js
  var require_h5Android = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/h5Android.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.h5AndroidbridgeInit = void 0;
      var h5BridgeReadyPromise;
      exports.h5AndroidbridgeInit = function() {
        return h5BridgeReadyPromise || (h5BridgeReadyPromise = new Promise(function(e, i) {
          var n = function() {
            try {
              window.WebViewJavascriptBridgeAndroid = window.nuva && window.nuva.require(), e({});
            } catch (e2) {
              i(e2);
            }
          };
          window.nuva && (void 0 === window.nuva.isReady || window.nuva.isReady) ? n() : (document.addEventListener("runtimeready", function() {
            n();
          }, false), document.addEventListener("runtimefailed", function(e2) {
            var n2 = e2 && e2.detail || { errorCode: "2", errorMessage: "unknown nuvajs bootstrap error" };
            i(n2);
          }, false));
        })), h5BridgeReadyPromise;
      };
      var h5AndroidBridge = function(e, i) {
        return h5BridgeReadyPromise || (h5BridgeReadyPromise = exports.h5AndroidbridgeInit()), h5BridgeReadyPromise.then(function() {
          return new Promise(function(n, r) {
            var o = e.split("."), d = o.pop() || "", t = o.join("."), a = function(e2) {
              "function" == typeof i.success ? i.success(e2) : "function" == typeof i.onSuccess && i.onSuccess(e2), n(e2);
            }, s = function(e2) {
              "function" == typeof i.fail ? i.fail(e2) : "function" == typeof i.onFail && i.onFail(e2), r(e2);
            };
            "function" == typeof window.WebViewJavascriptBridgeAndroid && window.WebViewJavascriptBridgeAndroid(a, s, t, d, i);
          });
        });
      };
      exports.default = h5AndroidBridge;
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/weex.js
  var require_weex = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/weex.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.androidWeexBridge = exports.iosWeexBridge = exports.requireModule = void 0;
      var STATUS_OK = 1;
      var WEEX_IOS_BIZ_SUCCESS_CODE = "0";
      exports.requireModule = function(e) {
        return "undefined" != typeof __weex_require__ ? __weex_require__("@weex-module/" + e) : "undefined" != typeof weex ? weex.requireModule(e) : void 0;
      }, exports.iosWeexBridge = function() {
        return Promise.resolve(function(e, o) {
          return new Promise(function(r, s) {
            var n = exports.requireModule("nuvajs-exec"), t = e.split("."), i = t.pop(), u = t.join(".");
            n.exec({ plugin: u, action: i, args: o }, function(e2) {
              e2 && e2.errorCode === WEEX_IOS_BIZ_SUCCESS_CODE ? ("function" == typeof o.success ? o.success(e2.result) : "function" == typeof o.onSuccess && o.onSuccess(e2.result), r(e2.result)) : ("function" == typeof o.fail ? o.fail(e2.result) : "function" == typeof o.onFail && o.onFail(e2.result), s(e2.result));
            });
          });
        });
      }, exports.androidWeexBridge = function() {
        return Promise.resolve(function(e, o) {
          return new Promise(function(r, s) {
            var n = exports.requireModule("nuvajs-exec"), t = e.split("."), i = t.pop(), u = t.join(".");
            n.exec({ plugin: u, action: i, args: o }, function(e2) {
              var n2 = {};
              try {
                if (e2 && e2.__message__) if ("object" == typeof e2.__message__) n2 = e2.__message__;
                else try {
                  n2 = JSON.parse(e2.__message__);
                } catch (o2) {
                  "string" == typeof e2.__message__ && (n2 = e2.__message__);
                }
              } catch (e3) {
              }
              e2 && parseInt(e2.__status__ + "", 10) === STATUS_OK ? ("function" == typeof o.onSuccess && o.onSuccess(n2), r(n2)) : ("function" == typeof o.onFail && o.onFail(n2), s(n2));
            });
          });
        });
      };
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/h5Event.js
  var require_h5Event = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/h5Event.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.off = exports.on = void 0;
      var NON_BRIDGE_EVENTS = ["resume", "pause", "online", "offline", "backbutton", "goBack", "pullToRefresh", "message", "recycle", "restore", "drawer", "tab", "navHelpIcon", "navRightButton", "navMenu", "navTitle", "appLinkResponse", "internalPageLinkResponse", "networkEvent", "hostTaskEvent", "deviceOrientationChanged", "autoCheckIn", "deviceFound", "hostCheckIn", "screenshot", "becomeActive", "keepAlive", "navTitleClick", "sharePage", "wxNotify", "editNoteCommand", "updateStyle", "qrscanCommonNotify", "__message__", "dtChannelEvent", "livePlayerEventPlay", "livePlayerEventPause", "livePlayerEventEnded", "livePlayerEventError", "navActions", "attendEvents"];
      var BizEventBridgeType = "dtBizBridgeEvent";
      var EventTypeListKey = "__eventTypeList__";
      var handlerProxyMap = /* @__PURE__ */ (function() {
        return "undefined" == typeof WeakMap ? void 0 : /* @__PURE__ */ new WeakMap();
      })();
      var getOnHandlerProxy = function(e, n) {
        if (handlerProxyMap) {
          var t = handlerProxyMap.get(n);
          return void 0 === t ? (t = function(e2) {
            var r = e2.detail;
            if (r.namespace && r.eventName) {
              var a = r.namespace + "." + r.eventName;
              t && -1 !== t[EventTypeListKey].indexOf(a) && n(r.data);
            }
          }, t[EventTypeListKey] = [e], handlerProxyMap.set(n, t)) : -1 === t[EventTypeListKey].indexOf(e) && t[EventTypeListKey].push(e), t;
        }
      };
      var getOffHandlerProxy = function(e, n) {
        if (handlerProxyMap) {
          var t = handlerProxyMap.get(n);
          return t && -1 !== t[EventTypeListKey].indexOf(e) && t[EventTypeListKey].splice(t[EventTypeListKey].indexOf(e), 1), t && t[EventTypeListKey].length <= 1 ? t : void 0;
        }
      };
      exports.on = function(e, n) {
        if (-1 !== NON_BRIDGE_EVENTS.indexOf(e)) document.addEventListener(e, n);
        else {
          var t = getOnHandlerProxy(e, n);
          t ? document.addEventListener(BizEventBridgeType, t) : console.log("bind event : " + e + " need WeakMap support , current environment doesnot");
        }
      }, exports.off = function(e, n) {
        if (-1 !== NON_BRIDGE_EVENTS.indexOf(e)) document.removeEventListener(e, n);
        else {
          var t = getOffHandlerProxy(e, n);
          t && document.removeEventListener(BizEventBridgeType, t);
        }
      };
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/weexEvent.js
  var require_weexEvent = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/weexEvent.js"(exports) {
      "use strict";
      var _this = exports;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.off = exports.on = void 0;
      var weex_1 = require_weex();
      exports.on = function(e, t) {
        weex_1.requireModule("globalEvent").addEventListener(e, function(e2) {
          var r = { preventDefault: function() {
            throw new Error("does not support preventDefault");
          }, detail: e2 };
          t.call(_this, r);
        });
      }, exports.off = function(e, t) {
        weex_1.requireModule("globalEvent").removeEventListener(e, t);
      };
    }
  });

  // node_modules/dingtalk-jsapi/platform/android.js
  var require_android = __commonJS({
    "node_modules/dingtalk-jsapi/platform/android.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.platformConfig = void 0;
      var ddSdk_1 = require_ddSdk();
      var env_1 = require_env();
      var sdk_1 = require_sdk();
      var eapp_1 = require_eapp();
      var webviewInMiniApp_1 = require_webviewInMiniApp();
      var h5Android_1 = require_h5Android();
      var weex_1 = require_weex();
      var h5Event_1 = require_h5Event();
      var weexEvent_1 = require_weexEvent();
      var apiMapping_1 = require_apiMapping();
      exports.platformConfig = { platform: env_1.ENV_ENUM.android, bridgeInit: function() {
        var e = env_1.getENV();
        return e.appType === sdk_1.APP_TYPE.MINI_APP ? Promise.resolve(eapp_1.default) : e.appType === sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP ? Promise.resolve(webviewInMiniApp_1.default) : e.appType === sdk_1.APP_TYPE.WEEX ? weex_1.androidWeexBridge() : h5Android_1.h5AndroidbridgeInit().then(function() {
          return h5Android_1.default;
        });
      }, authMethod: "runtime.permission.requestJsApis", authParamsDeal: function(e) {
        var r = Object.assign({}, e);
        return e.jsApiList && (r.jsApiList = e.jsApiList.map(function(e2) {
          return apiMapping_1.default[e2] ? apiMapping_1.default[e2] : e2;
        })), r;
      }, event: { on: function(e, r) {
        var i = env_1.getENV();
        switch (i.appType) {
          case sdk_1.APP_TYPE.WEB:
          case sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP:
            h5Event_1.on(e, r);
            break;
          case sdk_1.APP_TYPE.WEEX:
            weexEvent_1.on(e, r);
            break;
          default:
            throw new Error("Not support global event in the platfrom: " + i.appType);
        }
      }, off: function(e, r) {
        var i = env_1.getENV();
        switch (i.appType) {
          case sdk_1.APP_TYPE.WEB:
          case sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP:
            h5Event_1.off(e, r);
            break;
          case sdk_1.APP_TYPE.WEEX:
            weexEvent_1.off(e, r);
            break;
          default:
            throw new Error("Not support global event in the platfrom: " + i.appType);
        }
      } } }, ddSdk_1.ddSdk.setPlatform(exports.platformConfig);
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/h5Ios.js
  var require_h5Ios = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/h5Ios.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.h5IosBridgeInit = void 0;
      var h5BridgeReadyPromise;
      exports.h5IosBridgeInit = function() {
        return h5BridgeReadyPromise || (h5BridgeReadyPromise = new Promise(function(e, r) {
          if ("undefined" != typeof WebViewJavascriptBridge) {
            try {
              WebViewJavascriptBridge.init(function(e2, r2) {
              });
            } catch (e2) {
              return r();
            }
            return e({});
          }
          document.addEventListener("WebViewJavascriptBridgeReady", function() {
            if ("undefined" == typeof WebViewJavascriptBridge) return r();
            try {
              WebViewJavascriptBridge.init(function(e2, r2) {
              });
            } catch (e2) {
              return r();
            }
            return e({});
          }, false);
        })), h5BridgeReadyPromise;
      };
      var h5IosBridge = function(e, r) {
        return h5BridgeReadyPromise || (h5BridgeReadyPromise = exports.h5IosBridgeInit()), h5BridgeReadyPromise.then(function() {
          var i = Object.assign({}, r);
          return new Promise(function(r2, n) {
            if (true === i.watch) {
              var o = i.onSuccess;
              delete i.onSuccess, "function" == typeof i.success && (o = i.success, delete i.success), "undefined" != typeof WebViewJavascriptBridge && WebViewJavascriptBridge.registerHandler(e, function(e2, r3) {
                "function" == typeof o && o.call(null, e2), r3 && r3({ errorCode: "0", errorMessage: "success" });
              });
            }
            void 0 !== window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler(e, Object.assign({}, i), function(e2) {
              var o2 = e2 || {};
              "0" === o2.errorCode ? ("function" == typeof i.success ? i.success.call(null, o2.result) : "function" == typeof i.onSuccess && i.onSuccess.call(null, o2.result), r2(o2.result)) : ("-1" === o2.errorCode ? "function" == typeof i.cancel ? i.cancel.call(null, o2, o2.errorCode) : "function" == typeof i.onCancel && i.onCancel.call(null, o2, o2.errorCode) : "function" == typeof i.fail ? i.fail.call(null, o2, o2.errorCode) : "function" == typeof i.onFail && i.onFail.call(null, o2, o2.errorCode), n(o2));
            });
          });
        });
      };
      exports.default = h5IosBridge;
    }
  });

  // node_modules/dingtalk-jsapi/platform/ios.js
  var require_ios = __commonJS({
    "node_modules/dingtalk-jsapi/platform/ios.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.platformConfig = void 0;
      var ddSdk_1 = require_ddSdk();
      var env_1 = require_env();
      var sdk_1 = require_sdk();
      var eapp_1 = require_eapp();
      var webviewInMiniApp_1 = require_webviewInMiniApp();
      var h5Ios_1 = require_h5Ios();
      var weex_1 = require_weex();
      var h5Event_1 = require_h5Event();
      var apiMapping_1 = require_apiMapping();
      var weexEvent_1 = require_weexEvent();
      exports.platformConfig = { platform: env_1.ENV_ENUM.ios, bridgeInit: function() {
        var e = env_1.getENV();
        return e.appType === sdk_1.APP_TYPE.MINI_APP ? Promise.resolve(eapp_1.default) : e.appType === sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP ? Promise.resolve(webviewInMiniApp_1.default) : e.appType === sdk_1.APP_TYPE.WEEX ? weex_1.iosWeexBridge() : h5Ios_1.h5IosBridgeInit().then(function() {
          return h5Ios_1.default;
        });
      }, authMethod: "runtime.permission.requestJsApis", authParamsDeal: function(e) {
        var i = Object.assign({}, e);
        return e.jsApiList && (i.jsApiList = e.jsApiList.map(function(e2) {
          return apiMapping_1.default[e2] ? apiMapping_1.default[e2] : e2;
        })), i;
      }, event: { on: function(e, i) {
        var r = env_1.getENV();
        switch (r.appType) {
          case sdk_1.APP_TYPE.WEB:
          case sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP:
            h5Event_1.on(e, i);
            break;
          case sdk_1.APP_TYPE.WEEX:
            weexEvent_1.on(e, i);
            break;
          default:
            throw new Error("Not support global event in the platfrom: " + r.appType);
        }
      }, off: function(e, i) {
        var r = env_1.getENV();
        switch (r.appType) {
          case sdk_1.APP_TYPE.WEB:
          case sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP:
            h5Event_1.off(e, i);
            break;
          case sdk_1.APP_TYPE.WEEX:
            weexEvent_1.off(e, i);
            break;
          default:
            throw new Error("Not support global event in the platfrom: " + r.appType);
        }
      } } }, ddSdk_1.ddSdk.setPlatform(exports.platformConfig);
    }
  });

  // node_modules/dingtalk-jsapi/lib/bridge/h5Harmony.js
  var require_h5Harmony = __commonJS({
    "node_modules/dingtalk-jsapi/lib/bridge/h5Harmony.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.h5HarmonyBridgeInit = void 0;
      var h5BridgeReadyPromise;
      exports.h5HarmonyBridgeInit = function() {
        return h5BridgeReadyPromise || (h5BridgeReadyPromise = new Promise(function(e, n) {
          if ("undefined" != typeof DingTalkJSBridge) {
            try {
              DingTalkJSBridge.init(function(e2, n2) {
              });
            } catch (e2) {
              return n();
            }
            return e({});
          }
          document.addEventListener("DingTalkJSBridgeReady", function() {
            if ("undefined" == typeof DingTalkJSBridge) return n();
            try {
              DingTalkJSBridge.init(function(e2, n2) {
              });
            } catch (e2) {
              return n();
            }
            return e({});
          }, false);
        })), h5BridgeReadyPromise;
      };
      var h5HarmonyBridge = function(e, n) {
        return h5BridgeReadyPromise || (h5BridgeReadyPromise = exports.h5HarmonyBridgeInit()), h5BridgeReadyPromise.then(function() {
          return new Promise(function(i, r) {
            var o = function(e2) {
              e2.success ? (!(function(e3) {
                "function" == typeof n.success ? n.success(e3) : "function" == typeof n.onSuccess && n.onSuccess(e3);
              })(e2.body), i(e2.body)) : (!(function(e3) {
                "function" == typeof n.fail ? n.fail(e3) : "function" == typeof n.onFail && n.onFail(e3);
              })(e2.body), r(e2.body));
            };
            "function" == typeof window.DingTalkJSBridge.call && window.DingTalkJSBridge.call(e, n, o);
          });
        });
      };
      exports.default = h5HarmonyBridge;
    }
  });

  // node_modules/dingtalk-jsapi/platform/harmony.js
  var require_harmony = __commonJS({
    "node_modules/dingtalk-jsapi/platform/harmony.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.platformConfig = void 0;
      var ddSdk_1 = require_ddSdk();
      var env_1 = require_env();
      var sdk_1 = require_sdk();
      var eapp_1 = require_eapp();
      var webviewInMiniApp_1 = require_webviewInMiniApp();
      var h5Harmony_1 = require_h5Harmony();
      var h5Event_1 = require_h5Event();
      var weexEvent_1 = require_weexEvent();
      var apiMapping_1 = require_apiMapping();
      exports.platformConfig = { platform: env_1.ENV_ENUM.harmony, bridgeInit: function() {
        var e = env_1.getENV();
        return e.appType === sdk_1.APP_TYPE.MINI_APP ? Promise.resolve(eapp_1.default) : e.appType === sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP ? Promise.resolve(webviewInMiniApp_1.default) : h5Harmony_1.h5HarmonyBridgeInit().then(function() {
          return h5Harmony_1.default;
        });
      }, authMethod: "runtime.permission.requestJsApis", authParamsDeal: function(e) {
        var r = Object.assign({}, e);
        return e.jsApiList && (r.jsApiList = e.jsApiList.map(function(e2) {
          return apiMapping_1.default[e2] ? apiMapping_1.default[e2] : e2;
        })), r;
      }, event: { on: function(e, r) {
        var i = env_1.getENV();
        switch (i.appType) {
          case sdk_1.APP_TYPE.WEB:
          case sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP:
            h5Event_1.on(e, r);
            break;
          case sdk_1.APP_TYPE.WEEX:
            weexEvent_1.on(e, r);
            break;
          default:
            throw new Error("Not support global event in the platfrom: " + i.appType);
        }
      }, off: function(e, r) {
        var i = env_1.getENV();
        switch (i.appType) {
          case sdk_1.APP_TYPE.WEB:
          case sdk_1.APP_TYPE.WEBVIEW_IN_MINIAPP:
            h5Event_1.off(e, r);
            break;
          case sdk_1.APP_TYPE.WEEX:
            weexEvent_1.off(e, r);
            break;
          default:
            throw new Error("Not support global event in the platfrom: " + i.appType);
        }
      } } }, ddSdk_1.ddSdk.setPlatform(exports.platformConfig);
    }
  });

  // node_modules/dingtalk-jsapi/platform/index.js
  var require_platform = __commonJS({
    "node_modules/dingtalk-jsapi/platform/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), require_pc(), require_android(), require_ios(), require_harmony();
    }
  });

  // node_modules/dingtalk-jsapi/entry/union.js
  var require_union = __commonJS({
    "node_modules/dingtalk-jsapi/entry/union.js"(exports, module) {
      "use strict";
      var dd3 = require_core();
      require_platform(), module.exports = dd3;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/ATMBle/beaconPicker.js
  var require_beaconPicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/ATMBle/beaconPicker.js"(exports) {
      "use strict";
      function beaconPicker$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.beaconPicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.ATMBle.beaconPicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.0.7" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.0.7" }, _a)), exports.beaconPicker$ = beaconPicker$, exports.default = beaconPicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/ATMBle/detectFace.js
  var require_detectFace = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/ATMBle/detectFace.js"(exports) {
      "use strict";
      function detectFace$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.detectFace$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.ATMBle.detectFace";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.18" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.18" }, _a)), exports.detectFace$ = detectFace$, exports.default = detectFace$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/ATMBle/detectFaceFullScreen.js
  var require_detectFaceFullScreen = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/ATMBle/detectFaceFullScreen.js"(exports) {
      "use strict";
      function detectFaceFullScreen$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.detectFaceFullScreen$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.ATMBle.detectFaceFullScreen";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.18" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.18" }, _a)), exports.detectFaceFullScreen$ = detectFaceFullScreen$, exports.default = detectFaceFullScreen$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/ATMBle/exclusiveLiveCheck.js
  var require_exclusiveLiveCheck = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/ATMBle/exclusiveLiveCheck.js"(exports) {
      "use strict";
      function exclusiveLiveCheck$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.exclusiveLiveCheck$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.ATMBle.exclusiveLiveCheck";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.40" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.40" }, _a)), exports.exclusiveLiveCheck$ = exclusiveLiveCheck$, exports.default = exclusiveLiveCheck$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/ATMBle/faceManager.js
  var require_faceManager = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/ATMBle/faceManager.js"(exports) {
      "use strict";
      function faceManager$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.faceManager$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.ATMBle.faceManager";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.0.7" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.0.7" }, _a)), exports.faceManager$ = faceManager$, exports.default = faceManager$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/ATMBle/punchModePicker.js
  var require_punchModePicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/ATMBle/punchModePicker.js"(exports) {
      "use strict";
      function punchModePicker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.punchModePicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.ATMBle.punchModePicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.0.7" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.0.7" }, _a)), exports.punchModePicker$ = punchModePicker$, exports.default = punchModePicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/alipay/bindAlipay.js
  var require_bindAlipay = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/alipay/bindAlipay.js"(exports) {
      "use strict";
      function bindAlipay$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.bindAlipay$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.alipay.bindAlipay";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.15" }, _a)), exports.bindAlipay$ = bindAlipay$, exports.default = bindAlipay$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/alipay/openAuth.js
  var require_openAuth = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/alipay/openAuth.js"(exports) {
      "use strict";
      function openAuth$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openAuth$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.alipay.openAuth";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.8" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.8" }, _a)), exports.openAuth$ = openAuth$, exports.default = openAuth$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/alipay/pay.js
  var require_pay = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/alipay/pay.js"(exports) {
      "use strict";
      function pay$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.pay$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.alipay.pay";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.pay$ = pay$, exports.default = pay$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/attend/getLBSWua.js
  var require_getLBSWua = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/attend/getLBSWua.js"(exports) {
      "use strict";
      function getLBSWua$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getLBSWua$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.attend.getLBSWua";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.35" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.35" }, _a)), exports.getLBSWua$ = getLBSWua$, exports.default = getLBSWua$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/auth/openAccountPwdLoginPage.js
  var require_openAccountPwdLoginPage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/auth/openAccountPwdLoginPage.js"(exports) {
      "use strict";
      function openAccountPwdLoginPage$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openAccountPwdLoginPage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.auth.openAccountPwdLoginPage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.0" }, _a)), exports.openAccountPwdLoginPage$ = openAccountPwdLoginPage$, exports.default = openAccountPwdLoginPage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/auth/requestAuthInfo.js
  var require_requestAuthInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/auth/requestAuthInfo.js"(exports) {
      "use strict";
      function requestAuthInfo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.requestAuthInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.auth.requestAuthInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.19" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.19" }, _a)), exports.requestAuthInfo$ = requestAuthInfo$, exports.default = requestAuthInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/calendar/chooseDateTime.js
  var require_chooseDateTime = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/calendar/chooseDateTime.js"(exports) {
      "use strict";
      function chooseDateTime$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseDateTime$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.calendar.chooseDateTime";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.chooseDateTime$ = chooseDateTime$, exports.default = chooseDateTime$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/calendar/chooseHalfDay.js
  var require_chooseHalfDay = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/calendar/chooseHalfDay.js"(exports) {
      "use strict";
      function chooseHalfDay$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseHalfDay$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.calendar.chooseHalfDay";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.chooseHalfDay$ = chooseHalfDay$, exports.default = chooseHalfDay$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/calendar/chooseInterval.js
  var require_chooseInterval = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/calendar/chooseInterval.js"(exports) {
      "use strict";
      function chooseInterval$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseInterval$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.calendar.chooseInterval";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.chooseInterval$ = chooseInterval$, exports.default = chooseInterval$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/calendar/chooseOneDay.js
  var require_chooseOneDay = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/calendar/chooseOneDay.js"(exports) {
      "use strict";
      function chooseOneDay$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseOneDay$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.calendar.chooseOneDay";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.chooseOneDay$ = chooseOneDay$, exports.default = chooseOneDay$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/chooseConversationByCorpId.js
  var require_chooseConversationByCorpId = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/chooseConversationByCorpId.js"(exports) {
      "use strict";
      function chooseConversationByCorpId$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseConversationByCorpId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.chat.chooseConversationByCorpId";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ max: 50 });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.7.11", paramsDeal }, _a)), exports.chooseConversationByCorpId$ = chooseConversationByCorpId$, exports.default = chooseConversationByCorpId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/collectSticker.js
  var require_collectSticker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/collectSticker.js"(exports) {
      "use strict";
      function collectSticker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.collectSticker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.collectSticker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.25" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.25" }, _a)), exports.collectSticker$ = collectSticker$, exports.default = collectSticker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/createSceneGroup.js
  var require_createSceneGroup = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/createSceneGroup.js"(exports) {
      "use strict";
      function createSceneGroup$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createSceneGroup$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.createSceneGroup";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.7.17" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.7.17" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.7.17" }, _a)), exports.createSceneGroup$ = createSceneGroup$, exports.default = createSceneGroup$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/getRealmCid.js
  var require_getRealmCid = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/getRealmCid.js"(exports) {
      "use strict";
      function getRealmCid$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getRealmCid$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.getRealmCid";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.7.12" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.7.12" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.7.12" }, _a)), exports.getRealmCid$ = getRealmCid$, exports.default = getRealmCid$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/locationChatMessage.js
  var require_locationChatMessage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/locationChatMessage.js"(exports) {
      "use strict";
      function locationChatMessage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.locationChatMessage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.locationChatMessage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.7.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.7.6" }, _a)), exports.locationChatMessage$ = locationChatMessage$, exports.default = locationChatMessage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/openSingleChat.js
  var require_openSingleChat = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/openSingleChat.js"(exports) {
      "use strict";
      function openSingleChat$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openSingleChat$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.openSingleChat";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.4.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.4.10" }, _a)), exports.openSingleChat$ = openSingleChat$, exports.default = openSingleChat$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/pickConversation.js
  var require_pickConversation = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/pickConversation.js"(exports) {
      "use strict";
      function pickConversation$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.pickConversation$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.pickConversation";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.2" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.2" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.7.9" }, _a)), exports.pickConversation$ = pickConversation$, exports.default = pickConversation$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/sendEmotion.js
  var require_sendEmotion = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/sendEmotion.js"(exports) {
      "use strict";
      function sendEmotion$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.sendEmotion$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.sendEmotion";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.12" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.12" }, _a)), exports.sendEmotion$ = sendEmotion$, exports.default = sendEmotion$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/toConversation.js
  var require_toConversation = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/toConversation.js"(exports) {
      "use strict";
      function toConversation$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.toConversation$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.toConversation";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.toConversation$ = toConversation$, exports.default = toConversation$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/chat/toConversationByOpenConversationId.js
  var require_toConversationByOpenConversationId = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/chat/toConversationByOpenConversationId.js"(exports) {
      "use strict";
      function toConversationByOpenConversationId$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.toConversationByOpenConversationId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.chat.toConversationByOpenConversationId";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.30" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.30" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.33" }, _a)), exports.toConversationByOpenConversationId$ = toConversationByOpenConversationId$, exports.default = toConversationByOpenConversationId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/clipboardData/setData.js
  var require_setData = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/clipboardData/setData.js"(exports) {
      "use strict";
      function setData$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setData$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.clipboardData.setData";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.7.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.7.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.6.1" }, _a)), exports.setData$ = setData$, exports.default = setData$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/conference/createCloudCall.js
  var require_createCloudCall = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/conference/createCloudCall.js"(exports) {
      "use strict";
      function createCloudCall$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createCloudCall$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.conference.createCloudCall";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.9" }, _a)), exports.createCloudCall$ = createCloudCall$, exports.default = createCloudCall$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/conference/getCloudCallInfo.js
  var require_getCloudCallInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/conference/getCloudCallInfo.js"(exports) {
      "use strict";
      function getCloudCallInfo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getCloudCallInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.conference.getCloudCallInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.9" }, _a)), exports.getCloudCallInfo$ = getCloudCallInfo$, exports.default = getCloudCallInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/conference/getCloudCallList.js
  var require_getCloudCallList = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/conference/getCloudCallList.js"(exports) {
      "use strict";
      function getCloudCallList$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getCloudCallList$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.conference.getCloudCallList";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.9" }, _a)), exports.getCloudCallList$ = getCloudCallList$, exports.default = getCloudCallList$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/conference/videoConfCall.js
  var require_videoConfCall = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/conference/videoConfCall.js"(exports) {
      "use strict";
      function videoConfCall$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.videoConfCall$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.conference.videoConfCall";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.0.8" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.0.8" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.28" }, _a)), exports.videoConfCall$ = videoConfCall$, exports.default = videoConfCall$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/choose.js
  var require_choose = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/choose.js"(exports) {
      "use strict";
      function choose$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.choose$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.contact.choose";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ multiple: true, startWithDepartmentId: 0, users: [] });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.choose$ = choose$, exports.default = choose$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/chooseMobileContacts.js
  var require_chooseMobileContacts = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/chooseMobileContacts.js"(exports) {
      "use strict";
      function chooseMobileContacts$(o) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, o);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseMobileContacts$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.contact.chooseMobileContacts";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.1" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.1" }, _a)), exports.chooseMobileContacts$ = chooseMobileContacts$, exports.default = chooseMobileContacts$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/complexPicker.js
  var require_complexPicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/complexPicker.js"(exports) {
      "use strict";
      function complexPicker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.complexPicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.contact.complexPicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.9.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.9.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.3.5" }, _a)), exports.complexPicker$ = complexPicker$, exports.default = complexPicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/createGroup.js
  var require_createGroup = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/createGroup.js"(exports) {
      "use strict";
      function createGroup$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createGroup$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.contact.createGroup";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.6.1" }, _a)), exports.createGroup$ = createGroup$, exports.default = createGroup$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/departmentsPicker.js
  var require_departmentsPicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/departmentsPicker.js"(exports) {
      "use strict";
      function departmentsPicker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.departmentsPicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.contact.departmentsPicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.2.5" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.0" }, _a)), exports.departmentsPicker$ = departmentsPicker$, exports.default = departmentsPicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/externalComplexPicker.js
  var require_externalComplexPicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/externalComplexPicker.js"(exports) {
      "use strict";
      function externalComplexPicker$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.externalComplexPicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.contact.externalComplexPicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.0" }, _a)), exports.externalComplexPicker$ = externalComplexPicker$, exports.default = externalComplexPicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/externalEditForm.js
  var require_externalEditForm = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/externalEditForm.js"(exports) {
      "use strict";
      function externalEditForm$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.externalEditForm$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.contact.externalEditForm";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.0" }, _a)), exports.externalEditForm$ = externalEditForm$, exports.default = externalEditForm$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/rolesPicker.js
  var require_rolesPicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/rolesPicker.js"(exports) {
      "use strict";
      function rolesPicker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.rolesPicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.contact.rolesPicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.16" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.16" }, _a)), exports.rolesPicker$ = rolesPicker$, exports.default = rolesPicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/contact/setRule.js
  var require_setRule = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/contact/setRule.js"(exports) {
      "use strict";
      function setRule$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setRule$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.contact.setRule";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.15" }, _a)), exports.setRule$ = setRule$, exports.default = setRule$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/cspace/chooseSpaceDir.js
  var require_chooseSpaceDir = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/cspace/chooseSpaceDir.js"(exports) {
      "use strict";
      function chooseSpaceDir$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseSpaceDir$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.cspace.chooseSpaceDir";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.6" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.27" }, _a)), exports.chooseSpaceDir$ = chooseSpaceDir$, exports.default = chooseSpaceDir$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/cspace/delete.js
  var require_delete = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/cspace/delete.js"(exports) {
      "use strict";
      function delete$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.delete$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.cspace.delete";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.5.21" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.5.21" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.5.21" }, _a)), exports.delete$ = delete$, exports.default = delete$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/cspace/preview.js
  var require_preview = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/cspace/preview.js"(exports) {
      "use strict";
      function preview$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.preview$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.cspace.preview";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.7.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.7.0" }, _a)), exports.preview$ = preview$, exports.default = preview$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/cspace/previewDentryImages.js
  var require_previewDentryImages = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/cspace/previewDentryImages.js"(exports) {
      "use strict";
      function previewDentryImages$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.previewDentryImages$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.cspace.previewDentryImages";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.30" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.30" }, _a)), exports.previewDentryImages$ = previewDentryImages$, exports.default = previewDentryImages$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/cspace/saveFile.js
  var require_saveFile = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/cspace/saveFile.js"(exports) {
      "use strict";
      function saveFile$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.saveFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.cspace.saveFile";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.7.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.7.6" }, _a)), exports.saveFile$ = saveFile$, exports.default = saveFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/customContact/choose.js
  var require_choose2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/customContact/choose.js"(exports) {
      "use strict";
      function choose$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.choose$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.customContact.choose";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ isShowCompanyName: false, max: 50 });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.5.2", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.5.2", paramsDeal }, _a)), exports.choose$ = choose$, exports.default = choose$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/customContact/multipleChoose.js
  var require_multipleChoose = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/customContact/multipleChoose.js"(exports) {
      "use strict";
      function multipleChoose$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.multipleChoose$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.customContact.multipleChoose";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ isShowCompanyName: false, max: 50 });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.multipleChoose$ = multipleChoose$, exports.default = multipleChoose$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/data/rsa.js
  var require_rsa = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/data/rsa.js"(exports) {
      "use strict";
      function rsa$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.rsa$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.data.rsa";
      ddSdk_1.ddSdk.setAPI(apiName, {}), exports.rsa$ = rsa$, exports.default = rsa$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/ding/create.js
  var require_create = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/ding/create.js"(exports) {
      "use strict";
      function create$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.create$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.ding.create";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.1", resultDeal: function(e) {
        return "" === e ? e = { dingCreateResult: false } : "object" == typeof e && (e.dingCreateResult = !!e.dingCreateResult), e;
      } }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.1" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.5.9" }, _a)), exports.create$ = create$, exports.default = create$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/ding/post.js
  var require_post = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/ding/post.js"(exports) {
      "use strict";
      function post$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.post$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.ding.post";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.post$ = post$, exports.default = post$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/edu/finishMiniCourseByRecordId.js
  var require_finishMiniCourseByRecordId = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/edu/finishMiniCourseByRecordId.js"(exports) {
      "use strict";
      function finishMiniCourseByRecordId$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.finishMiniCourseByRecordId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.edu.finishMiniCourseByRecordId";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.15" }, _a)), exports.finishMiniCourseByRecordId$ = finishMiniCourseByRecordId$, exports.default = finishMiniCourseByRecordId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/edu/getMiniCourseDraftList.js
  var require_getMiniCourseDraftList = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/edu/getMiniCourseDraftList.js"(exports) {
      "use strict";
      function getMiniCourseDraftList$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getMiniCourseDraftList$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.edu.getMiniCourseDraftList";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.15" }, _a)), exports.getMiniCourseDraftList$ = getMiniCourseDraftList$, exports.default = getMiniCourseDraftList$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/edu/joinClassroom.js
  var require_joinClassroom = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/edu/joinClassroom.js"(exports) {
      "use strict";
      function joinClassroom$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.joinClassroom$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.edu.joinClassroom";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.15" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.15" }, _a)), exports.joinClassroom$ = joinClassroom$, exports.default = joinClassroom$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/edu/makeMiniCourse.js
  var require_makeMiniCourse = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/edu/makeMiniCourse.js"(exports) {
      "use strict";
      function makeMiniCourse$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.makeMiniCourse$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.edu.makeMiniCourse";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.15" }, _a)), exports.makeMiniCourse$ = makeMiniCourse$, exports.default = makeMiniCourse$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/edu/newMsgNotificationStatus.js
  var require_newMsgNotificationStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/edu/newMsgNotificationStatus.js"(exports) {
      "use strict";
      function newMsgNotificationStatus$(t) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, t);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.newMsgNotificationStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.edu.newMsgNotificationStatus";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.20" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.20" }, _a)), exports.newMsgNotificationStatus$ = newMsgNotificationStatus$, exports.default = newMsgNotificationStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/edu/startAuth.js
  var require_startAuth = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/edu/startAuth.js"(exports) {
      "use strict";
      function startAuth$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startAuth$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.edu.startAuth";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.20" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.20" }, _a)), exports.startAuth$ = startAuth$, exports.default = startAuth$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/edu/tokenFaceImg.js
  var require_tokenFaceImg = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/edu/tokenFaceImg.js"(exports) {
      "use strict";
      function tokenFaceImg$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.tokenFaceImg$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.edu.tokenFaceImg";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.20" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.20" }, _a)), exports.tokenFaceImg$ = tokenFaceImg$, exports.default = tokenFaceImg$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/event/notifyWeex.js
  var require_notifyWeex = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/event/notifyWeex.js"(exports) {
      "use strict";
      function notifyWeex$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.notifyWeex$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.event.notifyWeex";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.5.0" }, _a)), exports.notifyWeex$ = notifyWeex$, exports.default = notifyWeex$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/file/downloadFile.js
  var require_downloadFile = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/file/downloadFile.js"(exports) {
      "use strict";
      function downloadFile$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.downloadFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.file.downloadFile";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.15" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.15" }, _a)), exports.downloadFile$ = downloadFile$, exports.default = downloadFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/intent/fetchData.js
  var require_fetchData = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/intent/fetchData.js"(exports) {
      "use strict";
      function fetchData$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.fetchData$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.intent.fetchData";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.7.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.7.6" }, _a)), exports.fetchData$ = fetchData$, exports.default = fetchData$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/iot/bind.js
  var require_bind = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/iot/bind.js"(exports) {
      "use strict";
      function bind$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.bind$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.iot.bind";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.34" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.34" }, _a)), exports.bind$ = bind$, exports.default = bind$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/iot/bindMeetingRoom.js
  var require_bindMeetingRoom = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/iot/bindMeetingRoom.js"(exports) {
      "use strict";
      function bindMeetingRoom$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.bindMeetingRoom$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.iot.bindMeetingRoom";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.34" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.34" }, _a)), exports.bindMeetingRoom$ = bindMeetingRoom$, exports.default = bindMeetingRoom$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/iot/getDeviceProperties.js
  var require_getDeviceProperties = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/iot/getDeviceProperties.js"(exports) {
      "use strict";
      function getDeviceProperties$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getDeviceProperties$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.iot.getDeviceProperties";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.42" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.42" }, _a)), exports.getDeviceProperties$ = getDeviceProperties$, exports.default = getDeviceProperties$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/iot/invokeThingService.js
  var require_invokeThingService = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/iot/invokeThingService.js"(exports) {
      "use strict";
      function invokeThingService$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.invokeThingService$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.iot.invokeThingService";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.42" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.42" }, _a)), exports.invokeThingService$ = invokeThingService$, exports.default = invokeThingService$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/iot/queryMeetingRoomList.js
  var require_queryMeetingRoomList = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/iot/queryMeetingRoomList.js"(exports) {
      "use strict";
      function queryMeetingRoomList$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.queryMeetingRoomList$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.iot.queryMeetingRoomList";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.34" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.34" }, _a)), exports.queryMeetingRoomList$ = queryMeetingRoomList$, exports.default = queryMeetingRoomList$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/iot/setDeviceProperties.js
  var require_setDeviceProperties = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/iot/setDeviceProperties.js"(exports) {
      "use strict";
      function setDeviceProperties$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setDeviceProperties$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.iot.setDeviceProperties";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.42" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.42" }, _a)), exports.setDeviceProperties$ = setDeviceProperties$, exports.default = setDeviceProperties$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/iot/unbind.js
  var require_unbind = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/iot/unbind.js"(exports) {
      "use strict";
      function unbind$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.unbind$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.iot.unbind";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.34" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.34" }, _a)), exports.unbind$ = unbind$, exports.default = unbind$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/live/startClassRoom.js
  var require_startClassRoom = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/live/startClassRoom.js"(exports) {
      "use strict";
      function startClassRoom$(s) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, s);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startClassRoom$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.live.startClassRoom";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.19" }, _a)), exports.startClassRoom$ = startClassRoom$, exports.default = startClassRoom$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/live/startUnifiedLive.js
  var require_startUnifiedLive = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/live/startUnifiedLive.js"(exports) {
      "use strict";
      function startUnifiedLive$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startUnifiedLive$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.live.startUnifiedLive";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.18" }, _a)), exports.startUnifiedLive$ = startUnifiedLive$, exports.default = startUnifiedLive$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/map/locate.js
  var require_locate = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/map/locate.js"(exports) {
      "use strict";
      function locate$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.locate$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.map.locate";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.locate$ = locate$, exports.default = locate$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/map/search.js
  var require_search = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/map/search.js"(exports) {
      "use strict";
      function search$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.search$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.map.search";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ scope: 500 });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.search$ = search$, exports.default = search$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/map/view.js
  var require_view = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/map/view.js"(exports) {
      "use strict";
      function view$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.view$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.map.view";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.view$ = view$, exports.default = view$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/media/compressVideo.js
  var require_compressVideo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/media/compressVideo.js"(exports) {
      "use strict";
      function compressVideo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.compressVideo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.media.compressVideo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.37" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.37" }, _a)), exports.compressVideo$ = compressVideo$, exports.default = compressVideo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/microApp/openApp.js
  var require_openApp = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/microApp/openApp.js"(exports) {
      "use strict";
      function openApp$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openApp$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.microApp.openApp";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.5.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.5.6" }, _a)), exports.openApp$ = openApp$, exports.default = openApp$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/close.js
  var require_close = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/close.js"(exports) {
      "use strict";
      function close$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.close$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.close";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.3.5" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.close$ = close$, exports.default = close$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/goBack.js
  var require_goBack = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/goBack.js"(exports) {
      "use strict";
      function goBack$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.goBack$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.goBack";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.goBack$ = goBack$, exports.default = goBack$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/hideBar.js
  var require_hideBar = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/hideBar.js"(exports) {
      "use strict";
      function hideBar$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.hideBar$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.hideBar";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.6" }, _a)), exports.hideBar$ = hideBar$, exports.default = hideBar$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/navigateBackPage.js
  var require_navigateBackPage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/navigateBackPage.js"(exports) {
      "use strict";
      function navigateBackPage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.navigateBackPage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.navigateBackPage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.31" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.31" }, _a)), exports.navigateBackPage$ = navigateBackPage$, exports.default = navigateBackPage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/navigateToMiniProgram.js
  var require_navigateToMiniProgram = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/navigateToMiniProgram.js"(exports) {
      "use strict";
      function navigateToMiniProgram$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.navigateToMiniProgram$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.navigateToMiniProgram";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.31" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.31" }, _a)), exports.navigateToMiniProgram$ = navigateToMiniProgram$, exports.default = navigateToMiniProgram$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/navigateToPage.js
  var require_navigateToPage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/navigateToPage.js"(exports) {
      "use strict";
      function navigateToPage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.navigateToPage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.navigateToPage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.31" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.31" }, _a)), exports.navigateToPage$ = navigateToPage$, exports.default = navigateToPage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/quit.js
  var require_quit = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/quit.js"(exports) {
      "use strict";
      function quit$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.quit$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.quit";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a)), exports.quit$ = quit$, exports.default = quit$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/replace.js
  var require_replace = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/replace.js"(exports) {
      "use strict";
      function replace$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.replace$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.replace";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.4.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.4.6" }, _a)), exports.replace$ = replace$, exports.default = replace$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/setIcon.js
  var require_setIcon = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/setIcon.js"(exports) {
      "use strict";
      function setIcon$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setIcon$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.navigation.setIcon";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ watch: true, showIcon: true, iconIndex: 1 });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.setIcon$ = setIcon$, exports.default = setIcon$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/setLeft.js
  var require_setLeft = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/setLeft.js"(exports) {
      "use strict";
      function setLeft$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setLeft$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.navigation.setLeft";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ watch: true, show: true, control: false, showIcon: true, text: "" });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.setLeft$ = setLeft$, exports.default = setLeft$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/setMenu.js
  var require_setMenu = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/setMenu.js"(exports) {
      "use strict";
      function setMenu$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setMenu$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.navigation.setMenu";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0", paramsDeal: apiHelper_1.addWatchParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0", paramsDeal: apiHelper_1.addWatchParamsDeal }, _a)), exports.setMenu$ = setMenu$, exports.default = setMenu$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/setRight.js
  var require_setRight = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/setRight.js"(exports) {
      "use strict";
      function setRight$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setRight$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.navigation.setRight";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ watch: true, show: true, control: false, showIcon: true, text: "" });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.setRight$ = setRight$, exports.default = setRight$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/navigation/setTitle.js
  var require_setTitle = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/navigation/setTitle.js"(exports) {
      "use strict";
      function setTitle$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setTitle$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.navigation.setTitle";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.setTitle$ = setTitle$, exports.default = setTitle$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/pbp/componentPunchFromPartner.js
  var require_componentPunchFromPartner = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/pbp/componentPunchFromPartner.js"(exports) {
      "use strict";
      function componentPunchFromPartner$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.componentPunchFromPartner$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.pbp.componentPunchFromPartner";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.10" }, _a)), exports.componentPunchFromPartner$ = componentPunchFromPartner$, exports.default = componentPunchFromPartner$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/pbp/startMatchRuleFromPartner.js
  var require_startMatchRuleFromPartner = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/pbp/startMatchRuleFromPartner.js"(exports) {
      "use strict";
      function startMatchRuleFromPartner$(r) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, r);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startMatchRuleFromPartner$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.pbp.startMatchRuleFromPartner";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.10" }, _a)), exports.startMatchRuleFromPartner$ = startMatchRuleFromPartner$, exports.default = startMatchRuleFromPartner$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/pbp/stopMatchRuleFromPartner.js
  var require_stopMatchRuleFromPartner = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/pbp/stopMatchRuleFromPartner.js"(exports) {
      "use strict";
      function stopMatchRuleFromPartner$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopMatchRuleFromPartner$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.pbp.stopMatchRuleFromPartner";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.10" }, _a)), exports.stopMatchRuleFromPartner$ = stopMatchRuleFromPartner$, exports.default = stopMatchRuleFromPartner$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/phoneContact/add.js
  var require_add = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/phoneContact/add.js"(exports) {
      "use strict";
      function add$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.add$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.phoneContact.add";
      ddSdk_1.ddSdk.setAPI(apiName, {}), exports.add$ = add$, exports.default = add$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/realm/getRealtimeTracingStatus.js
  var require_getRealtimeTracingStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/realm/getRealtimeTracingStatus.js"(exports) {
      "use strict";
      function getRealtimeTracingStatus$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getRealtimeTracingStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.realm.getRealtimeTracingStatus";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.13" }, _a)), exports.getRealtimeTracingStatus$ = getRealtimeTracingStatus$, exports.default = getRealtimeTracingStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/realm/getUserExclusiveInfo.js
  var require_getUserExclusiveInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/realm/getUserExclusiveInfo.js"(exports) {
      "use strict";
      function getUserExclusiveInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getUserExclusiveInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.realm.getUserExclusiveInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.14" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.14" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.17" }, _a)), exports.getUserExclusiveInfo$ = getUserExclusiveInfo$, exports.default = getUserExclusiveInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/realm/startRealtimeTracing.js
  var require_startRealtimeTracing = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/realm/startRealtimeTracing.js"(exports) {
      "use strict";
      function startRealtimeTracing$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startRealtimeTracing$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.realm.startRealtimeTracing";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.13" }, _a)), exports.startRealtimeTracing$ = startRealtimeTracing$, exports.default = startRealtimeTracing$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/realm/stopRealtimeTracing.js
  var require_stopRealtimeTracing = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/realm/stopRealtimeTracing.js"(exports) {
      "use strict";
      function stopRealtimeTracing$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopRealtimeTracing$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.realm.stopRealtimeTracing";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.13" }, _a)), exports.stopRealtimeTracing$ = stopRealtimeTracing$, exports.default = stopRealtimeTracing$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/realm/subscribe.js
  var require_subscribe = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/realm/subscribe.js"(exports) {
      "use strict";
      function subscribe$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.subscribe$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.realm.subscribe";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.7.18" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.7.18" }, _a)), exports.subscribe$ = subscribe$, exports.default = subscribe$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/realm/unsubscribe.js
  var require_unsubscribe = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/realm/unsubscribe.js"(exports) {
      "use strict";
      function unsubscribe$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.unsubscribe$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.realm.unsubscribe";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.7.18" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.7.18" }, _a)), exports.unsubscribe$ = unsubscribe$, exports.default = unsubscribe$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/resource/getInfo.js
  var require_getInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/resource/getInfo.js"(exports) {
      "use strict";
      function getInfo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.resource.getInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.10" }, _a)), exports.getInfo$ = getInfo$, exports.default = getInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/resource/reportDebugMessage.js
  var require_reportDebugMessage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/resource/reportDebugMessage.js"(exports) {
      "use strict";
      function reportDebugMessage$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.reportDebugMessage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.resource.reportDebugMessage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.20" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.20" }, _a)), exports.reportDebugMessage$ = reportDebugMessage$, exports.default = reportDebugMessage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/shortCut/addShortCut.js
  var require_addShortCut = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/shortCut/addShortCut.js"(exports) {
      "use strict";
      function addShortCut$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.addShortCut$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.shortCut.addShortCut";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.7.32" }, _a)), exports.addShortCut$ = addShortCut$, exports.default = addShortCut$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/sports/getHealthAuthorizationStatus.js
  var require_getHealthAuthorizationStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/sports/getHealthAuthorizationStatus.js"(exports) {
      "use strict";
      function getHealthAuthorizationStatus$(t) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, t);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getHealthAuthorizationStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.sports.getHealthAuthorizationStatus";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.11" }, _a)), exports.getHealthAuthorizationStatus$ = getHealthAuthorizationStatus$, exports.default = getHealthAuthorizationStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/sports/getHealthData.js
  var require_getHealthData = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/sports/getHealthData.js"(exports) {
      "use strict";
      function getHealthData$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getHealthData$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.sports.getHealthData";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a)), exports.getHealthData$ = getHealthData$, exports.default = getHealthData$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/sports/getHealthDeviceData.js
  var require_getHealthDeviceData = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/sports/getHealthDeviceData.js"(exports) {
      "use strict";
      function getHealthDeviceData$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getHealthDeviceData$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.sports.getHealthDeviceData";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a)), exports.getHealthDeviceData$ = getHealthDeviceData$, exports.default = getHealthDeviceData$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/sports/requestHealthAuthorization.js
  var require_requestHealthAuthorization = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/sports/requestHealthAuthorization.js"(exports) {
      "use strict";
      function requestHealthAuthorization$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.requestHealthAuthorization$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.sports.requestHealthAuthorization";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a)), exports.requestHealthAuthorization$ = requestHealthAuthorization$, exports.default = requestHealthAuthorization$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/store/closeUnpayOrder.js
  var require_closeUnpayOrder = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/store/closeUnpayOrder.js"(exports) {
      "use strict";
      function closeUnpayOrder$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.closeUnpayOrder$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.store.closeUnpayOrder";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.3.7", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.3.7", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.5.3", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a)), exports.closeUnpayOrder$ = closeUnpayOrder$, exports.default = closeUnpayOrder$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/store/createOrder.js
  var require_createOrder = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/store/createOrder.js"(exports) {
      "use strict";
      function createOrder$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createOrder$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.store.createOrder";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.3.7", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.3.7", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.5.3", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a)), exports.createOrder$ = createOrder$, exports.default = createOrder$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/store/getPayUrl.js
  var require_getPayUrl = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/store/getPayUrl.js"(exports) {
      "use strict";
      function getPayUrl$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getPayUrl$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.store.getPayUrl";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.3.7", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.3.7", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.5.3", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a)), exports.getPayUrl$ = getPayUrl$, exports.default = getPayUrl$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/store/inquiry.js
  var require_inquiry = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/store/inquiry.js"(exports) {
      "use strict";
      function inquiry$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.inquiry$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.store.inquiry";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.3.7", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.3.7", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.5.3", paramsDeal: apiHelper_1.genBizStoreParamsDealFn }, _a)), exports.inquiry$ = inquiry$, exports.default = inquiry$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/tabwindow/isTab.js
  var require_isTab = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/tabwindow/isTab.js"(exports) {
      "use strict";
      function isTab$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.isTab$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.tabwindow.isTab";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.5.10" }, _a)), exports.isTab$ = isTab$, exports.default = isTab$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/telephone/call.js
  var require_call = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/telephone/call.js"(exports) {
      "use strict";
      function call$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.call$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.telephone.call";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.call$ = call$, exports.default = call$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/telephone/checkBizCall.js
  var require_checkBizCall = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/telephone/checkBizCall.js"(exports) {
      "use strict";
      function checkBizCall$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.checkBizCall$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.telephone.checkBizCall";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.6" }, _a)), exports.checkBizCall$ = checkBizCall$, exports.default = checkBizCall$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/telephone/quickCallList.js
  var require_quickCallList = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/telephone/quickCallList.js"(exports) {
      "use strict";
      function quickCallList$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.quickCallList$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.telephone.quickCallList";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.5.6" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.6" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.6" }, _a)), exports.quickCallList$ = quickCallList$, exports.default = quickCallList$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/telephone/showCallMenu.js
  var require_showCallMenu = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/telephone/showCallMenu.js"(exports) {
      "use strict";
      function showCallMenu$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showCallMenu$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.telephone.showCallMenu";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.showCallMenu$ = showCallMenu$, exports.default = showCallMenu$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/user/checkPassword.js
  var require_checkPassword = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/user/checkPassword.js"(exports) {
      "use strict";
      function checkPassword$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.checkPassword$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.user.checkPassword";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.5.8" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.5.8" }, _a)), exports.checkPassword$ = checkPassword$, exports.default = checkPassword$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/user/get.js
  var require_get = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/user/get.js"(exports) {
      "use strict";
      function get$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.get$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.user.get";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.get$ = get$, exports.default = get$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/callComponent.js
  var require_callComponent = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/callComponent.js"(exports) {
      "use strict";
      function callComponent$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.callComponent$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.callComponent";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.35" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.35" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.3.35" }, _a)), exports.callComponent$ = callComponent$, exports.default = callComponent$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/checkAuth.js
  var require_checkAuth = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/checkAuth.js"(exports) {
      "use strict";
      function checkAuth$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.checkAuth$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.checkAuth";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.checkAuth$ = checkAuth$, exports.default = checkAuth$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/chooseImage.js
  var require_chooseImage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/chooseImage.js"(exports) {
      "use strict";
      function chooseImage$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.chooseImage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.1" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.1" }, _a)), exports.chooseImage$ = chooseImage$, exports.default = chooseImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/chooseRegion.js
  var require_chooseRegion = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/chooseRegion.js"(exports) {
      "use strict";
      function chooseRegion$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseRegion$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.chooseRegion";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a)), exports.chooseRegion$ = chooseRegion$, exports.default = chooseRegion$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/chosen.js
  var require_chosen = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/chosen.js"(exports) {
      "use strict";
      function chosen$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chosen$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.chosen";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.chosen$ = chosen$, exports.default = chosen$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/clearWebStoreCache.js
  var require_clearWebStoreCache = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/clearWebStoreCache.js"(exports) {
      "use strict";
      function clearWebStoreCache$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.clearWebStoreCache$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.clearWebStoreCache";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.22" }, _a)), exports.clearWebStoreCache$ = clearWebStoreCache$, exports.default = clearWebStoreCache$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/closePreviewImage.js
  var require_closePreviewImage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/closePreviewImage.js"(exports) {
      "use strict";
      function closePreviewImage$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.closePreviewImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.closePreviewImage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.19" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.17" }, _a)), exports.closePreviewImage$ = closePreviewImage$, exports.default = closePreviewImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/compressImage.js
  var require_compressImage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/compressImage.js"(exports) {
      "use strict";
      function compressImage$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.compressImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.compressImage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.1" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.1" }, _a)), exports.compressImage$ = compressImage$, exports.default = compressImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/datepicker.js
  var require_datepicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/datepicker.js"(exports) {
      "use strict";
      function datepicker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.datepicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.datepicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.datepicker$ = datepicker$, exports.default = datepicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/datetimepicker.js
  var require_datetimepicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/datetimepicker.js"(exports) {
      "use strict";
      function datetimepicker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.datetimepicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.datetimepicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.datetimepicker$ = datetimepicker$, exports.default = datetimepicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/decrypt.js
  var require_decrypt = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/decrypt.js"(exports) {
      "use strict";
      function decrypt$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.decrypt$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.decrypt";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.9.1" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.9.1" }, _a)), exports.decrypt$ = decrypt$, exports.default = decrypt$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/downloadFile.js
  var require_downloadFile2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/downloadFile.js"(exports) {
      "use strict";
      function downloadFile$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.downloadFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.downloadFile";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a)), exports.downloadFile$ = downloadFile$, exports.default = downloadFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/encrypt.js
  var require_encrypt = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/encrypt.js"(exports) {
      "use strict";
      function encrypt$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.encrypt$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.encrypt";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.9.1" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.9.1" }, _a)), exports.encrypt$ = encrypt$, exports.default = encrypt$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/getPerfInfo.js
  var require_getPerfInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/getPerfInfo.js"(exports) {
      "use strict";
      function getPerfInfo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getPerfInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.getPerfInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.14" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.14" }, _a)), exports.getPerfInfo$ = getPerfInfo$, exports.default = getPerfInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/invokeWorkbench.js
  var require_invokeWorkbench = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/invokeWorkbench.js"(exports) {
      "use strict";
      function invokeWorkbench$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.invokeWorkbench$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.invokeWorkbench";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.8" }, _a)), exports.invokeWorkbench$ = invokeWorkbench$, exports.default = invokeWorkbench$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/isEnableGPUAcceleration.js
  var require_isEnableGPUAcceleration = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/isEnableGPUAcceleration.js"(exports) {
      "use strict";
      function isEnableGPUAcceleration$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.isEnableGPUAcceleration$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.isEnableGPUAcceleration";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.22" }, _a)), exports.isEnableGPUAcceleration$ = isEnableGPUAcceleration$, exports.default = isEnableGPUAcceleration$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/isLocalFileExist.js
  var require_isLocalFileExist = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/isLocalFileExist.js"(exports) {
      "use strict";
      function isLocalFileExist$(i) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, i);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.isLocalFileExist$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.isLocalFileExist";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a)), exports.isLocalFileExist$ = isLocalFileExist$, exports.default = isLocalFileExist$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/multiSelect.js
  var require_multiSelect = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/multiSelect.js"(exports) {
      "use strict";
      function multiSelect$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.multiSelect$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.multiSelect";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.0.0" }, _a)), exports.multiSelect$ = multiSelect$, exports.default = multiSelect$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/open.js
  var require_open = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/open.js"(exports) {
      "use strict";
      function open$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.open$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.open";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.7.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.open$ = open$, exports.default = open$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/openBrowser.js
  var require_openBrowser = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/openBrowser.js"(exports) {
      "use strict";
      function openBrowser$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openBrowser$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.openBrowser";
      ddSdk_1.ddSdk.setAPI(apiName, {}), exports.openBrowser$ = openBrowser$, exports.default = openBrowser$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/openDocument.js
  var require_openDocument = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/openDocument.js"(exports) {
      "use strict";
      function openDocument$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openDocument$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.openDocument";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10" }, _a)), exports.openDocument$ = openDocument$, exports.default = openDocument$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/openLink.js
  var require_openLink = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/openLink.js"(exports) {
      "use strict";
      function openLink$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openLink$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.util.openLink";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ credible: true, showMenuBar: true });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.7.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.openLink$ = openLink$, exports.default = openLink$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/openLocalFile.js
  var require_openLocalFile = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/openLocalFile.js"(exports) {
      "use strict";
      function openLocalFile$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openLocalFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.openLocalFile";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a)), exports.openLocalFile$ = openLocalFile$, exports.default = openLocalFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/openModal.js
  var require_openModal = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/openModal.js"(exports) {
      "use strict";
      function openModal$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openModal$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.openModal";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a)), exports.openModal$ = openModal$, exports.default = openModal$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/openSlidePanel.js
  var require_openSlidePanel = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/openSlidePanel.js"(exports) {
      "use strict";
      function openSlidePanel$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openSlidePanel$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.openSlidePanel";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a)), exports.openSlidePanel$ = openSlidePanel$, exports.default = openSlidePanel$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/presentWindow.js
  var require_presentWindow = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/presentWindow.js"(exports) {
      "use strict";
      function presentWindow$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.presentWindow$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.presentWindow";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.presentWindow$ = presentWindow$, exports.default = presentWindow$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/previewImage.js
  var require_previewImage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/previewImage.js"(exports) {
      "use strict";
      function previewImage$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.previewImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.previewImage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.7.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.previewImage$ = previewImage$, exports.default = previewImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/previewVideo.js
  var require_previewVideo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/previewVideo.js"(exports) {
      "use strict";
      function previewVideo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.previewVideo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.previewVideo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.3.7" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.3.7" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.6.33" }, _a)), exports.previewVideo$ = previewVideo$, exports.default = previewVideo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/saveImage.js
  var require_saveImage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/saveImage.js"(exports) {
      "use strict";
      function saveImage$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.saveImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.saveImage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.1" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.1" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.saveImage$ = saveImage$, exports.default = saveImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/saveImageToPhotosAlbum.js
  var require_saveImageToPhotosAlbum = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/saveImageToPhotosAlbum.js"(exports) {
      "use strict";
      function saveImageToPhotosAlbum$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.saveImageToPhotosAlbum$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.saveImageToPhotosAlbum";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.saveImageToPhotosAlbum$ = saveImageToPhotosAlbum$, exports.default = saveImageToPhotosAlbum$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/scan.js
  var require_scan = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/scan.js"(exports) {
      "use strict";
      function scan$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.scan$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.util.scan";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ type: "qrCode" });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.scan$ = scan$, exports.default = scan$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/scanCard.js
  var require_scanCard = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/scanCard.js"(exports) {
      "use strict";
      function scanCard$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.scanCard$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.scanCard";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.scanCard$ = scanCard$, exports.default = scanCard$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/setGPUAcceleration.js
  var require_setGPUAcceleration = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/setGPUAcceleration.js"(exports) {
      "use strict";
      function setGPUAcceleration$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setGPUAcceleration$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.setGPUAcceleration";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.22" }, _a)), exports.setGPUAcceleration$ = setGPUAcceleration$, exports.default = setGPUAcceleration$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/setScreenBrightnessAndKeepOn.js
  var require_setScreenBrightnessAndKeepOn = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/setScreenBrightnessAndKeepOn.js"(exports) {
      "use strict";
      function setScreenBrightnessAndKeepOn$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setScreenBrightnessAndKeepOn$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.setScreenBrightnessAndKeepOn";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.37" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.3.3" }, _a)), exports.setScreenBrightnessAndKeepOn$ = setScreenBrightnessAndKeepOn$, exports.default = setScreenBrightnessAndKeepOn$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/setScreenKeepOn.js
  var require_setScreenKeepOn = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/setScreenKeepOn.js"(exports) {
      "use strict";
      function setScreenKeepOn$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setScreenKeepOn$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.setScreenKeepOn";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.26" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.26" }, _a)), exports.setScreenKeepOn$ = setScreenKeepOn$, exports.default = setScreenKeepOn$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/share.js
  var require_share = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/share.js"(exports) {
      "use strict";
      function share$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.share$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.util.share";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ title: "", buttonName: "\u786E\u5B9A" });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.6.37", paramsDeal }, _a)), exports.share$ = share$, exports.default = share$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/shareImage.js
  var require_shareImage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/shareImage.js"(exports) {
      "use strict";
      function shareImage$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.shareImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.shareImage";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.1" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.1" }, _a)), exports.shareImage$ = shareImage$, exports.default = shareImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/showAuthGuide.js
  var require_showAuthGuide = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/showAuthGuide.js"(exports) {
      "use strict";
      function showAuthGuide$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showAuthGuide$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.showAuthGuide";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a)), exports.showAuthGuide$ = showAuthGuide$, exports.default = showAuthGuide$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/showSharePanel.js
  var require_showSharePanel = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/showSharePanel.js"(exports) {
      "use strict";
      function showSharePanel$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showSharePanel$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.showSharePanel";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a)), exports.showSharePanel$ = showSharePanel$, exports.default = showSharePanel$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/startDocSign.js
  var require_startDocSign = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/startDocSign.js"(exports) {
      "use strict";
      function startDocSign$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startDocSign$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.startDocSign";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.33" }, _a)), exports.startDocSign$ = startDocSign$, exports.default = startDocSign$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/systemShare.js
  var require_systemShare = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/systemShare.js"(exports) {
      "use strict";
      function systemShare$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.systemShare$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.systemShare";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.5.11" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.5.11" }, _a)), exports.systemShare$ = systemShare$, exports.default = systemShare$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/timepicker.js
  var require_timepicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/timepicker.js"(exports) {
      "use strict";
      function timepicker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.timepicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.timepicker";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.timepicker$ = timepicker$, exports.default = timepicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/uploadAttachment.js
  var require_uploadAttachment = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/uploadAttachment.js"(exports) {
      "use strict";
      function uploadAttachment$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.uploadAttachment$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.uploadAttachment";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.7.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.7.0" }, _a)), exports.uploadAttachment$ = uploadAttachment$, exports.default = uploadAttachment$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/uploadFile.js
  var require_uploadFile = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/uploadFile.js"(exports) {
      "use strict";
      function uploadFile$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.uploadFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.uploadFile";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.28" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.27" }, _a)), exports.uploadFile$ = uploadFile$, exports.default = uploadFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/uploadImage.js
  var require_uploadImage = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/uploadImage.js"(exports) {
      "use strict";
      function uploadImage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.uploadImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "biz.util.uploadImage";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ multiple: false });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.uploadImage$ = uploadImage$, exports.default = uploadImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/uploadImageFromCamera.js
  var require_uploadImageFromCamera = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/uploadImageFromCamera.js"(exports) {
      "use strict";
      function uploadImageFromCamera$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.uploadImageFromCamera$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.uploadImageFromCamera";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.uploadImageFromCamera$ = uploadImageFromCamera$, exports.default = uploadImageFromCamera$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/util/ut.js
  var require_ut = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/util/ut.js"(exports) {
      "use strict";
      function ut$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.ut$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.util.ut";
      var utParamsObj2Str = function(a) {
        var t = Object.assign({}, a), d = t.value, e = [];
        if (d && "object" == typeof d) {
          for (var r in d) void 0 !== d[r] && e.push(r + "=" + d[r]);
          d = e.join(",");
        }
        return t.value = d || "", t;
      };
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.5.0", paramsDeal: utParamsObj2Str }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal: function(a) {
        var t = Object.assign({}, a), d = t.value;
        return d && "object" == typeof d && (d = JSON.stringify(d)), t.value = d, t;
      } }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal: utParamsObj2Str }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal: utParamsObj2Str }, _a)), exports.ut$ = ut$, exports.default = ut$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/verify/openBindIDCard.js
  var require_openBindIDCard = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/verify/openBindIDCard.js"(exports) {
      "use strict";
      function openBindIDCard$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openBindIDCard$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.verify.openBindIDCard";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.5.21" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.5.21" }, _a)), exports.openBindIDCard$ = openBindIDCard$, exports.default = openBindIDCard$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/verify/startAuth.js
  var require_startAuth2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/verify/startAuth.js"(exports) {
      "use strict";
      function startAuth$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startAuth$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.verify.startAuth";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.5.21" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.5.21" }, _a)), exports.startAuth$ = startAuth$, exports.default = startAuth$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/voice/makeCall.js
  var require_makeCall = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/voice/makeCall.js"(exports) {
      "use strict";
      function makeCall$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.makeCall$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.voice.makeCall";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.40" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.40" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.40" }, _a)), exports.makeCall$ = makeCall$, exports.default = makeCall$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/watermarkCamera/getWatermarkInfo.js
  var require_getWatermarkInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/watermarkCamera/getWatermarkInfo.js"(exports) {
      "use strict";
      function getWatermarkInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getWatermarkInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.watermarkCamera.getWatermarkInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.25" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.25" }, _a)), exports.getWatermarkInfo$ = getWatermarkInfo$, exports.default = getWatermarkInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/biz/watermarkCamera/setWatermarkInfo.js
  var require_setWatermarkInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/biz/watermarkCamera/setWatermarkInfo.js"(exports) {
      "use strict";
      function setWatermarkInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setWatermarkInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "biz.watermarkCamera.setWatermarkInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.25" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.25" }, _a)), exports.setWatermarkInfo$ = setWatermarkInfo$, exports.default = setWatermarkInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/channel/permission/requestAuthCode.js
  var require_requestAuthCode = __commonJS({
    "node_modules/dingtalk-jsapi/api/channel/permission/requestAuthCode.js"(exports) {
      "use strict";
      function requestAuthCode$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.requestAuthCode$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "channel.permission.requestAuthCode";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.0.0" }, _a)), exports.requestAuthCode$ = requestAuthCode$, exports.default = requestAuthCode$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/accelerometer/clearShake.js
  var require_clearShake = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/accelerometer/clearShake.js"(exports) {
      "use strict";
      function clearShake$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.clearShake$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.accelerometer.clearShake";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.clearShake$ = clearShake$, exports.default = clearShake$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/accelerometer/watchShake.js
  var require_watchShake = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/accelerometer/watchShake.js"(exports) {
      "use strict";
      function watchShake$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.watchShake$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "device.accelerometer.watchShake";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal: function(a) {
        return apiHelper_1.forceChangeParamsDealFn({ sensitivity: 3.2 })(apiHelper_1.addWatchParamsDeal(a));
      } }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal: apiHelper_1.addWatchParamsDeal }, _a)), exports.watchShake$ = watchShake$, exports.default = watchShake$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/download.js
  var require_download = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/download.js"(exports) {
      "use strict";
      function download$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.download$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.download";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.download$ = download$, exports.default = download$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/onPlayEnd.js
  var require_onPlayEnd = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/onPlayEnd.js"(exports) {
      "use strict";
      function onPlayEnd$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onPlayEnd$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.onPlayEnd";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.onPlayEnd$ = onPlayEnd$, exports.default = onPlayEnd$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/onRecordEnd.js
  var require_onRecordEnd = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/onRecordEnd.js"(exports) {
      "use strict";
      function onRecordEnd$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onRecordEnd$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.onRecordEnd";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.onRecordEnd$ = onRecordEnd$, exports.default = onRecordEnd$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/pause.js
  var require_pause = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/pause.js"(exports) {
      "use strict";
      function pause$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.pause$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.pause";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.pause$ = pause$, exports.default = pause$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/play.js
  var require_play = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/play.js"(exports) {
      "use strict";
      function play$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.play$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.play";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.play$ = play$, exports.default = play$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/resume.js
  var require_resume = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/resume.js"(exports) {
      "use strict";
      function resume$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.resume$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.resume";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.resume$ = resume$, exports.default = resume$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/startRecord.js
  var require_startRecord = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/startRecord.js"(exports) {
      "use strict";
      function startRecord$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startRecord$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.startRecord";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.30" }, _a)), exports.startRecord$ = startRecord$, exports.default = startRecord$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/stop.js
  var require_stop = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/stop.js"(exports) {
      "use strict";
      function stop$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stop$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.stop";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.stop$ = stop$, exports.default = stop$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/stopRecord.js
  var require_stopRecord = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/stopRecord.js"(exports) {
      "use strict";
      function stopRecord$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopRecord$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.stopRecord";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.30" }, _a)), exports.stopRecord$ = stopRecord$, exports.default = stopRecord$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/audio/translateVoice.js
  var require_translateVoice = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/audio/translateVoice.js"(exports) {
      "use strict";
      function translateVoice$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.translateVoice$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.audio.translateVoice";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.8.0" }, _a)), exports.translateVoice$ = translateVoice$, exports.default = translateVoice$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/base/getBatteryInfo.js
  var require_getBatteryInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/base/getBatteryInfo.js"(exports) {
      "use strict";
      function getBatteryInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getBatteryInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.base.getBatteryInfo";
      ddSdk_1.ddSdk.setAPI(apiName, {}), exports.getBatteryInfo$ = getBatteryInfo$, exports.default = getBatteryInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/base/getInterface.js
  var require_getInterface = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/base/getInterface.js"(exports) {
      "use strict";
      function getInterface$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getInterface$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.base.getInterface";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "8.1.0" }, _a)), exports.getInterface$ = getInterface$, exports.default = getInterface$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/base/getPhoneInfo.js
  var require_getPhoneInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/base/getPhoneInfo.js"(exports) {
      "use strict";
      function getPhoneInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getPhoneInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.base.getPhoneInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.5.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.5.0" }, _a)), exports.getPhoneInfo$ = getPhoneInfo$, exports.default = getPhoneInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/base/getScanWifiListAsync.js
  var require_getScanWifiListAsync = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/base/getScanWifiListAsync.js"(exports) {
      "use strict";
      function getScanWifiListAsync$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getScanWifiListAsync$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.base.getScanWifiListAsync";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.41" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.3.0" }, _a)), exports.getScanWifiListAsync$ = getScanWifiListAsync$, exports.default = getScanWifiListAsync$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/base/getUUID.js
  var require_getUUID = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/base/getUUID.js"(exports) {
      "use strict";
      function getUUID$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getUUID$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.base.getUUID";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.7.6" }, _a)), exports.getUUID$ = getUUID$, exports.default = getUUID$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/base/getWifiStatus.js
  var require_getWifiStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/base/getWifiStatus.js"(exports) {
      "use strict";
      function getWifiStatus$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getWifiStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.base.getWifiStatus";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.11.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.11.0" }, _a)), exports.getWifiStatus$ = getWifiStatus$, exports.default = getWifiStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/base/openSystemSetting.js
  var require_openSystemSetting = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/base/openSystemSetting.js"(exports) {
      "use strict";
      function openSystemSetting$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openSystemSetting$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.base.openSystemSetting";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.27" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.15" }, _a)), exports.openSystemSetting$ = openSystemSetting$, exports.default = openSystemSetting$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/connection/getNetworkType.js
  var require_getNetworkType = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/connection/getNetworkType.js"(exports) {
      "use strict";
      function getNetworkType$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getNetworkType$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.connection.getNetworkType";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.getNetworkType$ = getNetworkType$, exports.default = getNetworkType$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/geolocation/checkPermission.js
  var require_checkPermission = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/geolocation/checkPermission.js"(exports) {
      "use strict";
      function checkPermission$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.checkPermission$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.geolocation.checkPermission";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.5.0" }, _a)), exports.checkPermission$ = checkPermission$, exports.default = checkPermission$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/geolocation/get.js
  var require_get2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/geolocation/get.js"(exports) {
      "use strict";
      function get$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.get$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.geolocation.get";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.get$ = get$, exports.default = get$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/geolocation/start.js
  var require_start = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/geolocation/start.js"(exports) {
      "use strict";
      function start$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.start$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.geolocation.start";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.4.7" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.4.7" }, _a)), exports.start$ = start$, exports.default = start$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/geolocation/status.js
  var require_status = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/geolocation/status.js"(exports) {
      "use strict";
      function status$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.status$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.geolocation.status";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.4.8" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.4.8" }, _a)), exports.status$ = status$, exports.default = status$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/geolocation/stop.js
  var require_stop2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/geolocation/stop.js"(exports) {
      "use strict";
      function stop$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stop$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.geolocation.stop";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.4.7" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.4.7" }, _a)), exports.stop$ = stop$, exports.default = stop$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/launcher/checkInstalledApps.js
  var require_checkInstalledApps = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/launcher/checkInstalledApps.js"(exports) {
      "use strict";
      function checkInstalledApps$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.checkInstalledApps$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.launcher.checkInstalledApps";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.checkInstalledApps$ = checkInstalledApps$, exports.default = checkInstalledApps$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/launcher/launchApp.js
  var require_launchApp = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/launcher/launchApp.js"(exports) {
      "use strict";
      function launchApp$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.launchApp$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.launcher.launchApp";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.launchApp$ = launchApp$, exports.default = launchApp$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/nfc/nfcRead.js
  var require_nfcRead = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/nfc/nfcRead.js"(exports) {
      "use strict";
      function nfcRead$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.nfcRead$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.nfc.nfcRead";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.11.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.11.0" }, _a)), exports.nfcRead$ = nfcRead$, exports.default = nfcRead$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/nfc/nfcStop.js
  var require_nfcStop = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/nfc/nfcStop.js"(exports) {
      "use strict";
      function nfcStop$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.nfcStop$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.nfc.nfcStop";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.3.9" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.3.9" }, _a)), exports.nfcStop$ = nfcStop$, exports.default = nfcStop$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/nfc/nfcWrite.js
  var require_nfcWrite = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/nfc/nfcWrite.js"(exports) {
      "use strict";
      function nfcWrite$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.nfcWrite$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.nfc.nfcWrite";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.11.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.11.0" }, _a)), exports.nfcWrite$ = nfcWrite$, exports.default = nfcWrite$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/actionSheet.js
  var require_actionSheet = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/actionSheet.js"(exports) {
      "use strict";
      function actionSheet$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.actionSheet$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.notification.actionSheet";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.actionSheet$ = actionSheet$, exports.default = actionSheet$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/alert.js
  var require_alert = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/alert.js"(exports) {
      "use strict";
      function alert$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.alert$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "device.notification.alert";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ title: "", buttonName: "\u786E\u5B9A" });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.alert$ = alert$, exports.default = alert$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/confirm.js
  var require_confirm = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/confirm.js"(exports) {
      "use strict";
      function confirm$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.confirm$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "device.notification.confirm";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ title: "", buttonLabels: ["\u786E\u5B9A", "\u53D6\u6D88"] });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.confirm$ = confirm$, exports.default = confirm$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/extendModal.js
  var require_extendModal = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/extendModal.js"(exports) {
      "use strict";
      function extendModal$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.extendModal$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.notification.extendModal";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.5.0" }, _a)), exports.extendModal$ = extendModal$, exports.default = extendModal$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/hidePreloader.js
  var require_hidePreloader = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/hidePreloader.js"(exports) {
      "use strict";
      function hidePreloader$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.hidePreloader$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.notification.hidePreloader";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.hidePreloader$ = hidePreloader$, exports.default = hidePreloader$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/modal.js
  var require_modal = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/modal.js"(exports) {
      "use strict";
      function modal$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.modal$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.notification.modal";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.2.5" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.modal$ = modal$, exports.default = modal$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/prompt.js
  var require_prompt = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/prompt.js"(exports) {
      "use strict";
      function prompt$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.prompt$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "device.notification.prompt";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ title: "", buttonLabels: ["\u786E\u5B9A", "\u53D6\u6D88"] });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.7.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.prompt$ = prompt$, exports.default = prompt$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/showPreloader.js
  var require_showPreloader = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/showPreloader.js"(exports) {
      "use strict";
      function showPreloader$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showPreloader$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "device.notification.showPreloader";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ text: "\u52A0\u8F7D\u4E2D...", showIcon: true });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.showPreloader$ = showPreloader$, exports.default = showPreloader$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/toast.js
  var require_toast = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/toast.js"(exports) {
      "use strict";
      function toast$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.toast$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "device.notification.toast";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ text: "toast", duration: 3, delay: 0 });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0", paramsDeal: function(a) {
        return a.icon && !a.type && ("success" === a.icon ? a.type = "success" : "error" === a.icon && (a.type = "error")), a;
      } }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.toast$ = toast$, exports.default = toast$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/notification/vibrate.js
  var require_vibrate = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/notification/vibrate.js"(exports) {
      "use strict";
      function vibrate$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.vibrate$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "device.notification.vibrate";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ duration: 300 });
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.vibrate$ = vibrate$, exports.default = vibrate$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/screen/getScreenBrightness.js
  var require_getScreenBrightness = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/screen/getScreenBrightness.js"(exports) {
      "use strict";
      function getScreenBrightness$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getScreenBrightness$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.screen.getScreenBrightness";
      ddSdk_1.ddSdk.setAPI(apiName, {}), exports.getScreenBrightness$ = getScreenBrightness$, exports.default = getScreenBrightness$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/screen/insetAdjust.js
  var require_insetAdjust = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/screen/insetAdjust.js"(exports) {
      "use strict";
      function insetAdjust$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.insetAdjust$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.screen.insetAdjust";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.18" }, _a)), exports.insetAdjust$ = insetAdjust$, exports.default = insetAdjust$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/screen/isScreenReaderEnabled.js
  var require_isScreenReaderEnabled = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/screen/isScreenReaderEnabled.js"(exports) {
      "use strict";
      function isScreenReaderEnabled$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.isScreenReaderEnabled$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.screen.isScreenReaderEnabled";
      ddSdk_1.ddSdk.setAPI(apiName, {}), exports.isScreenReaderEnabled$ = isScreenReaderEnabled$, exports.default = isScreenReaderEnabled$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/screen/resetView.js
  var require_resetView = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/screen/resetView.js"(exports) {
      "use strict";
      function resetView$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.resetView$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.screen.resetView";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.0.0" }, _a)), exports.resetView$ = resetView$, exports.default = resetView$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/screen/rotateView.js
  var require_rotateView = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/screen/rotateView.js"(exports) {
      "use strict";
      function rotateView$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.rotateView$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.screen.rotateView";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.0.0" }, _a)), exports.rotateView$ = rotateView$, exports.default = rotateView$;
    }
  });

  // node_modules/dingtalk-jsapi/api/device/screen/setScreenBrightness.js
  var require_setScreenBrightness = __commonJS({
    "node_modules/dingtalk-jsapi/api/device/screen/setScreenBrightness.js"(exports) {
      "use strict";
      function setScreenBrightness$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setScreenBrightness$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "device.screen.setScreenBrightness";
      ddSdk_1.ddSdk.setAPI(apiName, {}), exports.setScreenBrightness$ = setScreenBrightness$, exports.default = setScreenBrightness$;
    }
  });

  // node_modules/dingtalk-jsapi/api/media/voiceRecorder/keepAlive.js
  var require_keepAlive = __commonJS({
    "node_modules/dingtalk-jsapi/api/media/voiceRecorder/keepAlive.js"(exports) {
      "use strict";
      function keepAlive$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.keepAlive$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "media.voiceRecorder.keepAlive";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.12" }, _a)), exports.keepAlive$ = keepAlive$, exports.default = keepAlive$;
    }
  });

  // node_modules/dingtalk-jsapi/api/media/voiceRecorder/pause.js
  var require_pause2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/media/voiceRecorder/pause.js"(exports) {
      "use strict";
      function pause$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.pause$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "media.voiceRecorder.pause";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.12" }, _a)), exports.pause$ = pause$, exports.default = pause$;
    }
  });

  // node_modules/dingtalk-jsapi/api/media/voiceRecorder/resume.js
  var require_resume2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/media/voiceRecorder/resume.js"(exports) {
      "use strict";
      function resume$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.resume$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "media.voiceRecorder.resume";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.12" }, _a)), exports.resume$ = resume$, exports.default = resume$;
    }
  });

  // node_modules/dingtalk-jsapi/api/media/voiceRecorder/start.js
  var require_start2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/media/voiceRecorder/start.js"(exports) {
      "use strict";
      function start$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.start$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "media.voiceRecorder.start";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.12" }, _a)), exports.start$ = start$, exports.default = start$;
    }
  });

  // node_modules/dingtalk-jsapi/api/media/voiceRecorder/stop.js
  var require_stop3 = __commonJS({
    "node_modules/dingtalk-jsapi/api/media/voiceRecorder/stop.js"(exports) {
      "use strict";
      function stop$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stop$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "media.voiceRecorder.stop";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.12" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "5.1.12" }, _a)), exports.stop$ = stop$, exports.default = stop$;
    }
  });

  // node_modules/dingtalk-jsapi/api/net/bjGovApn/loginGovNet.js
  var require_loginGovNet = __commonJS({
    "node_modules/dingtalk-jsapi/api/net/bjGovApn/loginGovNet.js"(exports) {
      "use strict";
      function loginGovNet$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.loginGovNet$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "net.bjGovApn.loginGovNet";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.5.16" }, _a)), exports.loginGovNet$ = loginGovNet$, exports.default = loginGovNet$;
    }
  });

  // node_modules/dingtalk-jsapi/api/runtime/h5nuvabridge/exec.js
  var require_exec = __commonJS({
    "node_modules/dingtalk-jsapi/api/runtime/h5nuvabridge/exec.js"(exports) {
      "use strict";
      function exec$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.exec$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "runtime.h5nuvabridge.exec";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.exec$ = exec$, exports.default = exec$;
    }
  });

  // node_modules/dingtalk-jsapi/api/runtime/message/fetch.js
  var require_fetch = __commonJS({
    "node_modules/dingtalk-jsapi/api/runtime/message/fetch.js"(exports) {
      "use strict";
      function fetch$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.fetch$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "runtime.message.fetch";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.fetch$ = fetch$, exports.default = fetch$;
    }
  });

  // node_modules/dingtalk-jsapi/api/runtime/message/post.js
  var require_post2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/runtime/message/post.js"(exports) {
      "use strict";
      function post$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.post$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "runtime.message.post";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.post$ = post$, exports.default = post$;
    }
  });

  // node_modules/dingtalk-jsapi/api/runtime/monitor/getLoadTime.js
  var require_getLoadTime = __commonJS({
    "node_modules/dingtalk-jsapi/api/runtime/monitor/getLoadTime.js"(exports) {
      "use strict";
      function getLoadTime$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getLoadTime$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "runtime.monitor.getLoadTime";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.10" }, _a)), exports.getLoadTime$ = getLoadTime$, exports.default = getLoadTime$;
    }
  });

  // node_modules/dingtalk-jsapi/api/runtime/permission/requestAuthCode.js
  var require_requestAuthCode2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/runtime/permission/requestAuthCode.js"(exports) {
      "use strict";
      function requestAuthCode$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.requestAuthCode$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "runtime.permission.requestAuthCode";
      var paramsDeal = function(e) {
        return Object.assign(e, { url: location.href.split("#")[0] });
      };
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.requestAuthCode$ = requestAuthCode$, exports.default = requestAuthCode$;
    }
  });

  // node_modules/dingtalk-jsapi/api/runtime/permission/requestOperateAuthCode.js
  var require_requestOperateAuthCode = __commonJS({
    "node_modules/dingtalk-jsapi/api/runtime/permission/requestOperateAuthCode.js"(exports) {
      "use strict";
      function requestOperateAuthCode$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.requestOperateAuthCode$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "runtime.permission.requestOperateAuthCode";
      var paramsDeal = function(e) {
        return Object.assign(e, { url: location.href.split("#")[0] });
      };
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "3.3.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "3.3.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "3.3.0" }, _a)), exports.requestOperateAuthCode$ = requestOperateAuthCode$, exports.default = requestOperateAuthCode$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/input/plain.js
  var require_plain = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/input/plain.js"(exports) {
      "use strict";
      function plain$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.plain$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.input.plain";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.plain$ = plain$, exports.default = plain$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/multitask/addToFloat.js
  var require_addToFloat = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/multitask/addToFloat.js"(exports) {
      "use strict";
      function addToFloat$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.addToFloat$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.multitask.addToFloat";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.0" }, _a)), exports.addToFloat$ = addToFloat$, exports.default = addToFloat$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/multitask/removeFromFloat.js
  var require_removeFromFloat = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/multitask/removeFromFloat.js"(exports) {
      "use strict";
      function removeFromFloat$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.removeFromFloat$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.multitask.removeFromFloat";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.0" }, _a)), exports.removeFromFloat$ = removeFromFloat$, exports.default = removeFromFloat$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/nav/close.js
  var require_close2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/nav/close.js"(exports) {
      "use strict";
      function close$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.close$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.nav.close";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.close$ = close$, exports.default = close$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/nav/getCurrentId.js
  var require_getCurrentId = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/nav/getCurrentId.js"(exports) {
      "use strict";
      function getCurrentId$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getCurrentId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.nav.getCurrentId";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.getCurrentId$ = getCurrentId$, exports.default = getCurrentId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/nav/go.js
  var require_go = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/nav/go.js"(exports) {
      "use strict";
      function go$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.go$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.nav.go";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.go$ = go$, exports.default = go$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/nav/preload.js
  var require_preload = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/nav/preload.js"(exports) {
      "use strict";
      function preload$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.preload$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.nav.preload";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.preload$ = preload$, exports.default = preload$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/nav/recycle.js
  var require_recycle = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/nav/recycle.js"(exports) {
      "use strict";
      function recycle$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.recycle$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.nav.recycle";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.6.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.6.0" }, _a)), exports.recycle$ = recycle$, exports.default = recycle$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/progressBar/setColors.js
  var require_setColors = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/progressBar/setColors.js"(exports) {
      "use strict";
      function setColors$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setColors$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.progressBar.setColors";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.setColors$ = setColors$, exports.default = setColors$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/pullToRefresh/disable.js
  var require_disable = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/pullToRefresh/disable.js"(exports) {
      "use strict";
      function disable$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.disable$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.pullToRefresh.disable";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.disable$ = disable$, exports.default = disable$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/pullToRefresh/enable.js
  var require_enable = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/pullToRefresh/enable.js"(exports) {
      "use strict";
      function enable$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.enable$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var apiName = "ui.pullToRefresh.enable";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal: apiHelper_1.addWatchParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal: apiHelper_1.addWatchParamsDeal }, _a)), exports.enable$ = enable$, exports.default = enable$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/pullToRefresh/stop.js
  var require_stop4 = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/pullToRefresh/stop.js"(exports) {
      "use strict";
      function stop$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stop$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.pullToRefresh.stop";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.stop$ = stop$, exports.default = stop$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/webViewBounce/disable.js
  var require_disable2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/webViewBounce/disable.js"(exports) {
      "use strict";
      function disable$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.disable$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.webViewBounce.disable";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.disable$ = disable$, exports.default = disable$;
    }
  });

  // node_modules/dingtalk-jsapi/api/ui/webViewBounce/enable.js
  var require_enable2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/ui/webViewBounce/enable.js"(exports) {
      "use strict";
      function enable$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.enable$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "ui.webViewBounce.enable";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0" }, _a)), exports.enable$ = enable$, exports.default = enable$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/ExternalChannelPublish.js
  var require_ExternalChannelPublish = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/ExternalChannelPublish.js"(exports) {
      "use strict";
      function ExternalChannelPublish$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.ExternalChannelPublish$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.channel.externalChannelPublish";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.50" }, _a)), exports.ExternalChannelPublish$ = ExternalChannelPublish$, exports.default = ExternalChannelPublish$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/addPhoneContact.js
  var require_addPhoneContact = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/addPhoneContact.js"(exports) {
      "use strict";
      function addPhoneContact$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.addPhoneContact$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.phoneContact.add";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.addPhoneContact$ = addPhoneContact$, exports.default = addPhoneContact$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/alert.js
  var require_alert2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/alert.js"(exports) {
      "use strict";
      function alert$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, { message: a.content, title: null === a || void 0 === a ? void 0 : a.title, buttonName: a.buttonText, success: a.success, fail: a.fail, complete: a.complete });
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, t = 1, s = arguments.length; t < s; t++) {
            e = arguments[t];
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (a[r] = e[r]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.alert$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.alert";
      var paramsDeal = function(a) {
        return __assign({ message: a.content, title: a.title || "", buttonName: a.buttonText || "\u786E\u5B9A" }, a);
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a)), exports.alert$ = alert$, exports.default = alert$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/callUsers.js
  var require_callUsers = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/callUsers.js"(exports) {
      "use strict";
      function callUsers$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.callUsers$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.telephone.call";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.callUsers$ = callUsers$, exports.default = callUsers$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/checkAuth.js
  var require_checkAuth2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/checkAuth.js"(exports) {
      "use strict";
      function checkAuth$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.checkAuth$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.checkAuth";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.checkAuth$ = checkAuth$, exports.default = checkAuth$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/checkBizCall.js
  var require_checkBizCall2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/checkBizCall.js"(exports) {
      "use strict";
      function checkBizCall$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.checkBizCall$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.telephone.checkBizCall";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", resultDeal: function(d) {
        return d ? { isSupport: true } : { isSupport: false };
      } }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.checkBizCall$ = checkBizCall$, exports.default = checkBizCall$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseChat.js
  var require_chooseChat = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseChat.js"(exports) {
      "use strict";
      function chooseChat$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseChat$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.chat.chooseConversationByCorpId";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.chooseChat$ = chooseChat$, exports.default = chooseChat$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseConversation.js
  var require_chooseConversation = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseConversation.js"(exports) {
      "use strict";
      function chooseConversation$(o) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, o);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseConversation$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.chat.chooseConversation";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.chooseConversation$ = chooseConversation$, exports.default = chooseConversation$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseDateRangeInCalendar.js
  var require_chooseDateRangeInCalendar = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseDateRangeInCalendar.js"(exports) {
      "use strict";
      function chooseDateRangeInCalendar$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseDateRangeInCalendar$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "biz.calendar.chooseInterval";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.chooseDateRangeInCalendar$ = chooseDateRangeInCalendar$, exports.default = chooseDateRangeInCalendar$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseDateTime.js
  var require_chooseDateTime2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseDateTime.js"(exports) {
      "use strict";
      function chooseDateTime$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseDateTime$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "biz.calendar.chooseDateTime";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.chooseDateTime$ = chooseDateTime$, exports.default = chooseDateTime$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseDepartments.js
  var require_chooseDepartments = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseDepartments.js"(exports) {
      "use strict";
      function chooseDepartments$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseDepartments$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.contact.departmentsPicker";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.chooseDepartments$ = chooseDepartments$, exports.default = chooseDepartments$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseDingTalkDir.js
  var require_chooseDingTalkDir = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseDingTalkDir.js"(exports) {
      "use strict";
      function chooseDingTalkDir$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseDingTalkDir$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.cspace.chooseSpaceDir";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.chooseDingTalkDir$ = chooseDingTalkDir$, exports.default = chooseDingTalkDir$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseDistrict.js
  var require_chooseDistrict = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseDistrict.js"(exports) {
      "use strict";
      function chooseDistrict$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseDistrict$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.chooseRegion";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a)), exports.chooseDistrict$ = chooseDistrict$, exports.default = chooseDistrict$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseExternalUsers.js
  var require_chooseExternalUsers = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseExternalUsers.js"(exports) {
      "use strict";
      function chooseExternalUsers$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseExternalUsers$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.contact.externalComplexPicker";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.chooseExternalUsers$ = chooseExternalUsers$, exports.default = chooseExternalUsers$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseFile.js
  var require_chooseFile = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseFile.js"(exports) {
      "use strict";
      function chooseFile$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.file.chooseFile";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.1.5" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.1.5" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.1.10" }, _a)), exports.chooseFile$ = chooseFile$, exports.default = chooseFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseHalfDayInCalendar.js
  var require_chooseHalfDayInCalendar = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseHalfDayInCalendar.js"(exports) {
      "use strict";
      function chooseHalfDayInCalendar$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseHalfDayInCalendar$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "biz.calendar.chooseHalfDay";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.chooseHalfDayInCalendar$ = chooseHalfDayInCalendar$, exports.default = chooseHalfDayInCalendar$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseImage.js
  var require_chooseImage2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseImage.js"(exports) {
      "use strict";
      function chooseImage$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.chooseImage";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.chooseImage$ = chooseImage$, exports.default = chooseImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseMedia.js
  var require_chooseMedia = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseMedia.js"(exports) {
      "use strict";
      function chooseMedia$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseMedia$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.chooseMedia";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.2" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.2" }, _a)), exports.chooseMedia$ = chooseMedia$, exports.default = chooseMedia$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseOneDayInCalendar.js
  var require_chooseOneDayInCalendar = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseOneDayInCalendar.js"(exports) {
      "use strict";
      function chooseOneDayInCalendar$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseOneDayInCalendar$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "biz.calendar.chooseOneDay";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.chooseOneDayInCalendar$ = chooseOneDayInCalendar$, exports.default = chooseOneDayInCalendar$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseOrg.js
  var require_chooseOrg = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseOrg.js"(exports) {
      "use strict";
      function chooseOrg$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseOrg$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.contact.chooseOrg";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.45" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.45" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.chooseOrg$ = chooseOrg$, exports.default = chooseOrg$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/choosePhonebook.js
  var require_choosePhonebook = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/choosePhonebook.js"(exports) {
      "use strict";
      function choosePhonebook$(o) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, o);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.choosePhonebook$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.contact.chooseMobileContacts";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.choosePhonebook$ = choosePhonebook$, exports.default = choosePhonebook$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseStaffForPC.js
  var require_chooseStaffForPC = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseStaffForPC.js"(exports) {
      "use strict";
      function chooseStaffForPC$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseStaffForPC$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.contact.choose";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.chooseStaffForPC$ = chooseStaffForPC$, exports.default = chooseStaffForPC$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/chooseUserFromList.js
  var require_chooseUserFromList = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/chooseUserFromList.js"(exports) {
      "use strict";
      function chooseUserFromList$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.chooseUserFromList$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.customContact.choose";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.chooseUserFromList$ = chooseUserFromList$, exports.default = chooseUserFromList$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/clearShake.js
  var require_clearShake2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/clearShake.js"(exports) {
      "use strict";
      function clearShake$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.clearShake$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.accelerometer.clearShake";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.clearShake$ = clearShake$, exports.default = clearShake$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/closeBluetoothAdapter.js
  var require_closeBluetoothAdapter = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/closeBluetoothAdapter.js"(exports) {
      "use strict";
      function closeBluetoothAdapter$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var t, d = 1, o = arguments.length; d < o; d++) {
            t = arguments[d];
            for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.closeBluetoothAdapter$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "closeBluetoothAdapter";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.closeBluetoothAdapter$ = closeBluetoothAdapter$, exports.default = closeBluetoothAdapter$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/closePage.js
  var require_closePage = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/closePage.js"(exports) {
      "use strict";
      function closePage$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.closePage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.close";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.closePage$ = closePage$, exports.default = closePage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/complexChoose.js
  var require_complexChoose = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/complexChoose.js"(exports) {
      "use strict";
      function complexChoose$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.complexChoose$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.contact.complexPicker";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.complexChoose$ = complexChoose$, exports.default = complexChoose$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/compressImage.js
  var require_compressImage2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/compressImage.js"(exports) {
      "use strict";
      function compressImage$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.compressImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.compressImage";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.compressImage$ = compressImage$, exports.default = compressImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/confirm.js
  var require_confirm2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/confirm.js"(exports) {
      "use strict";
      function confirm$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, t = 1, r = arguments.length; t < r; t++) {
            e = arguments[t];
            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (a[n] = e[n]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.confirm$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.confirm";
      var paramsDeal = function(a) {
        var e = { title: a.title || "", message: a.content, buttonLabels: [a.cancelButtonText || "\u53D6\u6D88", a.confirmButtonText || "\u786E\u5B9A"] };
        return __assign(__assign({}, e), a);
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "2.5.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.4.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.4.0", paramsDeal }, _a)), exports.confirm$ = confirm$, exports.default = confirm$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/connectBLEDevice.js
  var require_connectBLEDevice = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/connectBLEDevice.js"(exports) {
      "use strict";
      function connectBLEDevice$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var n, d = 1, i = arguments.length; d < i; d++) {
            n = arguments[d];
            for (var t in n) Object.prototype.hasOwnProperty.call(n, t) && (e[t] = n[t]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.connectBLEDevice$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "connectBLEDevice";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.connectBLEDevice$ = connectBLEDevice$, exports.default = connectBLEDevice$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/createBLEPeripheralServer.js
  var require_createBLEPeripheralServer = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/createBLEPeripheralServer.js"(exports) {
      "use strict";
      function createBLEPeripheralServer$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createBLEPeripheralServer$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.createBLEPeripheralServer";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.6.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.10" }, _a)), exports.createBLEPeripheralServer$ = createBLEPeripheralServer$, exports.default = createBLEPeripheralServer$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/createDing.js
  var require_createDing = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/createDing.js"(exports) {
      "use strict";
      function createDing$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createDing$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.ding.create";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.createDing$ = createDing$, exports.default = createDing$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/createDingForPC.js
  var require_createDingForPC = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/createDingForPC.js"(exports) {
      "use strict";
      function createDingForPC$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createDingForPC$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.ding.post";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.createDingForPC$ = createDingForPC$, exports.default = createDingForPC$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/createGroupChat.js
  var require_createGroupChat = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/createGroupChat.js"(exports) {
      "use strict";
      function createGroupChat$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createGroupChat$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.contact.createGroup";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.createGroupChat$ = createGroupChat$, exports.default = createGroupChat$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/createLiveClassRoom.js
  var require_createLiveClassRoom = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/createLiveClassRoom.js"(exports) {
      "use strict";
      function createLiveClassRoom$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createLiveClassRoom$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.live.startClassRoom";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.createLiveClassRoom$ = createLiveClassRoom$, exports.default = createLiveClassRoom$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/createPayOrder.js
  var require_createPayOrder = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/createPayOrder.js"(exports) {
      "use strict";
      function createPayOrder$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createPayOrder$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.enterprise.createPayOrder";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "8.0.0" }, _a)), exports.createPayOrder$ = createPayOrder$, exports.default = createPayOrder$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/cropImage.js
  var require_cropImage = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/cropImage.js"(exports) {
      "use strict";
      function cropImage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.cropImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.cropImage";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.2" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.2" }, _a)), exports.cropImage$ = cropImage$, exports.default = cropImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/customChooseUsers.js
  var require_customChooseUsers = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/customChooseUsers.js"(exports) {
      "use strict";
      function customChooseUsers$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.customChooseUsers$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "biz.customContact.multipleChoose";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ isShowCompanyName: false, max: 50 });
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal }, _a)), exports.customChooseUsers$ = customChooseUsers$, exports.default = customChooseUsers$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/datePicker.js
  var require_datePicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/datePicker.js"(exports) {
      "use strict";
      function datePicker$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.datePicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.datetimepicker";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.datePicker$ = datePicker$, exports.default = datePicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/dateRangePicker.js
  var require_dateRangePicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/dateRangePicker.js"(exports) {
      "use strict";
      function dateRangePicker$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.dateRangePicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "biz.calendar.chooseInterval";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal: apiHelper_1.addDefaultCorpIdParamsDeal }, _a)), exports.dateRangePicker$ = dateRangePicker$, exports.default = dateRangePicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/decrypt.js
  var require_decrypt2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/decrypt.js"(exports) {
      "use strict";
      function decrypt$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.decrypt$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.decrypt";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.decrypt$ = decrypt$, exports.default = decrypt$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/disablePullDownRefresh.js
  var require_disablePullDownRefresh = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/disablePullDownRefresh.js"(exports) {
      "use strict";
      function disablePullDownRefresh$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.disablePullDownRefresh$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "ui.pullToRefresh.disable";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.disablePullDownRefresh$ = disablePullDownRefresh$, exports.default = disablePullDownRefresh$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/disableWebViewBounce.js
  var require_disableWebViewBounce = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/disableWebViewBounce.js"(exports) {
      "use strict";
      function disableWebViewBounce$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.disableWebViewBounce$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "ui.webViewBounce.disable";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.disableWebViewBounce$ = disableWebViewBounce$, exports.default = disableWebViewBounce$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/disconnectBLEDevice.js
  var require_disconnectBLEDevice = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/disconnectBLEDevice.js"(exports) {
      "use strict";
      function disconnectBLEDevice$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var d, i = 1, n = arguments.length; i < n; i++) {
            d = arguments[i];
            for (var s in d) Object.prototype.hasOwnProperty.call(d, s) && (e[s] = d[s]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.disconnectBLEDevice$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "disconnectBLEDevice";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.disconnectBLEDevice$ = disconnectBLEDevice$, exports.default = disconnectBLEDevice$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/downloadAudio.js
  var require_downloadAudio = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/downloadAudio.js"(exports) {
      "use strict";
      function downloadAudio$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.downloadAudio$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.download";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.downloadAudio$ = downloadAudio$, exports.default = downloadAudio$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/downloadFile.js
  var require_downloadFile3 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/downloadFile.js"(exports) {
      "use strict";
      function downloadFile$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.downloadFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.file.downloadFile";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a)), exports.downloadFile$ = downloadFile$, exports.default = downloadFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/editExternalUser.js
  var require_editExternalUser = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/editExternalUser.js"(exports) {
      "use strict";
      function editExternalUser$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.editExternalUser$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.contact.externalEditForm";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.editExternalUser$ = editExternalUser$, exports.default = editExternalUser$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/editPicture.js
  var require_editPicture = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/editPicture.js"(exports) {
      "use strict";
      function editPicture$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.editPicture$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.editPicture";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.1.21" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.1.21" }, _a)), exports.editPicture$ = editPicture$, exports.default = editPicture$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/enablePullDownRefresh.js
  var require_enablePullDownRefresh = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/enablePullDownRefresh.js"(exports) {
      "use strict";
      function enablePullDownRefresh$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.enablePullDownRefresh$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "ui.pullToRefresh.enable";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.enablePullDownRefresh$ = enablePullDownRefresh$, exports.default = enablePullDownRefresh$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/enableWebViewBounce.js
  var require_enableWebViewBounce = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/enableWebViewBounce.js"(exports) {
      "use strict";
      function enableWebViewBounce$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.enableWebViewBounce$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "ui.webViewBounce.enable";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.enableWebViewBounce$ = enableWebViewBounce$, exports.default = enableWebViewBounce$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/encrypt.js
  var require_encrypt2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/encrypt.js"(exports) {
      "use strict";
      function encrypt$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.encrypt$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.encrypt";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.encrypt$ = encrypt$, exports.default = encrypt$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/exclusiveLiveCheck.js
  var require_exclusiveLiveCheck2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/exclusiveLiveCheck.js"(exports) {
      "use strict";
      function exclusiveLiveCheck$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.exclusiveLiveCheck$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.ATMBle.exclusiveLiveCheck";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.40" }, _a)), exports.exclusiveLiveCheck$ = exclusiveLiveCheck$, exports.default = exclusiveLiveCheck$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/generateImageFromCode.js
  var require_generateImageFromCode = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/generateImageFromCode.js"(exports) {
      "use strict";
      function generateImageFromCode$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.generateImageFromCode$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.generateImageFromCode";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.generateImageFromCode$ = generateImageFromCode$, exports.default = generateImageFromCode$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getAccountType.js
  var require_getAccountType = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getAccountType.js"(exports) {
      "use strict";
      function getAccountType$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getAccountType$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.i18n.getAccountType";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.8.5" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.8.5" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.8.5" }, _a)), exports.getAccountType$ = getAccountType$, exports.default = getAccountType$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getActiveConferenceInfo.js
  var require_getActiveConferenceInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getActiveConferenceInfo.js"(exports) {
      "use strict";
      function getActiveConferenceInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getActiveConferenceInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.conference.getConferenceInfo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.2.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "8.2.15" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "8.2.15" }, _a)), exports.getActiveConferenceInfo$ = getActiveConferenceInfo$, exports.default = getActiveConferenceInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getAdvertisingStatus.js
  var require_getAdvertisingStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getAdvertisingStatus.js"(exports) {
      "use strict";
      function getAdvertisingStatus$(t) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, t);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getAdvertisingStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.getAdvertisingStatus";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.0" }, _a)), exports.getAdvertisingStatus$ = getAdvertisingStatus$, exports.default = getAdvertisingStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getAuthCode.js
  var require_getAuthCode = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getAuthCode.js"(exports) {
      "use strict";
      function getAuthCode$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getAuthCode$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "runtime.permission.requestAuthCode";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.getAuthCode$ = getAuthCode$, exports.default = getAuthCode$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getAuthCodeV2.js
  var require_getAuthCodeV2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getAuthCodeV2.js"(exports) {
      "use strict";
      function getAuthCodeV2$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getAuthCodeV2$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "runtime.permission.requestAuthCodeV2";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.45" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.45" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.50" }, _a)), exports.getAuthCodeV2$ = getAuthCodeV2$, exports.default = getAuthCodeV2$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getAuthInfo.js
  var require_getAuthInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getAuthInfo.js"(exports) {
      "use strict";
      function getAuthInfo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getAuthInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "runtime.permission.getAuthInfo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.26" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.26" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.5.26" }, _a)), exports.getAuthInfo$ = getAuthInfo$, exports.default = getAuthInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getBLEDeviceCharacteristics.js
  var require_getBLEDeviceCharacteristics = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getBLEDeviceCharacteristics.js"(exports) {
      "use strict";
      function getBLEDeviceCharacteristics$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var i, t = 1, a = arguments.length; t < a; t++) {
            i = arguments[t];
            for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (e[r] = i[r]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getBLEDeviceCharacteristics$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "getBLEDeviceCharacteristics";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.getBLEDeviceCharacteristics$ = getBLEDeviceCharacteristics$, exports.default = getBLEDeviceCharacteristics$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getBLEDeviceServices.js
  var require_getBLEDeviceServices = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getBLEDeviceServices.js"(exports) {
      "use strict";
      function getBLEDeviceServices$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var i, r = 1, d = arguments.length; r < d; r++) {
            i = arguments[r];
            for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (e[s] = i[s]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getBLEDeviceServices$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "getBLEDeviceServices";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.getBLEDeviceServices$ = getBLEDeviceServices$, exports.default = getBLEDeviceServices$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getBatteryInfo.js
  var require_getBatteryInfo2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getBatteryInfo.js"(exports) {
      "use strict";
      function getBatteryInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getBatteryInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.base.getBatteryInfo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.60" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.60" }, _a)), exports.getBatteryInfo$ = getBatteryInfo$, exports.default = getBatteryInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getBeacons.js
  var require_getBeacons = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getBeacons.js"(exports) {
      "use strict";
      function getBeacons$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var a, d = 1, s = arguments.length; d < s; d++) {
            a = arguments[d];
            for (var t in a) Object.prototype.hasOwnProperty.call(a, t) && (e[t] = a[t]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getBeacons$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "getBeacons";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.getBeacons$ = getBeacons$, exports.default = getBeacons$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getBluetoothAdapterState.js
  var require_getBluetoothAdapterState = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getBluetoothAdapterState.js"(exports) {
      "use strict";
      function getBluetoothAdapterState$(t) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, t));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(t) {
          for (var e, a = 1, d = arguments.length; a < d; a++) {
            e = arguments[a];
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
          }
          return t;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getBluetoothAdapterState$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "getBluetoothAdapterState";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.getBluetoothAdapterState$ = getBluetoothAdapterState$, exports.default = getBluetoothAdapterState$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getBluetoothDevices.js
  var require_getBluetoothDevices = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getBluetoothDevices.js"(exports) {
      "use strict";
      function getBluetoothDevices$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var t, d = 1, i = arguments.length; d < i; d++) {
            t = arguments[d];
            for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getBluetoothDevices$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "getBluetoothDevices";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.getBluetoothDevices$ = getBluetoothDevices$, exports.default = getBluetoothDevices$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getCachedAPIResponse.js
  var require_getCachedAPIResponse = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getCachedAPIResponse.js"(exports) {
      "use strict";
      function getCachedAPIResponse$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getCachedAPIResponse$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.getCachedAPIResponse";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.0.15" }, _a)), exports.getCachedAPIResponse$ = getCachedAPIResponse$, exports.default = getCachedAPIResponse$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getCloudCallInfo.js
  var require_getCloudCallInfo2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getCloudCallInfo.js"(exports) {
      "use strict";
      function getCloudCallInfo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getCloudCallInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.conference.getCloudCallInfo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.getCloudCallInfo$ = getCloudCallInfo$, exports.default = getCloudCallInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getCloudCallList.js
  var require_getCloudCallList2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getCloudCallList.js"(exports) {
      "use strict";
      function getCloudCallList$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getCloudCallList$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.conference.getCloudCallList";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.9" }, _a)), exports.getCloudCallList$ = getCloudCallList$, exports.default = getCloudCallList$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getCurrentCorpId.js
  var require_getCurrentCorpId = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getCurrentCorpId.js"(exports) {
      "use strict";
      function getCurrentCorpId$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getCurrentCorpId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.minutes.getCurrentCorpId";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.8.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.8.0" }, _a)), exports.getCurrentCorpId$ = getCurrentCorpId$, exports.default = getCurrentCorpId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getDeviceId.js
  var require_getDeviceId = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getDeviceId.js"(exports) {
      "use strict";
      function getDeviceId$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getDeviceId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.base.getDeviceId";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.30" }, _a)), exports.getDeviceId$ = getDeviceId$, exports.default = getDeviceId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getDeviceUUID.js
  var require_getDeviceUUID = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getDeviceUUID.js"(exports) {
      "use strict";
      function getDeviceUUID$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getDeviceUUID$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.base.getUUID";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.getDeviceUUID$ = getDeviceUUID$, exports.default = getDeviceUUID$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getDingerDeviceStatus.js
  var require_getDingerDeviceStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getDingerDeviceStatus.js"(exports) {
      "use strict";
      function getDingerDeviceStatus$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getDingerDeviceStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.dinger.getDingerDeviceStatus";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "8.0.28" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.2.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "8.2.15" }, _a)), exports.getDingerDeviceStatus$ = getDingerDeviceStatus$, exports.default = getDingerDeviceStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getImageInfo.js
  var require_getImageInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getImageInfo.js"(exports) {
      "use strict";
      function getImageInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getImageInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.getImageInfo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.2" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.2" }, _a)), exports.getImageInfo$ = getImageInfo$, exports.default = getImageInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getLocatingStatus.js
  var require_getLocatingStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getLocatingStatus.js"(exports) {
      "use strict";
      function getLocatingStatus$(t) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, t);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getLocatingStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.geolocation.status";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.getLocatingStatus$ = getLocatingStatus$, exports.default = getLocatingStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getLocation.js
  var require_getLocation = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getLocation.js"(exports) {
      "use strict";
      function getLocation$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getLocation$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.geolocation.get";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.getLocation$ = getLocation$, exports.default = getLocation$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getNetworkType.js
  var require_getNetworkType2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getNetworkType.js"(exports) {
      "use strict";
      function getNetworkType$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getNetworkType$ = void 0;
      var apiHelper_1 = require_apiHelper();
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.connection.getNetworkType";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", resultDeal: apiHelper_1.getNetWorkTypeResultDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", resultDeal: apiHelper_1.getNetWorkTypeResultDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.5.60", resultDeal: function(e) {
        return "none" !== e.result && "unknown" !== e.result ? { netWorkAvailable: true } : { netWorkAvailable: false };
      } }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", resultDeal: apiHelper_1.getNetWorkTypeResultDeal }, _a)), exports.getNetworkType$ = getNetworkType$, exports.default = getNetworkType$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getOperateAuthCode.js
  var require_getOperateAuthCode = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getOperateAuthCode.js"(exports) {
      "use strict";
      function getOperateAuthCode$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getOperateAuthCode$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "runtime.permission.requestOperateAuthCode";
      var paramsDeal = function(e) {
        return Object.assign(e, { url: location.href.split("#")[0] });
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0", paramsDeal }, _a)), exports.getOperateAuthCode$ = getOperateAuthCode$, exports.default = getOperateAuthCode$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getPageTerminateInfo.js
  var require_getPageTerminateInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getPageTerminateInfo.js"(exports) {
      "use strict";
      function getPageTerminateInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getPageTerminateInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.getPageTerminateInfo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.0.15" }, _a)), exports.getPageTerminateInfo$ = getPageTerminateInfo$, exports.default = getPageTerminateInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getPersonalWorkInfo.js
  var require_getPersonalWorkInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getPersonalWorkInfo.js"(exports) {
      "use strict";
      function getPersonalWorkInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getPersonalWorkInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.user.get";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.2.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "8.2.15" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "8.2.15" }, _a)), exports.getPersonalWorkInfo$ = getPersonalWorkInfo$, exports.default = getPersonalWorkInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getScreenBrightness.js
  var require_getScreenBrightness2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getScreenBrightness.js"(exports) {
      "use strict";
      function getScreenBrightness$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getScreenBrightness$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.screen.getScreenBrightness";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.getScreenBrightness$ = getScreenBrightness$, exports.default = getScreenBrightness$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getStorage.js
  var require_getStorage = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getStorage.js"(exports) {
      "use strict";
      function getStorage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, t = 1, r = arguments.length; t < r; t++) {
            e = arguments[t];
            for (var s in e) Object.prototype.hasOwnProperty.call(e, s) && (a[s] = e[s]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getStorage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "util.domainStorage.getItem";
      var paramsDeal = function(a) {
        var e = { name: a.key };
        return __assign(__assign({}, e), a);
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a)), exports.getStorage$ = getStorage$, exports.default = getStorage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getSystemInfo.js
  var require_getSystemInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getSystemInfo.js"(exports) {
      "use strict";
      function getSystemInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getSystemInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.base.getPhoneInfo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.getSystemInfo$ = getSystemInfo$, exports.default = getSystemInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getSystemSettings.js
  var require_getSystemSettings = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getSystemSettings.js"(exports) {
      "use strict";
      function getSystemSettings$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getSystemSettings$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.base.openSystemSetting";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.36" }, _a)), exports.getSystemSettings$ = getSystemSettings$, exports.default = getSystemSettings$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getThirdAppConfCustomData.js
  var require_getThirdAppConfCustomData = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getThirdAppConfCustomData.js"(exports) {
      "use strict";
      function getThirdAppConfCustomData$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getThirdAppConfCustomData$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.conference.getThirdAppConfCustomData";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.6.0" }, _a)), exports.getThirdAppConfCustomData$ = getThirdAppConfCustomData$, exports.default = getThirdAppConfCustomData$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getThirdAppUserCustomData.js
  var require_getThirdAppUserCustomData = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getThirdAppUserCustomData.js"(exports) {
      "use strict";
      function getThirdAppUserCustomData$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getThirdAppUserCustomData$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.conference.getThirdAppUserCustomData";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.6.0" }, _a)), exports.getThirdAppUserCustomData$ = getThirdAppUserCustomData$, exports.default = getThirdAppUserCustomData$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getTodaysStepCount.js
  var require_getTodaysStepCount = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getTodaysStepCount.js"(exports) {
      "use strict";
      function getTodaysStepCount$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getTodaysStepCount$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.sports.getTodaysStepCount";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.getTodaysStepCount$ = getTodaysStepCount$, exports.default = getTodaysStepCount$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getTranslateStatus.js
  var require_getTranslateStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getTranslateStatus.js"(exports) {
      "use strict";
      function getTranslateStatus$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getTranslateStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.i18n.getTranslateStatus";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.5.35" }, _a)), exports.getTranslateStatus$ = getTranslateStatus$, exports.default = getTranslateStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getUserExclusiveInfo.js
  var require_getUserExclusiveInfo2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getUserExclusiveInfo.js"(exports) {
      "use strict";
      function getUserExclusiveInfo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getUserExclusiveInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.getUserExclusiveInfo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.15" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.17" }, _a)), exports.getUserExclusiveInfo$ = getUserExclusiveInfo$, exports.default = getUserExclusiveInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getWifiHotspotStatus.js
  var require_getWifiHotspotStatus = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getWifiHotspotStatus.js"(exports) {
      "use strict";
      function getWifiHotspotStatus$(t) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, t);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getWifiHotspotStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.base.getInterface";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "8.1.0" }, _a)), exports.getWifiHotspotStatus$ = getWifiHotspotStatus$, exports.default = getWifiHotspotStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/getWifiStatus.js
  var require_getWifiStatus2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/getWifiStatus.js"(exports) {
      "use strict";
      function getWifiStatus$(t) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, t);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getWifiStatus$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.base.getWifiStatus";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.getWifiStatus$ = getWifiStatus$, exports.default = getWifiStatus$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/goBackPage.js
  var require_goBackPage = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/goBackPage.js"(exports) {
      "use strict";
      function goBackPage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.goBackPage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.goBack";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.goBackPage$ = goBackPage$, exports.default = goBackPage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/hideLoading.js
  var require_hideLoading = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/hideLoading.js"(exports) {
      "use strict";
      function hideLoading$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.hideLoading$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.hidePreloader";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10" }, _a)), exports.hideLoading$ = hideLoading$, exports.default = hideLoading$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/hideToast.js
  var require_hideToast = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/hideToast.js"(exports) {
      "use strict";
      function hideToast$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.hideToast$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.hideToast";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10" }, _a)), exports.hideToast$ = hideToast$, exports.default = hideToast$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/isInTabWindow.js
  var require_isInTabWindow = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/isInTabWindow.js"(exports) {
      "use strict";
      function isInTabWindow$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.isInTabWindow$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.tabwindow.isTab";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.5.10" }, _a)), exports.isInTabWindow$ = isInTabWindow$, exports.default = isInTabWindow$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/isLocalFileExist.js
  var require_isLocalFileExist2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/isLocalFileExist.js"(exports) {
      "use strict";
      function isLocalFileExist$(i) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, i);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.isLocalFileExist$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.isLocalFileExist";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.isLocalFileExist$ = isLocalFileExist$, exports.default = isLocalFileExist$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/isScreenReaderEnabled.js
  var require_isScreenReaderEnabled2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/isScreenReaderEnabled.js"(exports) {
      "use strict";
      function isScreenReaderEnabled$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.isScreenReaderEnabled$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.screen.isScreenReaderEnabled";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.60" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.60" }, _a)), exports.isScreenReaderEnabled$ = isScreenReaderEnabled$, exports.default = isScreenReaderEnabled$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/locateInMap.js
  var require_locateInMap = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/locateInMap.js"(exports) {
      "use strict";
      function locateInMap$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.locateInMap$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.map.locate";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.locateInMap$ = locateInMap$, exports.default = locateInMap$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/makeCloudCall.js
  var require_makeCloudCall = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/makeCloudCall.js"(exports) {
      "use strict";
      function makeCloudCall$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.makeCloudCall$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.conference.createCloudCall";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.9" }, _a)), exports.makeCloudCall$ = makeCloudCall$, exports.default = makeCloudCall$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/makeVideoConfCall.js
  var require_makeVideoConfCall = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/makeVideoConfCall.js"(exports) {
      "use strict";
      function makeVideoConfCall$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.makeVideoConfCall$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.conference.videoConfCall";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.makeVideoConfCall$ = makeVideoConfCall$, exports.default = makeVideoConfCall$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/minutesCreateFromVideo.js
  var require_minutesCreateFromVideo = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/minutesCreateFromVideo.js"(exports) {
      "use strict";
      function minutesCreateFromVideo$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.minutesCreateFromVideo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.minutes.createFromVideo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.6.40" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.40" }, _a)), exports.minutesCreateFromVideo$ = minutesCreateFromVideo$, exports.default = minutesCreateFromVideo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/minutesStart.js
  var require_minutesStart = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/minutesStart.js"(exports) {
      "use strict";
      function minutesStart$(t) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, t);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.minutesStart$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.minutes.startMinutes";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.6.40" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.40" }, _a)), exports.minutesStart$ = minutesStart$, exports.default = minutesStart$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/minutesUploadVideo.js
  var require_minutesUploadVideo = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/minutesUploadVideo.js"(exports) {
      "use strict";
      function minutesUploadVideo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.minutesUploadVideo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.minutes.uploadVideo";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "8.0.24" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.6.40" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.40" }, _a)), exports.minutesUploadVideo$ = minutesUploadVideo$, exports.default = minutesUploadVideo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/minutesViewDetail.js
  var require_minutesViewDetail = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/minutesViewDetail.js"(exports) {
      "use strict";
      function minutesViewDetail$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.minutesViewDetail$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.minutes.viewDetail";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.6.40" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.40" }, _a)), exports.minutesViewDetail$ = minutesViewDetail$, exports.default = minutesViewDetail$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/multiSelect.js
  var require_multiSelect2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/multiSelect.js"(exports) {
      "use strict";
      function multiSelect$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.multiSelect$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.multiSelect";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.multiSelect$ = multiSelect$, exports.default = multiSelect$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/navigateBackPage.js
  var require_navigateBackPage2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/navigateBackPage.js"(exports) {
      "use strict";
      function navigateBackPage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.navigateBackPage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.navigateBackPage";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.45" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.45" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.navigateBackPage$ = navigateBackPage$, exports.default = navigateBackPage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/navigateToPage.js
  var require_navigateToPage2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/navigateToPage.js"(exports) {
      "use strict";
      function navigateToPage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.navigateToPage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.navigateToPage";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.45" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.45" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.0" }, _a)), exports.navigateToPage$ = navigateToPage$, exports.default = navigateToPage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/nfcReadCardNumber.js
  var require_nfcReadCardNumber = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/nfcReadCardNumber.js"(exports) {
      "use strict";
      function nfcReadCardNumber$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.nfcReadCardNumber$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.nfc.nfcReadCardNumber";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.60" }, _a)), exports.nfcReadCardNumber$ = nfcReadCardNumber$, exports.default = nfcReadCardNumber$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/notifyBLECharacteristicValueChange.js
  var require_notifyBLECharacteristicValueChange = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/notifyBLECharacteristicValueChange.js"(exports) {
      "use strict";
      function notifyBLECharacteristicValueChange$(a) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, a));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, i = 1, t = arguments.length; i < t; i++) {
            e = arguments[i];
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (a[r] = e[r]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.notifyBLECharacteristicValueChange$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "notifyBLECharacteristicValueChange";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.notifyBLECharacteristicValueChange$ = notifyBLECharacteristicValueChange$, exports.default = notifyBLECharacteristicValueChange$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/notifyTranslateEvent.js
  var require_notifyTranslateEvent = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/notifyTranslateEvent.js"(exports) {
      "use strict";
      function notifyTranslateEvent$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.notifyTranslateEvent$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.i18n.notifyTranslateEvent";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.5.35" }, _a)), exports.notifyTranslateEvent$ = notifyTranslateEvent$, exports.default = notifyTranslateEvent$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/offBLECharacteristicValueChange.js
  var require_offBLECharacteristicValueChange = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/offBLECharacteristicValueChange.js"(exports) {
      "use strict";
      function offBLECharacteristicValueChange$(a) {
        ddSdk_1.ddSdk.getExportSdk().off("bizEvent." + apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.offBLECharacteristicValueChange$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "BLECharacteristicValueChange";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.10" }, _a)), exports.offBLECharacteristicValueChange$ = offBLECharacteristicValueChange$, exports.default = offBLECharacteristicValueChange$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/offBLEConnectionStateChanged.js
  var require_offBLEConnectionStateChanged = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/offBLEConnectionStateChanged.js"(exports) {
      "use strict";
      function offBLEConnectionStateChanged$(d) {
        ddSdk_1.ddSdk.getExportSdk().off("bizEvent." + apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.offBLEConnectionStateChanged$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "BLEConnectionStateChanged";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.10" }, _a)), exports.offBLEConnectionStateChanged$ = offBLEConnectionStateChanged$, exports.default = offBLEConnectionStateChanged$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/offBluetoothAdapterStateChange.js
  var require_offBluetoothAdapterStateChange = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/offBluetoothAdapterStateChange.js"(exports) {
      "use strict";
      function offBluetoothAdapterStateChange$(e) {
        ddSdk_1.ddSdk.getExportSdk().off("bizEvent." + apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.offBluetoothAdapterStateChange$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "bluetoothAdapterStateChange";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.10" }, _a)), exports.offBluetoothAdapterStateChange$ = offBluetoothAdapterStateChange$, exports.default = offBluetoothAdapterStateChange$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/offBluetoothDeviceFound.js
  var require_offBluetoothDeviceFound = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/offBluetoothDeviceFound.js"(exports) {
      "use strict";
      function offBluetoothDeviceFound$(d) {
        ddSdk_1.ddSdk.getExportSdk().off("bizEvent." + apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.offBluetoothDeviceFound$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "bluetoothDeviceFound";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.10" }, _a)), exports.offBluetoothDeviceFound$ = offBluetoothDeviceFound$, exports.default = offBluetoothDeviceFound$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBLECharacteristicValueChange.js
  var require_onBLECharacteristicValueChange = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBLECharacteristicValueChange.js"(exports) {
      "use strict";
      function onBLECharacteristicValueChange$(a) {
        ddSdk_1.ddSdk.getExportSdk().on("bizEvent." + apiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBLECharacteristicValueChange$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "BLECharacteristicValueChange";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.10" }, _a)), exports.onBLECharacteristicValueChange$ = onBLECharacteristicValueChange$, exports.default = onBLECharacteristicValueChange$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBLEConnectionStateChanged.js
  var require_onBLEConnectionStateChanged = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBLEConnectionStateChanged.js"(exports) {
      "use strict";
      function onBLEConnectionStateChanged$(d) {
        ddSdk_1.ddSdk.getExportSdk().on("bizEvent." + apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBLEConnectionStateChanged$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "BLEConnectionStateChanged";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.10" }, _a)), exports.onBLEConnectionStateChanged$ = onBLEConnectionStateChanged$, exports.default = onBLEConnectionStateChanged$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBLEPeripheralCharacteristicReadRequest.js
  var require_onBLEPeripheralCharacteristicReadRequest = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBLEPeripheralCharacteristicReadRequest.js"(exports) {
      "use strict";
      function onBLEPeripheralCharacteristicReadRequest$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBLEPeripheralCharacteristicReadRequest$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.onBLEPeripheralCharacteristicReadRequest";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.6.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.10" }, _a)), exports.onBLEPeripheralCharacteristicReadRequest$ = onBLEPeripheralCharacteristicReadRequest$, exports.default = onBLEPeripheralCharacteristicReadRequest$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBLEPeripheralCharacteristicWriteRequest.js
  var require_onBLEPeripheralCharacteristicWriteRequest = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBLEPeripheralCharacteristicWriteRequest.js"(exports) {
      "use strict";
      function onBLEPeripheralCharacteristicWriteRequest$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBLEPeripheralCharacteristicWriteRequest$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.onBLEPeripheralCharacteristicWriteRequest";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.6.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.10" }, _a)), exports.onBLEPeripheralCharacteristicWriteRequest$ = onBLEPeripheralCharacteristicWriteRequest$, exports.default = onBLEPeripheralCharacteristicWriteRequest$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBLEPeripheralConnectionStateChanged.js
  var require_onBLEPeripheralConnectionStateChanged = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBLEPeripheralConnectionStateChanged.js"(exports) {
      "use strict";
      function onBLEPeripheralConnectionStateChanged$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBLEPeripheralConnectionStateChanged$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.onBLEPeripheralConnectionStateChanged";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.10" }, _a)), exports.onBLEPeripheralConnectionStateChanged$ = onBLEPeripheralConnectionStateChanged$, exports.default = onBLEPeripheralConnectionStateChanged$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBeaconServiceChange.js
  var require_onBeaconServiceChange = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBeaconServiceChange.js"(exports) {
      "use strict";
      function onBeaconServiceChange$(e) {
        ddSdk_1.ddSdk.getExportSdk().on("bizEvent." + apiName, function(d) {
          "function" == typeof e.success ? e.success(d) : "function" == typeof e.onSuccess && e.onSuccess(d);
        });
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBeaconServiceChange$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "beaconServiceChange";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.onBeaconServiceChange$ = onBeaconServiceChange$, exports.default = onBeaconServiceChange$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBeaconUpdate.js
  var require_onBeaconUpdate = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBeaconUpdate.js"(exports) {
      "use strict";
      function onBeaconUpdate$(d) {
        ddSdk_1.ddSdk.getExportSdk().on("bizEvent." + apiName, function(e) {
          "function" == typeof d.success ? d.success(e) : "function" == typeof d.onSuccess && d.onSuccess(e);
        });
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBeaconUpdate$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "beaconUpdate";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.onBeaconUpdate$ = onBeaconUpdate$, exports.default = onBeaconUpdate$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBluetoothAdapterStateChange.js
  var require_onBluetoothAdapterStateChange = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBluetoothAdapterStateChange.js"(exports) {
      "use strict";
      function onBluetoothAdapterStateChange$(e) {
        ddSdk_1.ddSdk.getExportSdk().on("bizEvent." + apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBluetoothAdapterStateChange$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "bluetoothAdapterStateChange";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.10" }, _a)), exports.onBluetoothAdapterStateChange$ = onBluetoothAdapterStateChange$, exports.default = onBluetoothAdapterStateChange$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onBluetoothDeviceFound.js
  var require_onBluetoothDeviceFound = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onBluetoothDeviceFound.js"(exports) {
      "use strict";
      function onBluetoothDeviceFound$(d) {
        ddSdk_1.ddSdk.getExportSdk().on("bizEvent." + apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onBluetoothDeviceFound$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "bluetoothDeviceFound";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.10" }, _a)), exports.onBluetoothDeviceFound$ = onBluetoothDeviceFound$, exports.default = onBluetoothDeviceFound$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onPlayAudioEnd.js
  var require_onPlayAudioEnd = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onPlayAudioEnd.js"(exports) {
      "use strict";
      function onPlayAudioEnd$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onPlayAudioEnd$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.onPlayEnd";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.onPlayAudioEnd$ = onPlayAudioEnd$, exports.default = onPlayAudioEnd$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/onRecordEnd.js
  var require_onRecordEnd2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/onRecordEnd.js"(exports) {
      "use strict";
      function onRecordEnd$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.onRecordEnd$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.onRecordEnd";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.onRecordEnd$ = onRecordEnd$, exports.default = onRecordEnd$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openBluetoothAdapter.js
  var require_openBluetoothAdapter = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openBluetoothAdapter.js"(exports) {
      "use strict";
      function openBluetoothAdapter$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var t, d = 1, o = arguments.length; d < o; d++) {
            t = arguments[d];
            for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openBluetoothAdapter$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "openBluetoothAdapter";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.openBluetoothAdapter$ = openBluetoothAdapter$, exports.default = openBluetoothAdapter$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openChatByChatId.js
  var require_openChatByChatId = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openChatByChatId.js"(exports) {
      "use strict";
      function openChatByChatId$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openChatByChatId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.chat.toConversation";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.openChatByChatId$ = openChatByChatId$, exports.default = openChatByChatId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openChatByConversationId.js
  var require_openChatByConversationId = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openChatByConversationId.js"(exports) {
      "use strict";
      function openChatByConversationId$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openChatByConversationId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.chat.toConversationByOpenConversationId";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.openChatByConversationId$ = openChatByConversationId$, exports.default = openChatByConversationId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openChatByUserId.js
  var require_openChatByUserId = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openChatByUserId.js"(exports) {
      "use strict";
      function openChatByUserId$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openChatByUserId$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.chat.openSingleChat";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.openChatByUserId$ = openChatByUserId$, exports.default = openChatByUserId$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openDocument.js
  var require_openDocument2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openDocument.js"(exports) {
      "use strict";
      function openDocument$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openDocument$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.openDocument";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10" }, _a)), exports.openDocument$ = openDocument$, exports.default = openDocument$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openLink.js
  var require_openLink2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openLink.js"(exports) {
      "use strict";
      function openLink$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openLink$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.openLink";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.openLink$ = openLink$, exports.default = openLink$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openLocalFile.js
  var require_openLocalFile2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openLocalFile.js"(exports) {
      "use strict";
      function openLocalFile$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openLocalFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.openLocalFile";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.openLocalFile$ = openLocalFile$, exports.default = openLocalFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openLocation.js
  var require_openLocation = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openLocation.js"(exports) {
      "use strict";
      function openLocation$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openLocation$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.map.view";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.openLocation$ = openLocation$, exports.default = openLocation$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openMicroApp.js
  var require_openMicroApp = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openMicroApp.js"(exports) {
      "use strict";
      function openMicroApp$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openMicroApp$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.microApp.openApp";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.openMicroApp$ = openMicroApp$, exports.default = openMicroApp$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openPageInMicroApp.js
  var require_openPageInMicroApp = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openPageInMicroApp.js"(exports) {
      "use strict";
      function openPageInMicroApp$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openPageInMicroApp$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.open";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.openPageInMicroApp$ = openPageInMicroApp$, exports.default = openPageInMicroApp$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openPageInModalForPC.js
  var require_openPageInModalForPC = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openPageInModalForPC.js"(exports) {
      "use strict";
      function openPageInModalForPC$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openPageInModalForPC$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.openModal";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.openPageInModalForPC$ = openPageInModalForPC$, exports.default = openPageInModalForPC$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openPageInSlidePanelForPC.js
  var require_openPageInSlidePanelForPC = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openPageInSlidePanelForPC.js"(exports) {
      "use strict";
      function openPageInSlidePanelForPC$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openPageInSlidePanelForPC$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.openSlidePanel";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.openPageInSlidePanelForPC$ = openPageInSlidePanelForPC$, exports.default = openPageInSlidePanelForPC$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/openPageInWorkBenchForPC.js
  var require_openPageInWorkBenchForPC = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/openPageInWorkBenchForPC.js"(exports) {
      "use strict";
      function openPageInWorkBenchForPC$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.openPageInWorkBenchForPC$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.invokeWorkbench";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.8" }, _a)), exports.openPageInWorkBenchForPC$ = openPageInWorkBenchForPC$, exports.default = openPageInWorkBenchForPC$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/pauseAudio.js
  var require_pauseAudio = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/pauseAudio.js"(exports) {
      "use strict";
      function pauseAudio$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.pauseAudio$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.pause";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.pauseAudio$ = pauseAudio$, exports.default = pauseAudio$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/playAudio.js
  var require_playAudio = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/playAudio.js"(exports) {
      "use strict";
      function playAudio$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.playAudio$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.play";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.playAudio$ = playAudio$, exports.default = playAudio$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/popGesture.js
  var require_popGesture = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/popGesture.js"(exports) {
      "use strict";
      function popGesture$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.popGesture$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.popGesture";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a)), exports.popGesture$ = popGesture$, exports.default = popGesture$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/previewFileInDingTalk.js
  var require_previewFileInDingTalk = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/previewFileInDingTalk.js"(exports) {
      "use strict";
      function previewFileInDingTalk$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.previewFileInDingTalk$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.cspace.preview";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.previewFileInDingTalk$ = previewFileInDingTalk$, exports.default = previewFileInDingTalk$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/previewImage.js
  var require_previewImage2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/previewImage.js"(exports) {
      "use strict";
      function previewImage$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.previewImage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.previewImage";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0", paramsDeal: function(e) {
        return { urls: e.urls, current: "number" == typeof (null === e || void 0 === e ? void 0 : e.current) ? e.urls[e.current] : e.current };
      } }, _a)), exports.previewImage$ = previewImage$, exports.default = previewImage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/previewImagesInDingTalkBatch.js
  var require_previewImagesInDingTalkBatch = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/previewImagesInDingTalkBatch.js"(exports) {
      "use strict";
      function previewImagesInDingTalkBatch$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.previewImagesInDingTalkBatch$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.cspace.previewDentryImages";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.30" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.30" }, _a)), exports.previewImagesInDingTalkBatch$ = previewImagesInDingTalkBatch$, exports.default = previewImagesInDingTalkBatch$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/previewMedia.js
  var require_previewMedia = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/previewMedia.js"(exports) {
      "use strict";
      function previewMedia$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.previewMedia$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.previewMedia";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.1.21" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.1.21" }, _a)), exports.previewMedia$ = previewMedia$, exports.default = previewMedia$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/prompt.js
  var require_prompt2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/prompt.js"(exports) {
      "use strict";
      function prompt$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, { message: e.message, title: e.title, defaultText: e.placeholder, buttonLabels: [e.cancelButtonText, e.okButtonText], success: e.success, fail: e.fail, complete: e.complete });
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var a, t = 1, s = arguments.length; t < s; t++) {
            a = arguments[t];
            for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.prompt$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.prompt";
      var paramsDeal = function(e) {
        var a = { title: e.title || "", message: e.message, defaultText: e.placeholder, buttonLabels: [e.cancelButtonText || "\u53D6\u6D88", e.okButtonText || "\u786E\u5B9A"] };
        return __assign(__assign({}, a), e);
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal }, _a)), exports.prompt$ = prompt$, exports.default = prompt$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/quickCallList.js
  var require_quickCallList2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/quickCallList.js"(exports) {
      "use strict";
      function quickCallList$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.quickCallList$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.telephone.quickCallList";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.quickCallList$ = quickCallList$, exports.default = quickCallList$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/quitPage.js
  var require_quitPage = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/quitPage.js"(exports) {
      "use strict";
      function quitPage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.quitPage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.quit";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.quitPage$ = quitPage$, exports.default = quitPage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/readBLECharacteristicValue.js
  var require_readBLECharacteristicValue = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/readBLECharacteristicValue.js"(exports) {
      "use strict";
      function readBLECharacteristicValue$(a) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, a));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, r = 1, d = arguments.length; r < d; r++) {
            e = arguments[r];
            for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (a[i] = e[i]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.readBLECharacteristicValue$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "readBLECharacteristicValue";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.readBLECharacteristicValue$ = readBLECharacteristicValue$, exports.default = readBLECharacteristicValue$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/readNFC.js
  var require_readNFC = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/readNFC.js"(exports) {
      "use strict";
      function readNFC$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.readNFC$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.nfc.nfcRead";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.readNFC$ = readNFC$, exports.default = readNFC$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/removeCachedAPIResponse.js
  var require_removeCachedAPIResponse = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/removeCachedAPIResponse.js"(exports) {
      "use strict";
      function removeCachedAPIResponse$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.removeCachedAPIResponse$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.removeCachedAPIResponse";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.0.15" }, _a)), exports.removeCachedAPIResponse$ = removeCachedAPIResponse$, exports.default = removeCachedAPIResponse$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/removeStorage.js
  var require_removeStorage = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/removeStorage.js"(exports) {
      "use strict";
      function removeStorage$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, { name: e.key });
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.removeStorage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "util.domainStorage.removeItem";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.removeStorage$ = removeStorage$, exports.default = removeStorage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/replacePage.js
  var require_replacePage = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/replacePage.js"(exports) {
      "use strict";
      function replacePage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.replacePage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.replace";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.replacePage$ = replacePage$, exports.default = replacePage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/requestAuthCode.js
  var require_requestAuthCode3 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/requestAuthCode.js"(exports) {
      "use strict";
      function requestAuthCode$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.requestAuthCode$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "runtime.permission.requestAuthCodeV2";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.45" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.45" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.50" }, _a)), exports.requestAuthCode$ = requestAuthCode$, exports.default = requestAuthCode$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/requestMoneySubmmitOrder.js
  var require_requestMoneySubmmitOrder = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/requestMoneySubmmitOrder.js"(exports) {
      "use strict";
      function requestMoneySubmmitOrder$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.requestMoneySubmmitOrder$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.requestMoney.startSubmittingOrder";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.1.5" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.1.5" }, _a)), exports.requestMoneySubmmitOrder$ = requestMoneySubmmitOrder$, exports.default = requestMoneySubmmitOrder$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/resetScreenView.js
  var require_resetScreenView = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/resetScreenView.js"(exports) {
      "use strict";
      function resetScreenView$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.resetScreenView$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.screen.resetView";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.resetScreenView$ = resetScreenView$, exports.default = resetScreenView$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/resumeAudio.js
  var require_resumeAudio = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/resumeAudio.js"(exports) {
      "use strict";
      function resumeAudio$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.resumeAudio$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.resume";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.resumeAudio$ = resumeAudio$, exports.default = resumeAudio$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/rotateScreenView.js
  var require_rotateScreenView = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/rotateScreenView.js"(exports) {
      "use strict";
      function rotateScreenView$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.rotateScreenView$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.screen.rotateView";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.rotateScreenView$ = rotateScreenView$, exports.default = rotateScreenView$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/rsa.js
  var require_rsa2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/rsa.js"(exports) {
      "use strict";
      function rsa$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.rsa$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.data.rsa";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.rsa$ = rsa$, exports.default = rsa$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/saveFileToDingTalk.js
  var require_saveFileToDingTalk = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/saveFileToDingTalk.js"(exports) {
      "use strict";
      function saveFileToDingTalk$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.saveFileToDingTalk$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.cspace.saveFile";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.saveFileToDingTalk$ = saveFileToDingTalk$, exports.default = saveFileToDingTalk$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/saveImageToPhotosAlbum.js
  var require_saveImageToPhotosAlbum2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/saveImageToPhotosAlbum.js"(exports) {
      "use strict";
      function saveImageToPhotosAlbum$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.saveImageToPhotosAlbum$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.saveImageToPhotosAlbum";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.0" }, _a)), exports.saveImageToPhotosAlbum$ = saveImageToPhotosAlbum$, exports.default = saveImageToPhotosAlbum$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/saveVideoToPhotosAlbum.js
  var require_saveVideoToPhotosAlbum = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/saveVideoToPhotosAlbum.js"(exports) {
      "use strict";
      function saveVideoToPhotosAlbum$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.saveVideoToPhotosAlbum$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.saveVideoToPhotosAlbum";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.1.20" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.1.20" }, _a)), exports.saveVideoToPhotosAlbum$ = saveVideoToPhotosAlbum$, exports.default = saveVideoToPhotosAlbum$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/scan.js
  var require_scan2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/scan.js"(exports) {
      "use strict";
      function scan$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.scan$ = void 0;
      var apiHelper_1 = require_apiHelper();
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.scan";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal: apiHelper_1.scanParamsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal: apiHelper_1.scanParamsDeal }, _a)), exports.scan$ = scan$, exports.default = scan$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/scanCard.js
  var require_scanCard2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/scanCard.js"(exports) {
      "use strict";
      function scanCard$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.scanCard$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.scanCard";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.scanCard$ = scanCard$, exports.default = scanCard$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/searchMap.js
  var require_searchMap = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/searchMap.js"(exports) {
      "use strict";
      function searchMap$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.searchMap$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.map.search";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.searchMap$ = searchMap$, exports.default = searchMap$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/setClipboard.js
  var require_setClipboard = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/setClipboard.js"(exports) {
      "use strict";
      function setClipboard$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setClipboard$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.clipboardData.setData";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.5.60" }, _a)), exports.setClipboard$ = setClipboard$, exports.default = setClipboard$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/setGestures.js
  var require_setGestures = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/setGestures.js"(exports) {
      "use strict";
      function setGestures$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setGestures$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.gestures";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.15" }, _a)), exports.setGestures$ = setGestures$, exports.default = setGestures$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/setKeepScreenOn.js
  var require_setKeepScreenOn = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/setKeepScreenOn.js"(exports) {
      "use strict";
      function setKeepScreenOn$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setKeepScreenOn$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.setScreenKeepOn";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "5.1.26" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "5.1.26" }, _a)), exports.setKeepScreenOn$ = setKeepScreenOn$, exports.default = setKeepScreenOn$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/setNavigationIcon.js
  var require_setNavigationIcon = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/setNavigationIcon.js"(exports) {
      "use strict";
      function setNavigationIcon$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setNavigationIcon$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "biz.navigation.setIcon";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ watch: true, showIcon: true, iconIndex: 1 });
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.setNavigationIcon$ = setNavigationIcon$, exports.default = setNavigationIcon$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/setNavigationLeft.js
  var require_setNavigationLeft = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/setNavigationLeft.js"(exports) {
      "use strict";
      function setNavigationLeft$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setNavigationLeft$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "biz.navigation.setLeft";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ watch: true, show: true, control: false, showIcon: true, text: "" });
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a)), exports.setNavigationLeft$ = setNavigationLeft$, exports.default = setNavigationLeft$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/setNavigationTitle.js
  var require_setNavigationTitle = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/setNavigationTitle.js"(exports) {
      "use strict";
      function setNavigationTitle$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setNavigationTitle$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.navigation.setTitle";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a)), exports.setNavigationTitle$ = setNavigationTitle$, exports.default = setNavigationTitle$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/setScreenBrightness.js
  var require_setScreenBrightness2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/setScreenBrightness.js"(exports) {
      "use strict";
      function setScreenBrightness$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setScreenBrightness$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.screen.setScreenBrightness";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.setScreenBrightness$ = setScreenBrightness$, exports.default = setScreenBrightness$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/setStorage.js
  var require_setStorage = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/setStorage.js"(exports) {
      "use strict";
      function setStorage$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, s = 1, t = arguments.length; s < t; s++) {
            e = arguments[s];
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (a[r] = e[r]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setStorage$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "util.domainStorage.setItem";
      var paramsDeal = function(a) {
        var e = { name: a.key, value: a.data };
        return __assign(__assign({}, e), a);
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a)), exports.setStorage$ = setStorage$, exports.default = setStorage$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/share.js
  var require_share2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/share.js"(exports) {
      "use strict";
      function share$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.share$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.share";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.share$ = share$, exports.default = share$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/showActionSheet.js
  var require_showActionSheet = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/showActionSheet.js"(exports) {
      "use strict";
      function showActionSheet$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, { title: e.title, cancelButton: e.cancelButtonText, otherButtons: e.items, success: e.success, fail: e.fail, complete: e.complete });
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var t, a = 1, n = arguments.length; a < n; a++) {
            t = arguments[a];
            for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showActionSheet$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.actionSheet";
      var paramsDeal = function(e) {
        var t = { title: e.title, cancelButton: e.cancelButtonText, otherButtons: e.items };
        return __assign(__assign({}, t), e);
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal, resultDeal: function(e) {
        return __assign(__assign({}, e), { index: e.buttonIndex });
      } }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10", paramsDeal, resultDeal: function(e) {
        return __assign(__assign({}, e), { index: e.buttonIndex });
      } }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10", paramsDeal, resultDeal: function(e) {
        return __assign(__assign({}, e), { index: e.buttonIndex });
      } }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10", paramsDeal, resultDeal: function(e) {
        return __assign(__assign({}, e), { index: e.buttonIndex });
      } }, _a)), exports.showActionSheet$ = showActionSheet$, exports.default = showActionSheet$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/showAuthGuide.js
  var require_showAuthGuide2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/showAuthGuide.js"(exports) {
      "use strict";
      function showAuthGuide$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showAuthGuide$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.showAuthGuide";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a)), exports.showAuthGuide$ = showAuthGuide$, exports.default = showAuthGuide$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/showCallMenu.js
  var require_showCallMenu2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/showCallMenu.js"(exports) {
      "use strict";
      function showCallMenu$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showCallMenu$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.telephone.showCallMenu";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.showCallMenu$ = showCallMenu$, exports.default = showCallMenu$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/showLoading.js
  var require_showLoading = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/showLoading.js"(exports) {
      "use strict";
      function showLoading$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, { text: a.content, showIcon: true, success: a.success, fail: a.fail, complete: a.complete });
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, s = 1, d = arguments.length; s < d; s++) {
            e = arguments[s];
            for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (a[o] = e[o]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showLoading$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.showPreloader";
      var paramsDeal = function(a) {
        return __assign({ text: a.content, showIcon: true }, a);
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10" }, _a)), exports.showLoading$ = showLoading$, exports.default = showLoading$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/showModal.js
  var require_showModal = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/showModal.js"(exports) {
      "use strict";
      function showModal$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showModal$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.extendModal";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.showModal$ = showModal$, exports.default = showModal$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/showRecordTabRedDot.js
  var require_showRecordTabRedDot = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/showRecordTabRedDot.js"(exports) {
      "use strict";
      function showRecordTabRedDot$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showRecordTabRedDot$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.minutes.showRecordTabRedDot";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.3.15" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "8.3.15" }, _a)), exports.showRecordTabRedDot$ = showRecordTabRedDot$, exports.default = showRecordTabRedDot$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/showSharePanel.js
  var require_showSharePanel2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/showSharePanel.js"(exports) {
      "use strict";
      function showSharePanel$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showSharePanel$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.showSharePanel";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10" }, _a)), exports.showSharePanel$ = showSharePanel$, exports.default = showSharePanel$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/showToast.js
  var require_showToast = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/showToast.js"(exports) {
      "use strict";
      function showToast$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, { icon: a.type, duration: a.duration ? a.duration / 1e3 : 3, text: a.content, success: a.success, fail: a.fail, complete: a.complete });
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var t, e = 1, s = arguments.length; e < s; e++) {
            t = arguments[e];
            for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (a[o] = t[o]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.showToast$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.notification.toast";
      var paramsDeal = function(a) {
        return __assign({ icon: a.type, duration: a.duration ? a.duration / 1e3 : 3, text: a.content || "toast", delay: 0 }, a);
      };
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10", paramsDeal: function(a) {
        return a.icon && !a.type && ("success" === a.icon ? a.type = "success" : "error" === a.icon && (a.type = "error")), a;
      } }, _a)), exports.showToast$ = showToast$, exports.default = showToast$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/singleSelect.js
  var require_singleSelect = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/singleSelect.js"(exports) {
      "use strict";
      function singleSelect$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.singleSelect$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.chosen";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.singleSelect$ = singleSelect$, exports.default = singleSelect$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/startAdvertising.js
  var require_startAdvertising = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/startAdvertising.js"(exports) {
      "use strict";
      function startAdvertising$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startAdvertising$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.startAdvertising";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.0" }, _a)), exports.startAdvertising$ = startAdvertising$, exports.default = startAdvertising$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/startBeaconDiscovery.js
  var require_startBeaconDiscovery = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/startBeaconDiscovery.js"(exports) {
      "use strict";
      function startBeaconDiscovery$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var a, r = 1, s = arguments.length; r < s; r++) {
            a = arguments[r];
            for (var t in a) Object.prototype.hasOwnProperty.call(a, t) && (e[t] = a[t]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startBeaconDiscovery$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "startBeaconDiscovery";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.startBeaconDiscovery$ = startBeaconDiscovery$, exports.default = startBeaconDiscovery$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/startBluetoothDevicesDiscovery.js
  var require_startBluetoothDevicesDiscovery = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/startBluetoothDevicesDiscovery.js"(exports) {
      "use strict";
      function startBluetoothDevicesDiscovery$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var t, s = 1, r = arguments.length; s < r; s++) {
            t = arguments[s];
            for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startBluetoothDevicesDiscovery$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "startBluetoothDevicesDiscovery";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.startBluetoothDevicesDiscovery$ = startBluetoothDevicesDiscovery$, exports.default = startBluetoothDevicesDiscovery$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/startDingerRecord.js
  var require_startDingerRecord = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/startDingerRecord.js"(exports) {
      "use strict";
      function startDingerRecord$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startDingerRecord$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.dinger.startDingerRecord";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.2.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "8.2.10" }, _a)), exports.startDingerRecord$ = startDingerRecord$, exports.default = startDingerRecord$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/startLocating.js
  var require_startLocating = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/startLocating.js"(exports) {
      "use strict";
      function startLocating$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startLocating$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.geolocation.start";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.startLocating$ = startLocating$, exports.default = startLocating$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/startRecord.js
  var require_startRecord2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/startRecord.js"(exports) {
      "use strict";
      function startRecord$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.startRecord$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.startRecord";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.30" }, _a)), exports.startRecord$ = startRecord$, exports.default = startRecord$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/stopAdvertising.js
  var require_stopAdvertising = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/stopAdvertising.js"(exports) {
      "use strict";
      function stopAdvertising$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopAdvertising$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.stopAdvertising";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.0" }, _a)), exports.stopAdvertising$ = stopAdvertising$, exports.default = stopAdvertising$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/stopAudio.js
  var require_stopAudio = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/stopAudio.js"(exports) {
      "use strict";
      function stopAudio$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopAudio$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.stop";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.stopAudio$ = stopAudio$, exports.default = stopAudio$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/stopBeaconDiscovery.js
  var require_stopBeaconDiscovery = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/stopBeaconDiscovery.js"(exports) {
      "use strict";
      function stopBeaconDiscovery$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var s, o = 1, a = arguments.length; o < a; o++) {
            s = arguments[o];
            for (var r in s) Object.prototype.hasOwnProperty.call(s, r) && (e[r] = s[r]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopBeaconDiscovery$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "stopBeaconDiscovery";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.stopBeaconDiscovery$ = stopBeaconDiscovery$, exports.default = stopBeaconDiscovery$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/stopBluetoothDevicesDiscovery.js
  var require_stopBluetoothDevicesDiscovery = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/stopBluetoothDevicesDiscovery.js"(exports) {
      "use strict";
      function stopBluetoothDevicesDiscovery$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var s, t = 1, o = arguments.length; t < o; t++) {
            s = arguments[t];
            for (var i in s) Object.prototype.hasOwnProperty.call(s, i) && (e[i] = s[i]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopBluetoothDevicesDiscovery$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "stopBluetoothDevicesDiscovery";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.stopBluetoothDevicesDiscovery$ = stopBluetoothDevicesDiscovery$, exports.default = stopBluetoothDevicesDiscovery$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/stopDingerRecord.js
  var require_stopDingerRecord = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/stopDingerRecord.js"(exports) {
      "use strict";
      function stopDingerRecord$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopDingerRecord$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.dinger.stopDingerRecord";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "8.2.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "8.2.10" }, _a)), exports.stopDingerRecord$ = stopDingerRecord$, exports.default = stopDingerRecord$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/stopLocating.js
  var require_stopLocating = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/stopLocating.js"(exports) {
      "use strict";
      function stopLocating$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopLocating$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.geolocation.stop";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.stopLocating$ = stopLocating$, exports.default = stopLocating$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/stopPullDownRefresh.js
  var require_stopPullDownRefresh = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/stopPullDownRefresh.js"(exports) {
      "use strict";
      function stopPullDownRefresh$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopPullDownRefresh$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "ui.pullToRefresh.stop";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.stopPullDownRefresh$ = stopPullDownRefresh$, exports.default = stopPullDownRefresh$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/stopRecord.js
  var require_stopRecord2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/stopRecord.js"(exports) {
      "use strict";
      function stopRecord$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.stopRecord$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.stopRecord";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.30" }, _a)), exports.stopRecord$ = stopRecord$, exports.default = stopRecord$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/subscribe.js
  var require_subscribe2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/subscribe.js"(exports) {
      "use strict";
      function subscribe$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.subscribe$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.notify.subscribe";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.5.35" }, _a)), exports.subscribe$ = subscribe$, exports.default = subscribe$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/timePicker.js
  var require_timePicker = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/timePicker.js"(exports) {
      "use strict";
      function timePicker$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.timePicker$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.timepicker";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.timePicker$ = timePicker$, exports.default = timePicker$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/translate.js
  var require_translate = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/translate.js"(exports) {
      "use strict";
      function translate$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.translate$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.i18n.translate";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.5.35" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.5.35" }, _a)), exports.translate$ = translate$, exports.default = translate$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/translateVoice.js
  var require_translateVoice2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/translateVoice.js"(exports) {
      "use strict";
      function translateVoice$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.translateVoice$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.audio.translateVoice";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.translateVoice$ = translateVoice$, exports.default = translateVoice$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/uploadAttachmentToDingTalk.js
  var require_uploadAttachmentToDingTalk = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/uploadAttachmentToDingTalk.js"(exports) {
      "use strict";
      function uploadAttachmentToDingTalk$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.uploadAttachmentToDingTalk$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.uploadAttachment";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.uploadAttachmentToDingTalk$ = uploadAttachmentToDingTalk$, exports.default = uploadAttachmentToDingTalk$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/uploadFile.js
  var require_uploadFile2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/uploadFile.js"(exports) {
      "use strict";
      function uploadFile$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.uploadFile$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.util.uploadFile";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.0.10" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "7.0.10" }, _a)), exports.uploadFile$ = uploadFile$, exports.default = uploadFile$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/vibrate.js
  var require_vibrate2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/vibrate.js"(exports) {
      "use strict";
      function vibrate$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.vibrate$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "device.notification.vibrate";
      var paramsDeal = apiHelper_1.genDefaultParamsDealFn({ duration: 300 });
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal }, _a)), exports.vibrate$ = vibrate$, exports.default = vibrate$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/watchShake.js
  var require_watchShake2 = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/watchShake.js"(exports) {
      "use strict";
      function watchShake$(a) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, a);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.watchShake$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiHelper_1 = require_apiHelper();
      var actualCallApiName = "device.accelerometer.watchShake";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.0.0", paramsDeal: function(a) {
        return apiHelper_1.forceChangeParamsDealFn({ sensitivity: 3.2 })(apiHelper_1.addWatchParamsDeal(a));
      } }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0", paramsDeal: apiHelper_1.addWatchParamsDeal }, _a)), exports.watchShake$ = watchShake$, exports.default = watchShake$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/writeBLECharacteristicValue.js
  var require_writeBLECharacteristicValue = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/writeBLECharacteristicValue.js"(exports) {
      "use strict";
      function writeBLECharacteristicValue$(e) {
        return ddSdk_1.ddSdk.invokeAPI("runtime.h5nuvabridge.exec", __assign({ _action: apiName }, e));
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(e) {
          for (var a, r = 1, i = arguments.length; r < i; r++) {
            a = arguments[r];
            for (var t in a) Object.prototype.hasOwnProperty.call(a, t) && (e[t] = a[t]);
          }
          return e;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.writeBLECharacteristicValue$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "writeBLECharacteristicValue";
      ddSdk_1.ddSdk.setAPI("runtime.h5nuvabridge.exec", (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "4.6.38" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "4.6.38" }, _a)), exports.writeBLECharacteristicValue$ = writeBLECharacteristicValue$, exports.default = writeBLECharacteristicValue$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/writeBLEPeripheralCharacteristicValue.js
  var require_writeBLEPeripheralCharacteristicValue = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/writeBLEPeripheralCharacteristicValue.js"(exports) {
      "use strict";
      function writeBLEPeripheralCharacteristicValue$(e) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.writeBLEPeripheralCharacteristicValue$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "biz.realm.writeBLEPeripheralCharacteristicValue";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "7.6.10" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "7.6.10" }, _a)), exports.writeBLEPeripheralCharacteristicValue$ = writeBLEPeripheralCharacteristicValue$, exports.default = writeBLEPeripheralCharacteristicValue$;
    }
  });

  // node_modules/dingtalk-jsapi/api/union/writeNFC.js
  var require_writeNFC = __commonJS({
    "node_modules/dingtalk-jsapi/api/union/writeNFC.js"(exports) {
      "use strict";
      function writeNFC$(d) {
        return ddSdk_1.ddSdk.invokeAPI(actualCallApiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.writeNFC$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var actualCallApiName = "device.nfc.nfcWrite";
      ddSdk_1.ddSdk.setAPI(actualCallApiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.0.0" }, _a)), exports.writeNFC$ = writeNFC$, exports.default = writeNFC$;
    }
  });

  // node_modules/dingtalk-jsapi/api/util/domainStorage/getItem.js
  var require_getItem = __commonJS({
    "node_modules/dingtalk-jsapi/api/util/domainStorage/getItem.js"(exports) {
      "use strict";
      function getItem$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, t = 1, s = arguments.length; t < s; t++) {
            e = arguments[t];
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (a[r] = e[r]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getItem$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "util.domainStorage.getItem";
      var paramsDeal = function(a) {
        var e = { name: a.key };
        return __assign(__assign({}, e), a);
      };
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.9.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.9.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.6.29", paramsDeal }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a)), exports.getItem$ = getItem$, exports.default = getItem$;
    }
  });

  // node_modules/dingtalk-jsapi/api/util/domainStorage/getStorageInfo.js
  var require_getStorageInfo = __commonJS({
    "node_modules/dingtalk-jsapi/api/util/domainStorage/getStorageInfo.js"(exports) {
      "use strict";
      function getStorageInfo$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getStorageInfo$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "util.domainStorage.getStorageInfo";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.5.30" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.5.30" }, _a)), exports.getStorageInfo$ = getStorageInfo$, exports.default = getStorageInfo$;
    }
  });

  // node_modules/dingtalk-jsapi/api/util/domainStorage/removeItem.js
  var require_removeItem = __commonJS({
    "node_modules/dingtalk-jsapi/api/util/domainStorage/removeItem.js"(exports) {
      "use strict";
      function removeItem$(e) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, e);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.removeItem$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "util.domainStorage.removeItem";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.9.0" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.9.0" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.6.29" }, _a)), exports.removeItem$ = removeItem$, exports.default = removeItem$;
    }
  });

  // node_modules/dingtalk-jsapi/api/util/domainStorage/setItem.js
  var require_setItem = __commonJS({
    "node_modules/dingtalk-jsapi/api/util/domainStorage/setItem.js"(exports) {
      "use strict";
      function setItem$(a) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, a);
      }
      var __assign = exports && exports.__assign || function() {
        return __assign = Object.assign || function(a) {
          for (var e, s = 1, t = arguments.length; s < t; s++) {
            e = arguments[s];
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (a[r] = e[r]);
          }
          return a;
        }, __assign.apply(this, arguments);
      };
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.setItem$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "util.domainStorage.setItem";
      var paramsDeal = function(a) {
        var e = { name: a.key, value: a.data };
        return __assign(__assign({}, e), a);
      };
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "2.9.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "2.9.0", paramsDeal }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "4.6.9", paramsDeal }, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0", paramsDeal }, _a)), exports.setItem$ = setItem$, exports.default = setItem$;
    }
  });

  // node_modules/dingtalk-jsapi/api/util/openTemporary/getData.js
  var require_getData = __commonJS({
    "node_modules/dingtalk-jsapi/api/util/openTemporary/getData.js"(exports) {
      "use strict";
      function getData$(d) {
        return ddSdk_1.ddSdk.invokeAPI(apiName, d);
      }
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true }), exports.getData$ = void 0;
      var ddSdk_1 = require_ddSdk();
      var apiName = "util.openTemporary.getData";
      ddSdk_1.ddSdk.setAPI(apiName, (_a = {}, _a[ddSdk_1.ENV_ENUM.harmony] = { vs: "7.0.0" }, _a[ddSdk_1.ENV_ENUM.ios] = { vs: "6.3.20" }, _a[ddSdk_1.ENV_ENUM.android] = { vs: "6.3.20" }, _a[ddSdk_1.ENV_ENUM.pc] = { vs: "6.3.30" }, _a)), exports.getData$ = getData$, exports.default = getData$;
    }
  });

  // node_modules/dingtalk-jsapi/api/apiObj.js
  var require_apiObj = __commonJS({
    "node_modules/dingtalk-jsapi/api/apiObj.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.apiObj = void 0;
      var beaconPicker_1 = require_beaconPicker();
      var detectFace_1 = require_detectFace();
      var detectFaceFullScreen_1 = require_detectFaceFullScreen();
      var exclusiveLiveCheck_1 = require_exclusiveLiveCheck();
      var faceManager_1 = require_faceManager();
      var punchModePicker_1 = require_punchModePicker();
      var bindAlipay_1 = require_bindAlipay();
      var openAuth_1 = require_openAuth();
      var pay_1 = require_pay();
      var getLBSWua_1 = require_getLBSWua();
      var openAccountPwdLoginPage_1 = require_openAccountPwdLoginPage();
      var requestAuthInfo_1 = require_requestAuthInfo();
      var chooseDateTime_1 = require_chooseDateTime();
      var chooseHalfDay_1 = require_chooseHalfDay();
      var chooseInterval_1 = require_chooseInterval();
      var chooseOneDay_1 = require_chooseOneDay();
      var chooseConversationByCorpId_1 = require_chooseConversationByCorpId();
      var collectSticker_1 = require_collectSticker();
      var createSceneGroup_1 = require_createSceneGroup();
      var getRealmCid_1 = require_getRealmCid();
      var locationChatMessage_1 = require_locationChatMessage();
      var openSingleChat_1 = require_openSingleChat();
      var pickConversation_1 = require_pickConversation();
      var sendEmotion_1 = require_sendEmotion();
      var toConversation_1 = require_toConversation();
      var toConversationByOpenConversationId_1 = require_toConversationByOpenConversationId();
      var setData_1 = require_setData();
      var createCloudCall_1 = require_createCloudCall();
      var getCloudCallInfo_1 = require_getCloudCallInfo();
      var getCloudCallList_1 = require_getCloudCallList();
      var videoConfCall_1 = require_videoConfCall();
      var choose_1 = require_choose();
      var chooseMobileContacts_1 = require_chooseMobileContacts();
      var complexPicker_1 = require_complexPicker();
      var createGroup_1 = require_createGroup();
      var departmentsPicker_1 = require_departmentsPicker();
      var externalComplexPicker_1 = require_externalComplexPicker();
      var externalEditForm_1 = require_externalEditForm();
      var rolesPicker_1 = require_rolesPicker();
      var setRule_1 = require_setRule();
      var chooseSpaceDir_1 = require_chooseSpaceDir();
      var delete_1 = require_delete();
      var preview_1 = require_preview();
      var previewDentryImages_1 = require_previewDentryImages();
      var saveFile_1 = require_saveFile();
      var choose_2 = require_choose2();
      var multipleChoose_1 = require_multipleChoose();
      var rsa_1 = require_rsa();
      var create_1 = require_create();
      var post_1 = require_post();
      var finishMiniCourseByRecordId_1 = require_finishMiniCourseByRecordId();
      var getMiniCourseDraftList_1 = require_getMiniCourseDraftList();
      var joinClassroom_1 = require_joinClassroom();
      var makeMiniCourse_1 = require_makeMiniCourse();
      var newMsgNotificationStatus_1 = require_newMsgNotificationStatus();
      var startAuth_1 = require_startAuth();
      var tokenFaceImg_1 = require_tokenFaceImg();
      var notifyWeex_1 = require_notifyWeex();
      var downloadFile_1 = require_downloadFile();
      var fetchData_1 = require_fetchData();
      var bind_1 = require_bind();
      var bindMeetingRoom_1 = require_bindMeetingRoom();
      var getDeviceProperties_1 = require_getDeviceProperties();
      var invokeThingService_1 = require_invokeThingService();
      var queryMeetingRoomList_1 = require_queryMeetingRoomList();
      var setDeviceProperties_1 = require_setDeviceProperties();
      var unbind_1 = require_unbind();
      var startClassRoom_1 = require_startClassRoom();
      var startUnifiedLive_1 = require_startUnifiedLive();
      var locate_1 = require_locate();
      var search_1 = require_search();
      var view_1 = require_view();
      var compressVideo_1 = require_compressVideo();
      var openApp_1 = require_openApp();
      var close_1 = require_close();
      var goBack_1 = require_goBack();
      var hideBar_1 = require_hideBar();
      var navigateBackPage_1 = require_navigateBackPage();
      var navigateToMiniProgram_1 = require_navigateToMiniProgram();
      var navigateToPage_1 = require_navigateToPage();
      var quit_1 = require_quit();
      var replace_1 = require_replace();
      var setIcon_1 = require_setIcon();
      var setLeft_1 = require_setLeft();
      var setMenu_1 = require_setMenu();
      var setRight_1 = require_setRight();
      var setTitle_1 = require_setTitle();
      var componentPunchFromPartner_1 = require_componentPunchFromPartner();
      var startMatchRuleFromPartner_1 = require_startMatchRuleFromPartner();
      var stopMatchRuleFromPartner_1 = require_stopMatchRuleFromPartner();
      var add_1 = require_add();
      var getRealtimeTracingStatus_1 = require_getRealtimeTracingStatus();
      var getUserExclusiveInfo_1 = require_getUserExclusiveInfo();
      var startRealtimeTracing_1 = require_startRealtimeTracing();
      var stopRealtimeTracing_1 = require_stopRealtimeTracing();
      var subscribe_1 = require_subscribe();
      var unsubscribe_1 = require_unsubscribe();
      var getInfo_1 = require_getInfo();
      var reportDebugMessage_1 = require_reportDebugMessage();
      var addShortCut_1 = require_addShortCut();
      var getHealthAuthorizationStatus_1 = require_getHealthAuthorizationStatus();
      var getHealthData_1 = require_getHealthData();
      var getHealthDeviceData_1 = require_getHealthDeviceData();
      var requestHealthAuthorization_1 = require_requestHealthAuthorization();
      var closeUnpayOrder_1 = require_closeUnpayOrder();
      var createOrder_1 = require_createOrder();
      var getPayUrl_1 = require_getPayUrl();
      var inquiry_1 = require_inquiry();
      var isTab_1 = require_isTab();
      var call_1 = require_call();
      var checkBizCall_1 = require_checkBizCall();
      var quickCallList_1 = require_quickCallList();
      var showCallMenu_1 = require_showCallMenu();
      var checkPassword_1 = require_checkPassword();
      var get_1 = require_get();
      var callComponent_1 = require_callComponent();
      var checkAuth_1 = require_checkAuth();
      var chooseImage_1 = require_chooseImage();
      var chooseRegion_1 = require_chooseRegion();
      var chosen_1 = require_chosen();
      var clearWebStoreCache_1 = require_clearWebStoreCache();
      var closePreviewImage_1 = require_closePreviewImage();
      var compressImage_1 = require_compressImage();
      var datepicker_1 = require_datepicker();
      var datetimepicker_1 = require_datetimepicker();
      var decrypt_1 = require_decrypt();
      var downloadFile_2 = require_downloadFile2();
      var encrypt_1 = require_encrypt();
      var getPerfInfo_1 = require_getPerfInfo();
      var invokeWorkbench_1 = require_invokeWorkbench();
      var isEnableGPUAcceleration_1 = require_isEnableGPUAcceleration();
      var isLocalFileExist_1 = require_isLocalFileExist();
      var multiSelect_1 = require_multiSelect();
      var open_1 = require_open();
      var openBrowser_1 = require_openBrowser();
      var openDocument_1 = require_openDocument();
      var openLink_1 = require_openLink();
      var openLocalFile_1 = require_openLocalFile();
      var openModal_1 = require_openModal();
      var openSlidePanel_1 = require_openSlidePanel();
      var presentWindow_1 = require_presentWindow();
      var previewImage_1 = require_previewImage();
      var previewVideo_1 = require_previewVideo();
      var saveImage_1 = require_saveImage();
      var saveImageToPhotosAlbum_1 = require_saveImageToPhotosAlbum();
      var scan_1 = require_scan();
      var scanCard_1 = require_scanCard();
      var setGPUAcceleration_1 = require_setGPUAcceleration();
      var setScreenBrightnessAndKeepOn_1 = require_setScreenBrightnessAndKeepOn();
      var setScreenKeepOn_1 = require_setScreenKeepOn();
      var share_1 = require_share();
      var shareImage_1 = require_shareImage();
      var showAuthGuide_1 = require_showAuthGuide();
      var showSharePanel_1 = require_showSharePanel();
      var startDocSign_1 = require_startDocSign();
      var systemShare_1 = require_systemShare();
      var timepicker_1 = require_timepicker();
      var uploadAttachment_1 = require_uploadAttachment();
      var uploadFile_1 = require_uploadFile();
      var uploadImage_1 = require_uploadImage();
      var uploadImageFromCamera_1 = require_uploadImageFromCamera();
      var ut_1 = require_ut();
      var openBindIDCard_1 = require_openBindIDCard();
      var startAuth_2 = require_startAuth2();
      var makeCall_1 = require_makeCall();
      var getWatermarkInfo_1 = require_getWatermarkInfo();
      var setWatermarkInfo_1 = require_setWatermarkInfo();
      var requestAuthCode_1 = require_requestAuthCode();
      var clearShake_1 = require_clearShake();
      var watchShake_1 = require_watchShake();
      var download_1 = require_download();
      var onPlayEnd_1 = require_onPlayEnd();
      var onRecordEnd_1 = require_onRecordEnd();
      var pause_1 = require_pause();
      var play_1 = require_play();
      var resume_1 = require_resume();
      var startRecord_1 = require_startRecord();
      var stop_1 = require_stop();
      var stopRecord_1 = require_stopRecord();
      var translateVoice_1 = require_translateVoice();
      var getBatteryInfo_1 = require_getBatteryInfo();
      var getInterface_1 = require_getInterface();
      var getPhoneInfo_1 = require_getPhoneInfo();
      var getScanWifiListAsync_1 = require_getScanWifiListAsync();
      var getUUID_1 = require_getUUID();
      var getWifiStatus_1 = require_getWifiStatus();
      var openSystemSetting_1 = require_openSystemSetting();
      var getNetworkType_1 = require_getNetworkType();
      var checkPermission_1 = require_checkPermission();
      var get_2 = require_get2();
      var start_1 = require_start();
      var status_1 = require_status();
      var stop_2 = require_stop2();
      var checkInstalledApps_1 = require_checkInstalledApps();
      var launchApp_1 = require_launchApp();
      var nfcRead_1 = require_nfcRead();
      var nfcStop_1 = require_nfcStop();
      var nfcWrite_1 = require_nfcWrite();
      var actionSheet_1 = require_actionSheet();
      var alert_1 = require_alert();
      var confirm_1 = require_confirm();
      var extendModal_1 = require_extendModal();
      var hidePreloader_1 = require_hidePreloader();
      var modal_1 = require_modal();
      var prompt_1 = require_prompt();
      var showPreloader_1 = require_showPreloader();
      var toast_1 = require_toast();
      var vibrate_1 = require_vibrate();
      var getScreenBrightness_1 = require_getScreenBrightness();
      var insetAdjust_1 = require_insetAdjust();
      var isScreenReaderEnabled_1 = require_isScreenReaderEnabled();
      var resetView_1 = require_resetView();
      var rotateView_1 = require_rotateView();
      var setScreenBrightness_1 = require_setScreenBrightness();
      var keepAlive_1 = require_keepAlive();
      var pause_2 = require_pause2();
      var resume_2 = require_resume2();
      var start_2 = require_start2();
      var stop_3 = require_stop3();
      var loginGovNet_1 = require_loginGovNet();
      var exec_1 = require_exec();
      var fetch_1 = require_fetch();
      var post_2 = require_post2();
      var getLoadTime_1 = require_getLoadTime();
      var requestAuthCode_2 = require_requestAuthCode2();
      var requestOperateAuthCode_1 = require_requestOperateAuthCode();
      var plain_1 = require_plain();
      var addToFloat_1 = require_addToFloat();
      var removeFromFloat_1 = require_removeFromFloat();
      var close_2 = require_close2();
      var getCurrentId_1 = require_getCurrentId();
      var go_1 = require_go();
      var preload_1 = require_preload();
      var recycle_1 = require_recycle();
      var setColors_1 = require_setColors();
      var disable_1 = require_disable();
      var enable_1 = require_enable();
      var stop_4 = require_stop4();
      var disable_2 = require_disable2();
      var enable_2 = require_enable2();
      var ExternalChannelPublish_1 = require_ExternalChannelPublish();
      var ExternalChannelPublish_2 = require_ExternalChannelPublish();
      Object.defineProperty(exports, "ExternalChannelPublish", { enumerable: true, get: function() {
        return ExternalChannelPublish_2.ExternalChannelPublish$;
      } });
      var addPhoneContact_1 = require_addPhoneContact();
      var addPhoneContact_2 = require_addPhoneContact();
      Object.defineProperty(exports, "addPhoneContact", { enumerable: true, get: function() {
        return addPhoneContact_2.addPhoneContact$;
      } });
      var alert_2 = require_alert2();
      var alert_3 = require_alert2();
      Object.defineProperty(exports, "alert", { enumerable: true, get: function() {
        return alert_3.alert$;
      } });
      var callUsers_1 = require_callUsers();
      var callUsers_2 = require_callUsers();
      Object.defineProperty(exports, "callUsers", { enumerable: true, get: function() {
        return callUsers_2.callUsers$;
      } });
      var checkAuth_2 = require_checkAuth2();
      var checkAuth_3 = require_checkAuth2();
      Object.defineProperty(exports, "checkAuth", { enumerable: true, get: function() {
        return checkAuth_3.checkAuth$;
      } });
      var checkBizCall_2 = require_checkBizCall2();
      var checkBizCall_3 = require_checkBizCall2();
      Object.defineProperty(exports, "checkBizCall", { enumerable: true, get: function() {
        return checkBizCall_3.checkBizCall$;
      } });
      var chooseChat_1 = require_chooseChat();
      var chooseChat_2 = require_chooseChat();
      Object.defineProperty(exports, "chooseChat", { enumerable: true, get: function() {
        return chooseChat_2.chooseChat$;
      } });
      var chooseConversation_1 = require_chooseConversation();
      var chooseConversation_2 = require_chooseConversation();
      Object.defineProperty(exports, "chooseConversation", { enumerable: true, get: function() {
        return chooseConversation_2.chooseConversation$;
      } });
      var chooseDateRangeInCalendar_1 = require_chooseDateRangeInCalendar();
      var chooseDateRangeInCalendar_2 = require_chooseDateRangeInCalendar();
      Object.defineProperty(exports, "chooseDateRangeInCalendar", { enumerable: true, get: function() {
        return chooseDateRangeInCalendar_2.chooseDateRangeInCalendar$;
      } });
      var chooseDateTime_2 = require_chooseDateTime2();
      var chooseDateTime_3 = require_chooseDateTime2();
      Object.defineProperty(exports, "chooseDateTime", { enumerable: true, get: function() {
        return chooseDateTime_3.chooseDateTime$;
      } });
      var chooseDepartments_1 = require_chooseDepartments();
      var chooseDepartments_2 = require_chooseDepartments();
      Object.defineProperty(exports, "chooseDepartments", { enumerable: true, get: function() {
        return chooseDepartments_2.chooseDepartments$;
      } });
      var chooseDingTalkDir_1 = require_chooseDingTalkDir();
      var chooseDingTalkDir_2 = require_chooseDingTalkDir();
      Object.defineProperty(exports, "chooseDingTalkDir", { enumerable: true, get: function() {
        return chooseDingTalkDir_2.chooseDingTalkDir$;
      } });
      var chooseDistrict_1 = require_chooseDistrict();
      var chooseDistrict_2 = require_chooseDistrict();
      Object.defineProperty(exports, "chooseDistrict", { enumerable: true, get: function() {
        return chooseDistrict_2.chooseDistrict$;
      } });
      var chooseExternalUsers_1 = require_chooseExternalUsers();
      var chooseExternalUsers_2 = require_chooseExternalUsers();
      Object.defineProperty(exports, "chooseExternalUsers", { enumerable: true, get: function() {
        return chooseExternalUsers_2.chooseExternalUsers$;
      } });
      var chooseFile_1 = require_chooseFile();
      var chooseFile_2 = require_chooseFile();
      Object.defineProperty(exports, "chooseFile", { enumerable: true, get: function() {
        return chooseFile_2.chooseFile$;
      } });
      var chooseHalfDayInCalendar_1 = require_chooseHalfDayInCalendar();
      var chooseHalfDayInCalendar_2 = require_chooseHalfDayInCalendar();
      Object.defineProperty(exports, "chooseHalfDayInCalendar", { enumerable: true, get: function() {
        return chooseHalfDayInCalendar_2.chooseHalfDayInCalendar$;
      } });
      var chooseImage_2 = require_chooseImage2();
      var chooseImage_3 = require_chooseImage2();
      Object.defineProperty(exports, "chooseImage", { enumerable: true, get: function() {
        return chooseImage_3.chooseImage$;
      } });
      var chooseMedia_1 = require_chooseMedia();
      var chooseMedia_2 = require_chooseMedia();
      Object.defineProperty(exports, "chooseMedia", { enumerable: true, get: function() {
        return chooseMedia_2.chooseMedia$;
      } });
      var chooseOneDayInCalendar_1 = require_chooseOneDayInCalendar();
      var chooseOneDayInCalendar_2 = require_chooseOneDayInCalendar();
      Object.defineProperty(exports, "chooseOneDayInCalendar", { enumerable: true, get: function() {
        return chooseOneDayInCalendar_2.chooseOneDayInCalendar$;
      } });
      var chooseOrg_1 = require_chooseOrg();
      var chooseOrg_2 = require_chooseOrg();
      Object.defineProperty(exports, "chooseOrg", { enumerable: true, get: function() {
        return chooseOrg_2.chooseOrg$;
      } });
      var choosePhonebook_1 = require_choosePhonebook();
      var choosePhonebook_2 = require_choosePhonebook();
      Object.defineProperty(exports, "choosePhonebook", { enumerable: true, get: function() {
        return choosePhonebook_2.choosePhonebook$;
      } });
      var chooseStaffForPC_1 = require_chooseStaffForPC();
      var chooseStaffForPC_2 = require_chooseStaffForPC();
      Object.defineProperty(exports, "chooseStaffForPC", { enumerable: true, get: function() {
        return chooseStaffForPC_2.chooseStaffForPC$;
      } });
      var chooseUserFromList_1 = require_chooseUserFromList();
      var chooseUserFromList_2 = require_chooseUserFromList();
      Object.defineProperty(exports, "chooseUserFromList", { enumerable: true, get: function() {
        return chooseUserFromList_2.chooseUserFromList$;
      } });
      var clearShake_2 = require_clearShake2();
      var clearShake_3 = require_clearShake2();
      Object.defineProperty(exports, "clearShake", { enumerable: true, get: function() {
        return clearShake_3.clearShake$;
      } });
      var closeBluetoothAdapter_1 = require_closeBluetoothAdapter();
      var closeBluetoothAdapter_2 = require_closeBluetoothAdapter();
      Object.defineProperty(exports, "closeBluetoothAdapter", { enumerable: true, get: function() {
        return closeBluetoothAdapter_2.closeBluetoothAdapter$;
      } });
      var closePage_1 = require_closePage();
      var closePage_2 = require_closePage();
      Object.defineProperty(exports, "closePage", { enumerable: true, get: function() {
        return closePage_2.closePage$;
      } });
      var complexChoose_1 = require_complexChoose();
      var complexChoose_2 = require_complexChoose();
      Object.defineProperty(exports, "complexChoose", { enumerable: true, get: function() {
        return complexChoose_2.complexChoose$;
      } });
      var compressImage_2 = require_compressImage2();
      var compressImage_3 = require_compressImage2();
      Object.defineProperty(exports, "compressImage", { enumerable: true, get: function() {
        return compressImage_3.compressImage$;
      } });
      var confirm_2 = require_confirm2();
      var confirm_3 = require_confirm2();
      Object.defineProperty(exports, "confirm", { enumerable: true, get: function() {
        return confirm_3.confirm$;
      } });
      var connectBLEDevice_1 = require_connectBLEDevice();
      var connectBLEDevice_2 = require_connectBLEDevice();
      Object.defineProperty(exports, "connectBLEDevice", { enumerable: true, get: function() {
        return connectBLEDevice_2.connectBLEDevice$;
      } });
      var createBLEPeripheralServer_1 = require_createBLEPeripheralServer();
      var createBLEPeripheralServer_2 = require_createBLEPeripheralServer();
      Object.defineProperty(exports, "createBLEPeripheralServer", { enumerable: true, get: function() {
        return createBLEPeripheralServer_2.createBLEPeripheralServer$;
      } });
      var createDing_1 = require_createDing();
      var createDing_2 = require_createDing();
      Object.defineProperty(exports, "createDing", { enumerable: true, get: function() {
        return createDing_2.createDing$;
      } });
      var createDingForPC_1 = require_createDingForPC();
      var createDingForPC_2 = require_createDingForPC();
      Object.defineProperty(exports, "createDingForPC", { enumerable: true, get: function() {
        return createDingForPC_2.createDingForPC$;
      } });
      var createGroupChat_1 = require_createGroupChat();
      var createGroupChat_2 = require_createGroupChat();
      Object.defineProperty(exports, "createGroupChat", { enumerable: true, get: function() {
        return createGroupChat_2.createGroupChat$;
      } });
      var createLiveClassRoom_1 = require_createLiveClassRoom();
      var createLiveClassRoom_2 = require_createLiveClassRoom();
      Object.defineProperty(exports, "createLiveClassRoom", { enumerable: true, get: function() {
        return createLiveClassRoom_2.createLiveClassRoom$;
      } });
      var createPayOrder_1 = require_createPayOrder();
      var createPayOrder_2 = require_createPayOrder();
      Object.defineProperty(exports, "createPayOrder", { enumerable: true, get: function() {
        return createPayOrder_2.createPayOrder$;
      } });
      var cropImage_1 = require_cropImage();
      var cropImage_2 = require_cropImage();
      Object.defineProperty(exports, "cropImage", { enumerable: true, get: function() {
        return cropImage_2.cropImage$;
      } });
      var customChooseUsers_1 = require_customChooseUsers();
      var customChooseUsers_2 = require_customChooseUsers();
      Object.defineProperty(exports, "customChooseUsers", { enumerable: true, get: function() {
        return customChooseUsers_2.customChooseUsers$;
      } });
      var datePicker_1 = require_datePicker();
      var datePicker_2 = require_datePicker();
      Object.defineProperty(exports, "datePicker", { enumerable: true, get: function() {
        return datePicker_2.datePicker$;
      } });
      var dateRangePicker_1 = require_dateRangePicker();
      var dateRangePicker_2 = require_dateRangePicker();
      Object.defineProperty(exports, "dateRangePicker", { enumerable: true, get: function() {
        return dateRangePicker_2.dateRangePicker$;
      } });
      var decrypt_2 = require_decrypt2();
      var decrypt_3 = require_decrypt2();
      Object.defineProperty(exports, "decrypt", { enumerable: true, get: function() {
        return decrypt_3.decrypt$;
      } });
      var disablePullDownRefresh_1 = require_disablePullDownRefresh();
      var disablePullDownRefresh_2 = require_disablePullDownRefresh();
      Object.defineProperty(exports, "disablePullDownRefresh", { enumerable: true, get: function() {
        return disablePullDownRefresh_2.disablePullDownRefresh$;
      } });
      var disableWebViewBounce_1 = require_disableWebViewBounce();
      var disableWebViewBounce_2 = require_disableWebViewBounce();
      Object.defineProperty(exports, "disableWebViewBounce", { enumerable: true, get: function() {
        return disableWebViewBounce_2.disableWebViewBounce$;
      } });
      var disconnectBLEDevice_1 = require_disconnectBLEDevice();
      var disconnectBLEDevice_2 = require_disconnectBLEDevice();
      Object.defineProperty(exports, "disconnectBLEDevice", { enumerable: true, get: function() {
        return disconnectBLEDevice_2.disconnectBLEDevice$;
      } });
      var downloadAudio_1 = require_downloadAudio();
      var downloadAudio_2 = require_downloadAudio();
      Object.defineProperty(exports, "downloadAudio", { enumerable: true, get: function() {
        return downloadAudio_2.downloadAudio$;
      } });
      var downloadFile_3 = require_downloadFile3();
      var downloadFile_4 = require_downloadFile3();
      Object.defineProperty(exports, "downloadFile", { enumerable: true, get: function() {
        return downloadFile_4.downloadFile$;
      } });
      var editExternalUser_1 = require_editExternalUser();
      var editExternalUser_2 = require_editExternalUser();
      Object.defineProperty(exports, "editExternalUser", { enumerable: true, get: function() {
        return editExternalUser_2.editExternalUser$;
      } });
      var editPicture_1 = require_editPicture();
      var editPicture_2 = require_editPicture();
      Object.defineProperty(exports, "editPicture", { enumerable: true, get: function() {
        return editPicture_2.editPicture$;
      } });
      var enablePullDownRefresh_1 = require_enablePullDownRefresh();
      var enablePullDownRefresh_2 = require_enablePullDownRefresh();
      Object.defineProperty(exports, "enablePullDownRefresh", { enumerable: true, get: function() {
        return enablePullDownRefresh_2.enablePullDownRefresh$;
      } });
      var enableWebViewBounce_1 = require_enableWebViewBounce();
      var enableWebViewBounce_2 = require_enableWebViewBounce();
      Object.defineProperty(exports, "enableWebViewBounce", { enumerable: true, get: function() {
        return enableWebViewBounce_2.enableWebViewBounce$;
      } });
      var encrypt_2 = require_encrypt2();
      var encrypt_3 = require_encrypt2();
      Object.defineProperty(exports, "encrypt", { enumerable: true, get: function() {
        return encrypt_3.encrypt$;
      } });
      var exclusiveLiveCheck_2 = require_exclusiveLiveCheck2();
      var exclusiveLiveCheck_3 = require_exclusiveLiveCheck2();
      Object.defineProperty(exports, "exclusiveLiveCheck", { enumerable: true, get: function() {
        return exclusiveLiveCheck_3.exclusiveLiveCheck$;
      } });
      var generateImageFromCode_1 = require_generateImageFromCode();
      var generateImageFromCode_2 = require_generateImageFromCode();
      Object.defineProperty(exports, "generateImageFromCode", { enumerable: true, get: function() {
        return generateImageFromCode_2.generateImageFromCode$;
      } });
      var getAccountType_1 = require_getAccountType();
      var getAccountType_2 = require_getAccountType();
      Object.defineProperty(exports, "getAccountType", { enumerable: true, get: function() {
        return getAccountType_2.getAccountType$;
      } });
      var getActiveConferenceInfo_1 = require_getActiveConferenceInfo();
      var getActiveConferenceInfo_2 = require_getActiveConferenceInfo();
      Object.defineProperty(exports, "getActiveConferenceInfo", { enumerable: true, get: function() {
        return getActiveConferenceInfo_2.getActiveConferenceInfo$;
      } });
      var getAdvertisingStatus_1 = require_getAdvertisingStatus();
      var getAdvertisingStatus_2 = require_getAdvertisingStatus();
      Object.defineProperty(exports, "getAdvertisingStatus", { enumerable: true, get: function() {
        return getAdvertisingStatus_2.getAdvertisingStatus$;
      } });
      var getAuthCode_1 = require_getAuthCode();
      var getAuthCode_2 = require_getAuthCode();
      Object.defineProperty(exports, "getAuthCode", { enumerable: true, get: function() {
        return getAuthCode_2.getAuthCode$;
      } });
      var getAuthCodeV2_1 = require_getAuthCodeV2();
      var getAuthCodeV2_2 = require_getAuthCodeV2();
      Object.defineProperty(exports, "getAuthCodeV2", { enumerable: true, get: function() {
        return getAuthCodeV2_2.getAuthCodeV2$;
      } });
      var getAuthInfo_1 = require_getAuthInfo();
      var getAuthInfo_2 = require_getAuthInfo();
      Object.defineProperty(exports, "getAuthInfo", { enumerable: true, get: function() {
        return getAuthInfo_2.getAuthInfo$;
      } });
      var getBLEDeviceCharacteristics_1 = require_getBLEDeviceCharacteristics();
      var getBLEDeviceCharacteristics_2 = require_getBLEDeviceCharacteristics();
      Object.defineProperty(exports, "getBLEDeviceCharacteristics", { enumerable: true, get: function() {
        return getBLEDeviceCharacteristics_2.getBLEDeviceCharacteristics$;
      } });
      var getBLEDeviceServices_1 = require_getBLEDeviceServices();
      var getBLEDeviceServices_2 = require_getBLEDeviceServices();
      Object.defineProperty(exports, "getBLEDeviceServices", { enumerable: true, get: function() {
        return getBLEDeviceServices_2.getBLEDeviceServices$;
      } });
      var getBatteryInfo_2 = require_getBatteryInfo2();
      var getBatteryInfo_3 = require_getBatteryInfo2();
      Object.defineProperty(exports, "getBatteryInfo", { enumerable: true, get: function() {
        return getBatteryInfo_3.getBatteryInfo$;
      } });
      var getBeacons_1 = require_getBeacons();
      var getBeacons_2 = require_getBeacons();
      Object.defineProperty(exports, "getBeacons", { enumerable: true, get: function() {
        return getBeacons_2.getBeacons$;
      } });
      var getBluetoothAdapterState_1 = require_getBluetoothAdapterState();
      var getBluetoothAdapterState_2 = require_getBluetoothAdapterState();
      Object.defineProperty(exports, "getBluetoothAdapterState", { enumerable: true, get: function() {
        return getBluetoothAdapterState_2.getBluetoothAdapterState$;
      } });
      var getBluetoothDevices_1 = require_getBluetoothDevices();
      var getBluetoothDevices_2 = require_getBluetoothDevices();
      Object.defineProperty(exports, "getBluetoothDevices", { enumerable: true, get: function() {
        return getBluetoothDevices_2.getBluetoothDevices$;
      } });
      var getCachedAPIResponse_1 = require_getCachedAPIResponse();
      var getCachedAPIResponse_2 = require_getCachedAPIResponse();
      Object.defineProperty(exports, "getCachedAPIResponse", { enumerable: true, get: function() {
        return getCachedAPIResponse_2.getCachedAPIResponse$;
      } });
      var getCloudCallInfo_2 = require_getCloudCallInfo2();
      var getCloudCallInfo_3 = require_getCloudCallInfo2();
      Object.defineProperty(exports, "getCloudCallInfo", { enumerable: true, get: function() {
        return getCloudCallInfo_3.getCloudCallInfo$;
      } });
      var getCloudCallList_2 = require_getCloudCallList2();
      var getCloudCallList_3 = require_getCloudCallList2();
      Object.defineProperty(exports, "getCloudCallList", { enumerable: true, get: function() {
        return getCloudCallList_3.getCloudCallList$;
      } });
      var getCurrentCorpId_1 = require_getCurrentCorpId();
      var getCurrentCorpId_2 = require_getCurrentCorpId();
      Object.defineProperty(exports, "getCurrentCorpId", { enumerable: true, get: function() {
        return getCurrentCorpId_2.getCurrentCorpId$;
      } });
      var getDeviceId_1 = require_getDeviceId();
      var getDeviceId_2 = require_getDeviceId();
      Object.defineProperty(exports, "getDeviceId", { enumerable: true, get: function() {
        return getDeviceId_2.getDeviceId$;
      } });
      var getDeviceUUID_1 = require_getDeviceUUID();
      var getDeviceUUID_2 = require_getDeviceUUID();
      Object.defineProperty(exports, "getDeviceUUID", { enumerable: true, get: function() {
        return getDeviceUUID_2.getDeviceUUID$;
      } });
      var getDingerDeviceStatus_1 = require_getDingerDeviceStatus();
      var getDingerDeviceStatus_2 = require_getDingerDeviceStatus();
      Object.defineProperty(exports, "getDingerDeviceStatus", { enumerable: true, get: function() {
        return getDingerDeviceStatus_2.getDingerDeviceStatus$;
      } });
      var getImageInfo_1 = require_getImageInfo();
      var getImageInfo_2 = require_getImageInfo();
      Object.defineProperty(exports, "getImageInfo", { enumerable: true, get: function() {
        return getImageInfo_2.getImageInfo$;
      } });
      var getLocatingStatus_1 = require_getLocatingStatus();
      var getLocatingStatus_2 = require_getLocatingStatus();
      Object.defineProperty(exports, "getLocatingStatus", { enumerable: true, get: function() {
        return getLocatingStatus_2.getLocatingStatus$;
      } });
      var getLocation_1 = require_getLocation();
      var getLocation_2 = require_getLocation();
      Object.defineProperty(exports, "getLocation", { enumerable: true, get: function() {
        return getLocation_2.getLocation$;
      } });
      var getNetworkType_2 = require_getNetworkType2();
      var getNetworkType_3 = require_getNetworkType2();
      Object.defineProperty(exports, "getNetworkType", { enumerable: true, get: function() {
        return getNetworkType_3.getNetworkType$;
      } });
      var getOperateAuthCode_1 = require_getOperateAuthCode();
      var getOperateAuthCode_2 = require_getOperateAuthCode();
      Object.defineProperty(exports, "getOperateAuthCode", { enumerable: true, get: function() {
        return getOperateAuthCode_2.getOperateAuthCode$;
      } });
      var getPageTerminateInfo_1 = require_getPageTerminateInfo();
      var getPageTerminateInfo_2 = require_getPageTerminateInfo();
      Object.defineProperty(exports, "getPageTerminateInfo", { enumerable: true, get: function() {
        return getPageTerminateInfo_2.getPageTerminateInfo$;
      } });
      var getPersonalWorkInfo_1 = require_getPersonalWorkInfo();
      var getPersonalWorkInfo_2 = require_getPersonalWorkInfo();
      Object.defineProperty(exports, "getPersonalWorkInfo", { enumerable: true, get: function() {
        return getPersonalWorkInfo_2.getPersonalWorkInfo$;
      } });
      var getScreenBrightness_2 = require_getScreenBrightness2();
      var getScreenBrightness_3 = require_getScreenBrightness2();
      Object.defineProperty(exports, "getScreenBrightness", { enumerable: true, get: function() {
        return getScreenBrightness_3.getScreenBrightness$;
      } });
      var getStorage_1 = require_getStorage();
      var getStorage_2 = require_getStorage();
      Object.defineProperty(exports, "getStorage", { enumerable: true, get: function() {
        return getStorage_2.getStorage$;
      } });
      var getSystemInfo_1 = require_getSystemInfo();
      var getSystemInfo_2 = require_getSystemInfo();
      Object.defineProperty(exports, "getSystemInfo", { enumerable: true, get: function() {
        return getSystemInfo_2.getSystemInfo$;
      } });
      var getSystemSettings_1 = require_getSystemSettings();
      var getSystemSettings_2 = require_getSystemSettings();
      Object.defineProperty(exports, "getSystemSettings", { enumerable: true, get: function() {
        return getSystemSettings_2.getSystemSettings$;
      } });
      var getThirdAppConfCustomData_1 = require_getThirdAppConfCustomData();
      var getThirdAppConfCustomData_2 = require_getThirdAppConfCustomData();
      Object.defineProperty(exports, "getThirdAppConfCustomData", { enumerable: true, get: function() {
        return getThirdAppConfCustomData_2.getThirdAppConfCustomData$;
      } });
      var getThirdAppUserCustomData_1 = require_getThirdAppUserCustomData();
      var getThirdAppUserCustomData_2 = require_getThirdAppUserCustomData();
      Object.defineProperty(exports, "getThirdAppUserCustomData", { enumerable: true, get: function() {
        return getThirdAppUserCustomData_2.getThirdAppUserCustomData$;
      } });
      var getTodaysStepCount_1 = require_getTodaysStepCount();
      var getTodaysStepCount_2 = require_getTodaysStepCount();
      Object.defineProperty(exports, "getTodaysStepCount", { enumerable: true, get: function() {
        return getTodaysStepCount_2.getTodaysStepCount$;
      } });
      var getTranslateStatus_1 = require_getTranslateStatus();
      var getTranslateStatus_2 = require_getTranslateStatus();
      Object.defineProperty(exports, "getTranslateStatus", { enumerable: true, get: function() {
        return getTranslateStatus_2.getTranslateStatus$;
      } });
      var getUserExclusiveInfo_2 = require_getUserExclusiveInfo2();
      var getUserExclusiveInfo_3 = require_getUserExclusiveInfo2();
      Object.defineProperty(exports, "getUserExclusiveInfo", { enumerable: true, get: function() {
        return getUserExclusiveInfo_3.getUserExclusiveInfo$;
      } });
      var getWifiHotspotStatus_1 = require_getWifiHotspotStatus();
      var getWifiHotspotStatus_2 = require_getWifiHotspotStatus();
      Object.defineProperty(exports, "getWifiHotspotStatus", { enumerable: true, get: function() {
        return getWifiHotspotStatus_2.getWifiHotspotStatus$;
      } });
      var getWifiStatus_2 = require_getWifiStatus2();
      var getWifiStatus_3 = require_getWifiStatus2();
      Object.defineProperty(exports, "getWifiStatus", { enumerable: true, get: function() {
        return getWifiStatus_3.getWifiStatus$;
      } });
      var goBackPage_1 = require_goBackPage();
      var goBackPage_2 = require_goBackPage();
      Object.defineProperty(exports, "goBackPage", { enumerable: true, get: function() {
        return goBackPage_2.goBackPage$;
      } });
      var hideLoading_1 = require_hideLoading();
      var hideLoading_2 = require_hideLoading();
      Object.defineProperty(exports, "hideLoading", { enumerable: true, get: function() {
        return hideLoading_2.hideLoading$;
      } });
      var hideToast_1 = require_hideToast();
      var hideToast_2 = require_hideToast();
      Object.defineProperty(exports, "hideToast", { enumerable: true, get: function() {
        return hideToast_2.hideToast$;
      } });
      var isInTabWindow_1 = require_isInTabWindow();
      var isInTabWindow_2 = require_isInTabWindow();
      Object.defineProperty(exports, "isInTabWindow", { enumerable: true, get: function() {
        return isInTabWindow_2.isInTabWindow$;
      } });
      var isLocalFileExist_2 = require_isLocalFileExist2();
      var isLocalFileExist_3 = require_isLocalFileExist2();
      Object.defineProperty(exports, "isLocalFileExist", { enumerable: true, get: function() {
        return isLocalFileExist_3.isLocalFileExist$;
      } });
      var isScreenReaderEnabled_2 = require_isScreenReaderEnabled2();
      var isScreenReaderEnabled_3 = require_isScreenReaderEnabled2();
      Object.defineProperty(exports, "isScreenReaderEnabled", { enumerable: true, get: function() {
        return isScreenReaderEnabled_3.isScreenReaderEnabled$;
      } });
      var locateInMap_1 = require_locateInMap();
      var locateInMap_2 = require_locateInMap();
      Object.defineProperty(exports, "locateInMap", { enumerable: true, get: function() {
        return locateInMap_2.locateInMap$;
      } });
      var makeCloudCall_1 = require_makeCloudCall();
      var makeCloudCall_2 = require_makeCloudCall();
      Object.defineProperty(exports, "makeCloudCall", { enumerable: true, get: function() {
        return makeCloudCall_2.makeCloudCall$;
      } });
      var makeVideoConfCall_1 = require_makeVideoConfCall();
      var makeVideoConfCall_2 = require_makeVideoConfCall();
      Object.defineProperty(exports, "makeVideoConfCall", { enumerable: true, get: function() {
        return makeVideoConfCall_2.makeVideoConfCall$;
      } });
      var minutesCreateFromVideo_1 = require_minutesCreateFromVideo();
      var minutesCreateFromVideo_2 = require_minutesCreateFromVideo();
      Object.defineProperty(exports, "minutesCreateFromVideo", { enumerable: true, get: function() {
        return minutesCreateFromVideo_2.minutesCreateFromVideo$;
      } });
      var minutesStart_1 = require_minutesStart();
      var minutesStart_2 = require_minutesStart();
      Object.defineProperty(exports, "minutesStart", { enumerable: true, get: function() {
        return minutesStart_2.minutesStart$;
      } });
      var minutesUploadVideo_1 = require_minutesUploadVideo();
      var minutesUploadVideo_2 = require_minutesUploadVideo();
      Object.defineProperty(exports, "minutesUploadVideo", { enumerable: true, get: function() {
        return minutesUploadVideo_2.minutesUploadVideo$;
      } });
      var minutesViewDetail_1 = require_minutesViewDetail();
      var minutesViewDetail_2 = require_minutesViewDetail();
      Object.defineProperty(exports, "minutesViewDetail", { enumerable: true, get: function() {
        return minutesViewDetail_2.minutesViewDetail$;
      } });
      var multiSelect_2 = require_multiSelect2();
      var multiSelect_3 = require_multiSelect2();
      Object.defineProperty(exports, "multiSelect", { enumerable: true, get: function() {
        return multiSelect_3.multiSelect$;
      } });
      var navigateBackPage_2 = require_navigateBackPage2();
      var navigateBackPage_3 = require_navigateBackPage2();
      Object.defineProperty(exports, "navigateBackPage", { enumerable: true, get: function() {
        return navigateBackPage_3.navigateBackPage$;
      } });
      var navigateToPage_2 = require_navigateToPage2();
      var navigateToPage_3 = require_navigateToPage2();
      Object.defineProperty(exports, "navigateToPage", { enumerable: true, get: function() {
        return navigateToPage_3.navigateToPage$;
      } });
      var nfcReadCardNumber_1 = require_nfcReadCardNumber();
      var nfcReadCardNumber_2 = require_nfcReadCardNumber();
      Object.defineProperty(exports, "nfcReadCardNumber", { enumerable: true, get: function() {
        return nfcReadCardNumber_2.nfcReadCardNumber$;
      } });
      var notifyBLECharacteristicValueChange_1 = require_notifyBLECharacteristicValueChange();
      var notifyBLECharacteristicValueChange_2 = require_notifyBLECharacteristicValueChange();
      Object.defineProperty(exports, "notifyBLECharacteristicValueChange", { enumerable: true, get: function() {
        return notifyBLECharacteristicValueChange_2.notifyBLECharacteristicValueChange$;
      } });
      var notifyTranslateEvent_1 = require_notifyTranslateEvent();
      var notifyTranslateEvent_2 = require_notifyTranslateEvent();
      Object.defineProperty(exports, "notifyTranslateEvent", { enumerable: true, get: function() {
        return notifyTranslateEvent_2.notifyTranslateEvent$;
      } });
      var offBLECharacteristicValueChange_1 = require_offBLECharacteristicValueChange();
      var offBLECharacteristicValueChange_2 = require_offBLECharacteristicValueChange();
      Object.defineProperty(exports, "offBLECharacteristicValueChange", { enumerable: true, get: function() {
        return offBLECharacteristicValueChange_2.offBLECharacteristicValueChange$;
      } });
      var offBLEConnectionStateChanged_1 = require_offBLEConnectionStateChanged();
      var offBLEConnectionStateChanged_2 = require_offBLEConnectionStateChanged();
      Object.defineProperty(exports, "offBLEConnectionStateChanged", { enumerable: true, get: function() {
        return offBLEConnectionStateChanged_2.offBLEConnectionStateChanged$;
      } });
      var offBluetoothAdapterStateChange_1 = require_offBluetoothAdapterStateChange();
      var offBluetoothAdapterStateChange_2 = require_offBluetoothAdapterStateChange();
      Object.defineProperty(exports, "offBluetoothAdapterStateChange", { enumerable: true, get: function() {
        return offBluetoothAdapterStateChange_2.offBluetoothAdapterStateChange$;
      } });
      var offBluetoothDeviceFound_1 = require_offBluetoothDeviceFound();
      var offBluetoothDeviceFound_2 = require_offBluetoothDeviceFound();
      Object.defineProperty(exports, "offBluetoothDeviceFound", { enumerable: true, get: function() {
        return offBluetoothDeviceFound_2.offBluetoothDeviceFound$;
      } });
      var onBLECharacteristicValueChange_1 = require_onBLECharacteristicValueChange();
      var onBLECharacteristicValueChange_2 = require_onBLECharacteristicValueChange();
      Object.defineProperty(exports, "onBLECharacteristicValueChange", { enumerable: true, get: function() {
        return onBLECharacteristicValueChange_2.onBLECharacteristicValueChange$;
      } });
      var onBLEConnectionStateChanged_1 = require_onBLEConnectionStateChanged();
      var onBLEConnectionStateChanged_2 = require_onBLEConnectionStateChanged();
      Object.defineProperty(exports, "onBLEConnectionStateChanged", { enumerable: true, get: function() {
        return onBLEConnectionStateChanged_2.onBLEConnectionStateChanged$;
      } });
      var onBLEPeripheralCharacteristicReadRequest_1 = require_onBLEPeripheralCharacteristicReadRequest();
      var onBLEPeripheralCharacteristicReadRequest_2 = require_onBLEPeripheralCharacteristicReadRequest();
      Object.defineProperty(exports, "onBLEPeripheralCharacteristicReadRequest", { enumerable: true, get: function() {
        return onBLEPeripheralCharacteristicReadRequest_2.onBLEPeripheralCharacteristicReadRequest$;
      } });
      var onBLEPeripheralCharacteristicWriteRequest_1 = require_onBLEPeripheralCharacteristicWriteRequest();
      var onBLEPeripheralCharacteristicWriteRequest_2 = require_onBLEPeripheralCharacteristicWriteRequest();
      Object.defineProperty(exports, "onBLEPeripheralCharacteristicWriteRequest", { enumerable: true, get: function() {
        return onBLEPeripheralCharacteristicWriteRequest_2.onBLEPeripheralCharacteristicWriteRequest$;
      } });
      var onBLEPeripheralConnectionStateChanged_1 = require_onBLEPeripheralConnectionStateChanged();
      var onBLEPeripheralConnectionStateChanged_2 = require_onBLEPeripheralConnectionStateChanged();
      Object.defineProperty(exports, "onBLEPeripheralConnectionStateChanged", { enumerable: true, get: function() {
        return onBLEPeripheralConnectionStateChanged_2.onBLEPeripheralConnectionStateChanged$;
      } });
      var onBeaconServiceChange_1 = require_onBeaconServiceChange();
      var onBeaconServiceChange_2 = require_onBeaconServiceChange();
      Object.defineProperty(exports, "onBeaconServiceChange", { enumerable: true, get: function() {
        return onBeaconServiceChange_2.onBeaconServiceChange$;
      } });
      var onBeaconUpdate_1 = require_onBeaconUpdate();
      var onBeaconUpdate_2 = require_onBeaconUpdate();
      Object.defineProperty(exports, "onBeaconUpdate", { enumerable: true, get: function() {
        return onBeaconUpdate_2.onBeaconUpdate$;
      } });
      var onBluetoothAdapterStateChange_1 = require_onBluetoothAdapterStateChange();
      var onBluetoothAdapterStateChange_2 = require_onBluetoothAdapterStateChange();
      Object.defineProperty(exports, "onBluetoothAdapterStateChange", { enumerable: true, get: function() {
        return onBluetoothAdapterStateChange_2.onBluetoothAdapterStateChange$;
      } });
      var onBluetoothDeviceFound_1 = require_onBluetoothDeviceFound();
      var onBluetoothDeviceFound_2 = require_onBluetoothDeviceFound();
      Object.defineProperty(exports, "onBluetoothDeviceFound", { enumerable: true, get: function() {
        return onBluetoothDeviceFound_2.onBluetoothDeviceFound$;
      } });
      var onPlayAudioEnd_1 = require_onPlayAudioEnd();
      var onPlayAudioEnd_2 = require_onPlayAudioEnd();
      Object.defineProperty(exports, "onPlayAudioEnd", { enumerable: true, get: function() {
        return onPlayAudioEnd_2.onPlayAudioEnd$;
      } });
      var onRecordEnd_2 = require_onRecordEnd2();
      var onRecordEnd_3 = require_onRecordEnd2();
      Object.defineProperty(exports, "onRecordEnd", { enumerable: true, get: function() {
        return onRecordEnd_3.onRecordEnd$;
      } });
      var openBluetoothAdapter_1 = require_openBluetoothAdapter();
      var openBluetoothAdapter_2 = require_openBluetoothAdapter();
      Object.defineProperty(exports, "openBluetoothAdapter", { enumerable: true, get: function() {
        return openBluetoothAdapter_2.openBluetoothAdapter$;
      } });
      var openChatByChatId_1 = require_openChatByChatId();
      var openChatByChatId_2 = require_openChatByChatId();
      Object.defineProperty(exports, "openChatByChatId", { enumerable: true, get: function() {
        return openChatByChatId_2.openChatByChatId$;
      } });
      var openChatByConversationId_1 = require_openChatByConversationId();
      var openChatByConversationId_2 = require_openChatByConversationId();
      Object.defineProperty(exports, "openChatByConversationId", { enumerable: true, get: function() {
        return openChatByConversationId_2.openChatByConversationId$;
      } });
      var openChatByUserId_1 = require_openChatByUserId();
      var openChatByUserId_2 = require_openChatByUserId();
      Object.defineProperty(exports, "openChatByUserId", { enumerable: true, get: function() {
        return openChatByUserId_2.openChatByUserId$;
      } });
      var openDocument_2 = require_openDocument2();
      var openDocument_3 = require_openDocument2();
      Object.defineProperty(exports, "openDocument", { enumerable: true, get: function() {
        return openDocument_3.openDocument$;
      } });
      var openLink_2 = require_openLink2();
      var openLink_3 = require_openLink2();
      Object.defineProperty(exports, "openLink", { enumerable: true, get: function() {
        return openLink_3.openLink$;
      } });
      var openLocalFile_2 = require_openLocalFile2();
      var openLocalFile_3 = require_openLocalFile2();
      Object.defineProperty(exports, "openLocalFile", { enumerable: true, get: function() {
        return openLocalFile_3.openLocalFile$;
      } });
      var openLocation_1 = require_openLocation();
      var openLocation_2 = require_openLocation();
      Object.defineProperty(exports, "openLocation", { enumerable: true, get: function() {
        return openLocation_2.openLocation$;
      } });
      var openMicroApp_1 = require_openMicroApp();
      var openMicroApp_2 = require_openMicroApp();
      Object.defineProperty(exports, "openMicroApp", { enumerable: true, get: function() {
        return openMicroApp_2.openMicroApp$;
      } });
      var openPageInMicroApp_1 = require_openPageInMicroApp();
      var openPageInMicroApp_2 = require_openPageInMicroApp();
      Object.defineProperty(exports, "openPageInMicroApp", { enumerable: true, get: function() {
        return openPageInMicroApp_2.openPageInMicroApp$;
      } });
      var openPageInModalForPC_1 = require_openPageInModalForPC();
      var openPageInModalForPC_2 = require_openPageInModalForPC();
      Object.defineProperty(exports, "openPageInModalForPC", { enumerable: true, get: function() {
        return openPageInModalForPC_2.openPageInModalForPC$;
      } });
      var openPageInSlidePanelForPC_1 = require_openPageInSlidePanelForPC();
      var openPageInSlidePanelForPC_2 = require_openPageInSlidePanelForPC();
      Object.defineProperty(exports, "openPageInSlidePanelForPC", { enumerable: true, get: function() {
        return openPageInSlidePanelForPC_2.openPageInSlidePanelForPC$;
      } });
      var openPageInWorkBenchForPC_1 = require_openPageInWorkBenchForPC();
      var openPageInWorkBenchForPC_2 = require_openPageInWorkBenchForPC();
      Object.defineProperty(exports, "openPageInWorkBenchForPC", { enumerable: true, get: function() {
        return openPageInWorkBenchForPC_2.openPageInWorkBenchForPC$;
      } });
      var pauseAudio_1 = require_pauseAudio();
      var pauseAudio_2 = require_pauseAudio();
      Object.defineProperty(exports, "pauseAudio", { enumerable: true, get: function() {
        return pauseAudio_2.pauseAudio$;
      } });
      var playAudio_1 = require_playAudio();
      var playAudio_2 = require_playAudio();
      Object.defineProperty(exports, "playAudio", { enumerable: true, get: function() {
        return playAudio_2.playAudio$;
      } });
      var popGesture_1 = require_popGesture();
      var popGesture_2 = require_popGesture();
      Object.defineProperty(exports, "popGesture", { enumerable: true, get: function() {
        return popGesture_2.popGesture$;
      } });
      var previewFileInDingTalk_1 = require_previewFileInDingTalk();
      var previewFileInDingTalk_2 = require_previewFileInDingTalk();
      Object.defineProperty(exports, "previewFileInDingTalk", { enumerable: true, get: function() {
        return previewFileInDingTalk_2.previewFileInDingTalk$;
      } });
      var previewImage_2 = require_previewImage2();
      var previewImage_3 = require_previewImage2();
      Object.defineProperty(exports, "previewImage", { enumerable: true, get: function() {
        return previewImage_3.previewImage$;
      } });
      var previewImagesInDingTalkBatch_1 = require_previewImagesInDingTalkBatch();
      var previewImagesInDingTalkBatch_2 = require_previewImagesInDingTalkBatch();
      Object.defineProperty(exports, "previewImagesInDingTalkBatch", { enumerable: true, get: function() {
        return previewImagesInDingTalkBatch_2.previewImagesInDingTalkBatch$;
      } });
      var previewMedia_1 = require_previewMedia();
      var previewMedia_2 = require_previewMedia();
      Object.defineProperty(exports, "previewMedia", { enumerable: true, get: function() {
        return previewMedia_2.previewMedia$;
      } });
      var prompt_2 = require_prompt2();
      var prompt_3 = require_prompt2();
      Object.defineProperty(exports, "prompt", { enumerable: true, get: function() {
        return prompt_3.prompt$;
      } });
      var quickCallList_2 = require_quickCallList2();
      var quickCallList_3 = require_quickCallList2();
      Object.defineProperty(exports, "quickCallList", { enumerable: true, get: function() {
        return quickCallList_3.quickCallList$;
      } });
      var quitPage_1 = require_quitPage();
      var quitPage_2 = require_quitPage();
      Object.defineProperty(exports, "quitPage", { enumerable: true, get: function() {
        return quitPage_2.quitPage$;
      } });
      var readBLECharacteristicValue_1 = require_readBLECharacteristicValue();
      var readBLECharacteristicValue_2 = require_readBLECharacteristicValue();
      Object.defineProperty(exports, "readBLECharacteristicValue", { enumerable: true, get: function() {
        return readBLECharacteristicValue_2.readBLECharacteristicValue$;
      } });
      var readNFC_1 = require_readNFC();
      var readNFC_2 = require_readNFC();
      Object.defineProperty(exports, "readNFC", { enumerable: true, get: function() {
        return readNFC_2.readNFC$;
      } });
      var removeCachedAPIResponse_1 = require_removeCachedAPIResponse();
      var removeCachedAPIResponse_2 = require_removeCachedAPIResponse();
      Object.defineProperty(exports, "removeCachedAPIResponse", { enumerable: true, get: function() {
        return removeCachedAPIResponse_2.removeCachedAPIResponse$;
      } });
      var removeStorage_1 = require_removeStorage();
      var removeStorage_2 = require_removeStorage();
      Object.defineProperty(exports, "removeStorage", { enumerable: true, get: function() {
        return removeStorage_2.removeStorage$;
      } });
      var replacePage_1 = require_replacePage();
      var replacePage_2 = require_replacePage();
      Object.defineProperty(exports, "replacePage", { enumerable: true, get: function() {
        return replacePage_2.replacePage$;
      } });
      var requestAuthCode_3 = require_requestAuthCode3();
      var requestAuthCode_4 = require_requestAuthCode3();
      Object.defineProperty(exports, "requestAuthCode", { enumerable: true, get: function() {
        return requestAuthCode_4.requestAuthCode$;
      } });
      var requestMoneySubmmitOrder_1 = require_requestMoneySubmmitOrder();
      var requestMoneySubmmitOrder_2 = require_requestMoneySubmmitOrder();
      Object.defineProperty(exports, "requestMoneySubmmitOrder", { enumerable: true, get: function() {
        return requestMoneySubmmitOrder_2.requestMoneySubmmitOrder$;
      } });
      var resetScreenView_1 = require_resetScreenView();
      var resetScreenView_2 = require_resetScreenView();
      Object.defineProperty(exports, "resetScreenView", { enumerable: true, get: function() {
        return resetScreenView_2.resetScreenView$;
      } });
      var resumeAudio_1 = require_resumeAudio();
      var resumeAudio_2 = require_resumeAudio();
      Object.defineProperty(exports, "resumeAudio", { enumerable: true, get: function() {
        return resumeAudio_2.resumeAudio$;
      } });
      var rotateScreenView_1 = require_rotateScreenView();
      var rotateScreenView_2 = require_rotateScreenView();
      Object.defineProperty(exports, "rotateScreenView", { enumerable: true, get: function() {
        return rotateScreenView_2.rotateScreenView$;
      } });
      var rsa_2 = require_rsa2();
      var rsa_3 = require_rsa2();
      Object.defineProperty(exports, "rsa", { enumerable: true, get: function() {
        return rsa_3.rsa$;
      } });
      var saveFileToDingTalk_1 = require_saveFileToDingTalk();
      var saveFileToDingTalk_2 = require_saveFileToDingTalk();
      Object.defineProperty(exports, "saveFileToDingTalk", { enumerable: true, get: function() {
        return saveFileToDingTalk_2.saveFileToDingTalk$;
      } });
      var saveImageToPhotosAlbum_2 = require_saveImageToPhotosAlbum2();
      var saveImageToPhotosAlbum_3 = require_saveImageToPhotosAlbum2();
      Object.defineProperty(exports, "saveImageToPhotosAlbum", { enumerable: true, get: function() {
        return saveImageToPhotosAlbum_3.saveImageToPhotosAlbum$;
      } });
      var saveVideoToPhotosAlbum_1 = require_saveVideoToPhotosAlbum();
      var saveVideoToPhotosAlbum_2 = require_saveVideoToPhotosAlbum();
      Object.defineProperty(exports, "saveVideoToPhotosAlbum", { enumerable: true, get: function() {
        return saveVideoToPhotosAlbum_2.saveVideoToPhotosAlbum$;
      } });
      var scan_2 = require_scan2();
      var scan_3 = require_scan2();
      Object.defineProperty(exports, "scan", { enumerable: true, get: function() {
        return scan_3.scan$;
      } });
      var scanCard_2 = require_scanCard2();
      var scanCard_3 = require_scanCard2();
      Object.defineProperty(exports, "scanCard", { enumerable: true, get: function() {
        return scanCard_3.scanCard$;
      } });
      var searchMap_1 = require_searchMap();
      var searchMap_2 = require_searchMap();
      Object.defineProperty(exports, "searchMap", { enumerable: true, get: function() {
        return searchMap_2.searchMap$;
      } });
      var setClipboard_1 = require_setClipboard();
      var setClipboard_2 = require_setClipboard();
      Object.defineProperty(exports, "setClipboard", { enumerable: true, get: function() {
        return setClipboard_2.setClipboard$;
      } });
      var setGestures_1 = require_setGestures();
      var setGestures_2 = require_setGestures();
      Object.defineProperty(exports, "setGestures", { enumerable: true, get: function() {
        return setGestures_2.setGestures$;
      } });
      var setKeepScreenOn_1 = require_setKeepScreenOn();
      var setKeepScreenOn_2 = require_setKeepScreenOn();
      Object.defineProperty(exports, "setKeepScreenOn", { enumerable: true, get: function() {
        return setKeepScreenOn_2.setKeepScreenOn$;
      } });
      var setNavigationIcon_1 = require_setNavigationIcon();
      var setNavigationIcon_2 = require_setNavigationIcon();
      Object.defineProperty(exports, "setNavigationIcon", { enumerable: true, get: function() {
        return setNavigationIcon_2.setNavigationIcon$;
      } });
      var setNavigationLeft_1 = require_setNavigationLeft();
      var setNavigationLeft_2 = require_setNavigationLeft();
      Object.defineProperty(exports, "setNavigationLeft", { enumerable: true, get: function() {
        return setNavigationLeft_2.setNavigationLeft$;
      } });
      var setNavigationTitle_1 = require_setNavigationTitle();
      var setNavigationTitle_2 = require_setNavigationTitle();
      Object.defineProperty(exports, "setNavigationTitle", { enumerable: true, get: function() {
        return setNavigationTitle_2.setNavigationTitle$;
      } });
      var setScreenBrightness_2 = require_setScreenBrightness2();
      var setScreenBrightness_3 = require_setScreenBrightness2();
      Object.defineProperty(exports, "setScreenBrightness", { enumerable: true, get: function() {
        return setScreenBrightness_3.setScreenBrightness$;
      } });
      var setStorage_1 = require_setStorage();
      var setStorage_2 = require_setStorage();
      Object.defineProperty(exports, "setStorage", { enumerable: true, get: function() {
        return setStorage_2.setStorage$;
      } });
      var share_2 = require_share2();
      var share_3 = require_share2();
      Object.defineProperty(exports, "share", { enumerable: true, get: function() {
        return share_3.share$;
      } });
      var showActionSheet_1 = require_showActionSheet();
      var showActionSheet_2 = require_showActionSheet();
      Object.defineProperty(exports, "showActionSheet", { enumerable: true, get: function() {
        return showActionSheet_2.showActionSheet$;
      } });
      var showAuthGuide_2 = require_showAuthGuide2();
      var showAuthGuide_3 = require_showAuthGuide2();
      Object.defineProperty(exports, "showAuthGuide", { enumerable: true, get: function() {
        return showAuthGuide_3.showAuthGuide$;
      } });
      var showCallMenu_2 = require_showCallMenu2();
      var showCallMenu_3 = require_showCallMenu2();
      Object.defineProperty(exports, "showCallMenu", { enumerable: true, get: function() {
        return showCallMenu_3.showCallMenu$;
      } });
      var showLoading_1 = require_showLoading();
      var showLoading_2 = require_showLoading();
      Object.defineProperty(exports, "showLoading", { enumerable: true, get: function() {
        return showLoading_2.showLoading$;
      } });
      var showModal_1 = require_showModal();
      var showModal_2 = require_showModal();
      Object.defineProperty(exports, "showModal", { enumerable: true, get: function() {
        return showModal_2.showModal$;
      } });
      var showRecordTabRedDot_1 = require_showRecordTabRedDot();
      var showRecordTabRedDot_2 = require_showRecordTabRedDot();
      Object.defineProperty(exports, "showRecordTabRedDot", { enumerable: true, get: function() {
        return showRecordTabRedDot_2.showRecordTabRedDot$;
      } });
      var showSharePanel_2 = require_showSharePanel2();
      var showSharePanel_3 = require_showSharePanel2();
      Object.defineProperty(exports, "showSharePanel", { enumerable: true, get: function() {
        return showSharePanel_3.showSharePanel$;
      } });
      var showToast_1 = require_showToast();
      var showToast_2 = require_showToast();
      Object.defineProperty(exports, "showToast", { enumerable: true, get: function() {
        return showToast_2.showToast$;
      } });
      var singleSelect_1 = require_singleSelect();
      var singleSelect_2 = require_singleSelect();
      Object.defineProperty(exports, "singleSelect", { enumerable: true, get: function() {
        return singleSelect_2.singleSelect$;
      } });
      var startAdvertising_1 = require_startAdvertising();
      var startAdvertising_2 = require_startAdvertising();
      Object.defineProperty(exports, "startAdvertising", { enumerable: true, get: function() {
        return startAdvertising_2.startAdvertising$;
      } });
      var startBeaconDiscovery_1 = require_startBeaconDiscovery();
      var startBeaconDiscovery_2 = require_startBeaconDiscovery();
      Object.defineProperty(exports, "startBeaconDiscovery", { enumerable: true, get: function() {
        return startBeaconDiscovery_2.startBeaconDiscovery$;
      } });
      var startBluetoothDevicesDiscovery_1 = require_startBluetoothDevicesDiscovery();
      var startBluetoothDevicesDiscovery_2 = require_startBluetoothDevicesDiscovery();
      Object.defineProperty(exports, "startBluetoothDevicesDiscovery", { enumerable: true, get: function() {
        return startBluetoothDevicesDiscovery_2.startBluetoothDevicesDiscovery$;
      } });
      var startDingerRecord_1 = require_startDingerRecord();
      var startDingerRecord_2 = require_startDingerRecord();
      Object.defineProperty(exports, "startDingerRecord", { enumerable: true, get: function() {
        return startDingerRecord_2.startDingerRecord$;
      } });
      var startLocating_1 = require_startLocating();
      var startLocating_2 = require_startLocating();
      Object.defineProperty(exports, "startLocating", { enumerable: true, get: function() {
        return startLocating_2.startLocating$;
      } });
      var startRecord_2 = require_startRecord2();
      var startRecord_3 = require_startRecord2();
      Object.defineProperty(exports, "startRecord", { enumerable: true, get: function() {
        return startRecord_3.startRecord$;
      } });
      var stopAdvertising_1 = require_stopAdvertising();
      var stopAdvertising_2 = require_stopAdvertising();
      Object.defineProperty(exports, "stopAdvertising", { enumerable: true, get: function() {
        return stopAdvertising_2.stopAdvertising$;
      } });
      var stopAudio_1 = require_stopAudio();
      var stopAudio_2 = require_stopAudio();
      Object.defineProperty(exports, "stopAudio", { enumerable: true, get: function() {
        return stopAudio_2.stopAudio$;
      } });
      var stopBeaconDiscovery_1 = require_stopBeaconDiscovery();
      var stopBeaconDiscovery_2 = require_stopBeaconDiscovery();
      Object.defineProperty(exports, "stopBeaconDiscovery", { enumerable: true, get: function() {
        return stopBeaconDiscovery_2.stopBeaconDiscovery$;
      } });
      var stopBluetoothDevicesDiscovery_1 = require_stopBluetoothDevicesDiscovery();
      var stopBluetoothDevicesDiscovery_2 = require_stopBluetoothDevicesDiscovery();
      Object.defineProperty(exports, "stopBluetoothDevicesDiscovery", { enumerable: true, get: function() {
        return stopBluetoothDevicesDiscovery_2.stopBluetoothDevicesDiscovery$;
      } });
      var stopDingerRecord_1 = require_stopDingerRecord();
      var stopDingerRecord_2 = require_stopDingerRecord();
      Object.defineProperty(exports, "stopDingerRecord", { enumerable: true, get: function() {
        return stopDingerRecord_2.stopDingerRecord$;
      } });
      var stopLocating_1 = require_stopLocating();
      var stopLocating_2 = require_stopLocating();
      Object.defineProperty(exports, "stopLocating", { enumerable: true, get: function() {
        return stopLocating_2.stopLocating$;
      } });
      var stopPullDownRefresh_1 = require_stopPullDownRefresh();
      var stopPullDownRefresh_2 = require_stopPullDownRefresh();
      Object.defineProperty(exports, "stopPullDownRefresh", { enumerable: true, get: function() {
        return stopPullDownRefresh_2.stopPullDownRefresh$;
      } });
      var stopRecord_2 = require_stopRecord2();
      var stopRecord_3 = require_stopRecord2();
      Object.defineProperty(exports, "stopRecord", { enumerable: true, get: function() {
        return stopRecord_3.stopRecord$;
      } });
      var subscribe_2 = require_subscribe2();
      var subscribe_3 = require_subscribe2();
      Object.defineProperty(exports, "subscribe", { enumerable: true, get: function() {
        return subscribe_3.subscribe$;
      } });
      var timePicker_1 = require_timePicker();
      var timePicker_2 = require_timePicker();
      Object.defineProperty(exports, "timePicker", { enumerable: true, get: function() {
        return timePicker_2.timePicker$;
      } });
      var translate_1 = require_translate();
      var translate_2 = require_translate();
      Object.defineProperty(exports, "translate", { enumerable: true, get: function() {
        return translate_2.translate$;
      } });
      var translateVoice_2 = require_translateVoice2();
      var translateVoice_3 = require_translateVoice2();
      Object.defineProperty(exports, "translateVoice", { enumerable: true, get: function() {
        return translateVoice_3.translateVoice$;
      } });
      var uploadAttachmentToDingTalk_1 = require_uploadAttachmentToDingTalk();
      var uploadAttachmentToDingTalk_2 = require_uploadAttachmentToDingTalk();
      Object.defineProperty(exports, "uploadAttachmentToDingTalk", { enumerable: true, get: function() {
        return uploadAttachmentToDingTalk_2.uploadAttachmentToDingTalk$;
      } });
      var uploadFile_2 = require_uploadFile2();
      var uploadFile_3 = require_uploadFile2();
      Object.defineProperty(exports, "uploadFile", { enumerable: true, get: function() {
        return uploadFile_3.uploadFile$;
      } });
      var vibrate_2 = require_vibrate2();
      var vibrate_3 = require_vibrate2();
      Object.defineProperty(exports, "vibrate", { enumerable: true, get: function() {
        return vibrate_3.vibrate$;
      } });
      var watchShake_2 = require_watchShake2();
      var watchShake_3 = require_watchShake2();
      Object.defineProperty(exports, "watchShake", { enumerable: true, get: function() {
        return watchShake_3.watchShake$;
      } });
      var writeBLECharacteristicValue_1 = require_writeBLECharacteristicValue();
      var writeBLECharacteristicValue_2 = require_writeBLECharacteristicValue();
      Object.defineProperty(exports, "writeBLECharacteristicValue", { enumerable: true, get: function() {
        return writeBLECharacteristicValue_2.writeBLECharacteristicValue$;
      } });
      var writeBLEPeripheralCharacteristicValue_1 = require_writeBLEPeripheralCharacteristicValue();
      var writeBLEPeripheralCharacteristicValue_2 = require_writeBLEPeripheralCharacteristicValue();
      Object.defineProperty(exports, "writeBLEPeripheralCharacteristicValue", { enumerable: true, get: function() {
        return writeBLEPeripheralCharacteristicValue_2.writeBLEPeripheralCharacteristicValue$;
      } });
      var writeNFC_1 = require_writeNFC();
      var writeNFC_2 = require_writeNFC();
      Object.defineProperty(exports, "writeNFC", { enumerable: true, get: function() {
        return writeNFC_2.writeNFC$;
      } });
      var getItem_1 = require_getItem();
      var getStorageInfo_1 = require_getStorageInfo();
      var removeItem_1 = require_removeItem();
      var setItem_1 = require_setItem();
      var getData_1 = require_getData();
      exports.apiObj = { biz: { ATMBle: { beaconPicker: beaconPicker_1.beaconPicker$, detectFace: detectFace_1.detectFace$, detectFaceFullScreen: detectFaceFullScreen_1.detectFaceFullScreen$, exclusiveLiveCheck: exclusiveLiveCheck_1.exclusiveLiveCheck$, faceManager: faceManager_1.faceManager$, punchModePicker: punchModePicker_1.punchModePicker$ }, alipay: { bindAlipay: bindAlipay_1.bindAlipay$, openAuth: openAuth_1.openAuth$, pay: pay_1.pay$ }, attend: { getLBSWua: getLBSWua_1.getLBSWua$ }, auth: { openAccountPwdLoginPage: openAccountPwdLoginPage_1.openAccountPwdLoginPage$, requestAuthInfo: requestAuthInfo_1.requestAuthInfo$ }, calendar: { chooseDateTime: chooseDateTime_1.chooseDateTime$, chooseHalfDay: chooseHalfDay_1.chooseHalfDay$, chooseInterval: chooseInterval_1.chooseInterval$, chooseOneDay: chooseOneDay_1.chooseOneDay$ }, chat: {
        chooseConversationByCorpId: chooseConversationByCorpId_1.chooseConversationByCorpId$,
        collectSticker: collectSticker_1.collectSticker$,
        createSceneGroup: createSceneGroup_1.createSceneGroup$,
        getRealmCid: getRealmCid_1.getRealmCid$,
        locationChatMessage: locationChatMessage_1.locationChatMessage$,
        openSingleChat: openSingleChat_1.openSingleChat$,
        pickConversation: pickConversation_1.pickConversation$,
        sendEmotion: sendEmotion_1.sendEmotion$,
        toConversation: toConversation_1.toConversation$,
        toConversationByOpenConversationId: toConversationByOpenConversationId_1.toConversationByOpenConversationId$
      }, clipboardData: { setData: setData_1.setData$ }, conference: { createCloudCall: createCloudCall_1.createCloudCall$, getCloudCallInfo: getCloudCallInfo_1.getCloudCallInfo$, getCloudCallList: getCloudCallList_1.getCloudCallList$, videoConfCall: videoConfCall_1.videoConfCall$ }, contact: { choose: choose_1.choose$, chooseMobileContacts: chooseMobileContacts_1.chooseMobileContacts$, complexPicker: complexPicker_1.complexPicker$, createGroup: createGroup_1.createGroup$, departmentsPicker: departmentsPicker_1.departmentsPicker$, externalComplexPicker: externalComplexPicker_1.externalComplexPicker$, externalEditForm: externalEditForm_1.externalEditForm$, rolesPicker: rolesPicker_1.rolesPicker$, setRule: setRule_1.setRule$ }, cspace: { chooseSpaceDir: chooseSpaceDir_1.chooseSpaceDir$, delete: delete_1.delete$, preview: preview_1.preview$, previewDentryImages: previewDentryImages_1.previewDentryImages$, saveFile: saveFile_1.saveFile$ }, customContact: { choose: choose_2.choose$, multipleChoose: multipleChoose_1.multipleChoose$ }, data: { rsa: rsa_1.rsa$ }, ding: { create: create_1.create$, post: post_1.post$ }, edu: { finishMiniCourseByRecordId: finishMiniCourseByRecordId_1.finishMiniCourseByRecordId$, getMiniCourseDraftList: getMiniCourseDraftList_1.getMiniCourseDraftList$, joinClassroom: joinClassroom_1.joinClassroom$, makeMiniCourse: makeMiniCourse_1.makeMiniCourse$, newMsgNotificationStatus: newMsgNotificationStatus_1.newMsgNotificationStatus$, startAuth: startAuth_1.startAuth$, tokenFaceImg: tokenFaceImg_1.tokenFaceImg$ }, event: { notifyWeex: notifyWeex_1.notifyWeex$ }, file: { downloadFile: downloadFile_1.downloadFile$ }, intent: { fetchData: fetchData_1.fetchData$ }, iot: { bind: bind_1.bind$, bindMeetingRoom: bindMeetingRoom_1.bindMeetingRoom$, getDeviceProperties: getDeviceProperties_1.getDeviceProperties$, invokeThingService: invokeThingService_1.invokeThingService$, queryMeetingRoomList: queryMeetingRoomList_1.queryMeetingRoomList$, setDeviceProperties: setDeviceProperties_1.setDeviceProperties$, unbind: unbind_1.unbind$ }, live: { startClassRoom: startClassRoom_1.startClassRoom$, startUnifiedLive: startUnifiedLive_1.startUnifiedLive$ }, map: { locate: locate_1.locate$, search: search_1.search$, view: view_1.view$ }, media: { compressVideo: compressVideo_1.compressVideo$ }, microApp: { openApp: openApp_1.openApp$ }, navigation: { close: close_1.close$, goBack: goBack_1.goBack$, hideBar: hideBar_1.hideBar$, navigateBackPage: navigateBackPage_1.navigateBackPage$, navigateToMiniProgram: navigateToMiniProgram_1.navigateToMiniProgram$, navigateToPage: navigateToPage_1.navigateToPage$, quit: quit_1.quit$, replace: replace_1.replace$, setIcon: setIcon_1.setIcon$, setLeft: setLeft_1.setLeft$, setMenu: setMenu_1.setMenu$, setRight: setRight_1.setRight$, setTitle: setTitle_1.setTitle$ }, pbp: { componentPunchFromPartner: componentPunchFromPartner_1.componentPunchFromPartner$, startMatchRuleFromPartner: startMatchRuleFromPartner_1.startMatchRuleFromPartner$, stopMatchRuleFromPartner: stopMatchRuleFromPartner_1.stopMatchRuleFromPartner$ }, phoneContact: { add: add_1.add$ }, realm: { getRealtimeTracingStatus: getRealtimeTracingStatus_1.getRealtimeTracingStatus$, getUserExclusiveInfo: getUserExclusiveInfo_1.getUserExclusiveInfo$, startRealtimeTracing: startRealtimeTracing_1.startRealtimeTracing$, stopRealtimeTracing: stopRealtimeTracing_1.stopRealtimeTracing$, subscribe: subscribe_1.subscribe$, unsubscribe: unsubscribe_1.unsubscribe$ }, resource: { getInfo: getInfo_1.getInfo$, reportDebugMessage: reportDebugMessage_1.reportDebugMessage$ }, shortCut: { addShortCut: addShortCut_1.addShortCut$ }, sports: { getHealthAuthorizationStatus: getHealthAuthorizationStatus_1.getHealthAuthorizationStatus$, getHealthData: getHealthData_1.getHealthData$, getHealthDeviceData: getHealthDeviceData_1.getHealthDeviceData$, requestHealthAuthorization: requestHealthAuthorization_1.requestHealthAuthorization$ }, store: { closeUnpayOrder: closeUnpayOrder_1.closeUnpayOrder$, createOrder: createOrder_1.createOrder$, getPayUrl: getPayUrl_1.getPayUrl$, inquiry: inquiry_1.inquiry$ }, tabwindow: { isTab: isTab_1.isTab$ }, telephone: { call: call_1.call$, checkBizCall: checkBizCall_1.checkBizCall$, quickCallList: quickCallList_1.quickCallList$, showCallMenu: showCallMenu_1.showCallMenu$ }, user: { checkPassword: checkPassword_1.checkPassword$, get: get_1.get$ }, util: { callComponent: callComponent_1.callComponent$, checkAuth: checkAuth_1.checkAuth$, chooseImage: chooseImage_1.chooseImage$, chooseRegion: chooseRegion_1.chooseRegion$, chosen: chosen_1.chosen$, clearWebStoreCache: clearWebStoreCache_1.clearWebStoreCache$, closePreviewImage: closePreviewImage_1.closePreviewImage$, compressImage: compressImage_1.compressImage$, datepicker: datepicker_1.datepicker$, datetimepicker: datetimepicker_1.datetimepicker$, decrypt: decrypt_1.decrypt$, downloadFile: downloadFile_2.downloadFile$, encrypt: encrypt_1.encrypt$, getPerfInfo: getPerfInfo_1.getPerfInfo$, invokeWorkbench: invokeWorkbench_1.invokeWorkbench$, isEnableGPUAcceleration: isEnableGPUAcceleration_1.isEnableGPUAcceleration$, isLocalFileExist: isLocalFileExist_1.isLocalFileExist$, multiSelect: multiSelect_1.multiSelect$, open: open_1.open$, openBrowser: openBrowser_1.openBrowser$, openDocument: openDocument_1.openDocument$, openLink: openLink_1.openLink$, openLocalFile: openLocalFile_1.openLocalFile$, openModal: openModal_1.openModal$, openSlidePanel: openSlidePanel_1.openSlidePanel$, presentWindow: presentWindow_1.presentWindow$, previewImage: previewImage_1.previewImage$, previewVideo: previewVideo_1.previewVideo$, saveImage: saveImage_1.saveImage$, saveImageToPhotosAlbum: saveImageToPhotosAlbum_1.saveImageToPhotosAlbum$, scan: scan_1.scan$, scanCard: scanCard_1.scanCard$, setGPUAcceleration: setGPUAcceleration_1.setGPUAcceleration$, setScreenBrightnessAndKeepOn: setScreenBrightnessAndKeepOn_1.setScreenBrightnessAndKeepOn$, setScreenKeepOn: setScreenKeepOn_1.setScreenKeepOn$, share: share_1.share$, shareImage: shareImage_1.shareImage$, showAuthGuide: showAuthGuide_1.showAuthGuide$, showSharePanel: showSharePanel_1.showSharePanel$, startDocSign: startDocSign_1.startDocSign$, systemShare: systemShare_1.systemShare$, timepicker: timepicker_1.timepicker$, uploadAttachment: uploadAttachment_1.uploadAttachment$, uploadFile: uploadFile_1.uploadFile$, uploadImage: uploadImage_1.uploadImage$, uploadImageFromCamera: uploadImageFromCamera_1.uploadImageFromCamera$, ut: ut_1.ut$ }, verify: { openBindIDCard: openBindIDCard_1.openBindIDCard$, startAuth: startAuth_2.startAuth$ }, voice: { makeCall: makeCall_1.makeCall$ }, watermarkCamera: { getWatermarkInfo: getWatermarkInfo_1.getWatermarkInfo$, setWatermarkInfo: setWatermarkInfo_1.setWatermarkInfo$ } }, channel: { permission: { requestAuthCode: requestAuthCode_1.requestAuthCode$ } }, device: { accelerometer: { clearShake: clearShake_1.clearShake$, watchShake: watchShake_1.watchShake$ }, audio: { download: download_1.download$, onPlayEnd: onPlayEnd_1.onPlayEnd$, onRecordEnd: onRecordEnd_1.onRecordEnd$, pause: pause_1.pause$, play: play_1.play$, resume: resume_1.resume$, startRecord: startRecord_1.startRecord$, stop: stop_1.stop$, stopRecord: stopRecord_1.stopRecord$, translateVoice: translateVoice_1.translateVoice$ }, base: { getBatteryInfo: getBatteryInfo_1.getBatteryInfo$, getInterface: getInterface_1.getInterface$, getPhoneInfo: getPhoneInfo_1.getPhoneInfo$, getScanWifiListAsync: getScanWifiListAsync_1.getScanWifiListAsync$, getUUID: getUUID_1.getUUID$, getWifiStatus: getWifiStatus_1.getWifiStatus$, openSystemSetting: openSystemSetting_1.openSystemSetting$ }, connection: { getNetworkType: getNetworkType_1.getNetworkType$ }, geolocation: { checkPermission: checkPermission_1.checkPermission$, get: get_2.get$, start: start_1.start$, status: status_1.status$, stop: stop_2.stop$ }, launcher: { checkInstalledApps: checkInstalledApps_1.checkInstalledApps$, launchApp: launchApp_1.launchApp$ }, nfc: { nfcRead: nfcRead_1.nfcRead$, nfcStop: nfcStop_1.nfcStop$, nfcWrite: nfcWrite_1.nfcWrite$ }, notification: { actionSheet: actionSheet_1.actionSheet$, alert: alert_1.alert$, confirm: confirm_1.confirm$, extendModal: extendModal_1.extendModal$, hidePreloader: hidePreloader_1.hidePreloader$, modal: modal_1.modal$, prompt: prompt_1.prompt$, showPreloader: showPreloader_1.showPreloader$, toast: toast_1.toast$, vibrate: vibrate_1.vibrate$ }, screen: { getScreenBrightness: getScreenBrightness_1.getScreenBrightness$, insetAdjust: insetAdjust_1.insetAdjust$, isScreenReaderEnabled: isScreenReaderEnabled_1.isScreenReaderEnabled$, resetView: resetView_1.resetView$, rotateView: rotateView_1.rotateView$, setScreenBrightness: setScreenBrightness_1.setScreenBrightness$ } }, media: { voiceRecorder: { keepAlive: keepAlive_1.keepAlive$, pause: pause_2.pause$, resume: resume_2.resume$, start: start_2.start$, stop: stop_3.stop$ } }, net: { bjGovApn: { loginGovNet: loginGovNet_1.loginGovNet$ } }, runtime: { h5nuvabridge: { exec: exec_1.exec$ }, message: { fetch: fetch_1.fetch$, post: post_2.post$ }, monitor: { getLoadTime: getLoadTime_1.getLoadTime$ }, permission: { requestAuthCode: requestAuthCode_2.requestAuthCode$, requestOperateAuthCode: requestOperateAuthCode_1.requestOperateAuthCode$ } }, ui: { input: { plain: plain_1.plain$ }, multitask: { addToFloat: addToFloat_1.addToFloat$, removeFromFloat: removeFromFloat_1.removeFromFloat$ }, nav: { close: close_2.close$, getCurrentId: getCurrentId_1.getCurrentId$, go: go_1.go$, preload: preload_1.preload$, recycle: recycle_1.recycle$ }, progressBar: { setColors: setColors_1.setColors$ }, pullToRefresh: { disable: disable_1.disable$, enable: enable_1.enable$, stop: stop_4.stop$ }, webViewBounce: { disable: disable_2.disable$, enable: enable_2.enable$ } }, ExternalChannelPublish: ExternalChannelPublish_1.ExternalChannelPublish$, addPhoneContact: addPhoneContact_1.addPhoneContact$, alert: alert_2.alert$, callUsers: callUsers_1.callUsers$, checkAuth: checkAuth_2.checkAuth$, checkBizCall: checkBizCall_2.checkBizCall$, chooseChat: chooseChat_1.chooseChat$, chooseConversation: chooseConversation_1.chooseConversation$, chooseDateRangeInCalendar: chooseDateRangeInCalendar_1.chooseDateRangeInCalendar$, chooseDateTime: chooseDateTime_2.chooseDateTime$, chooseDepartments: chooseDepartments_1.chooseDepartments$, chooseDingTalkDir: chooseDingTalkDir_1.chooseDingTalkDir$, chooseDistrict: chooseDistrict_1.chooseDistrict$, chooseExternalUsers: chooseExternalUsers_1.chooseExternalUsers$, chooseFile: chooseFile_1.chooseFile$, chooseHalfDayInCalendar: chooseHalfDayInCalendar_1.chooseHalfDayInCalendar$, chooseImage: chooseImage_2.chooseImage$, chooseMedia: chooseMedia_1.chooseMedia$, chooseOneDayInCalendar: chooseOneDayInCalendar_1.chooseOneDayInCalendar$, chooseOrg: chooseOrg_1.chooseOrg$, choosePhonebook: choosePhonebook_1.choosePhonebook$, chooseStaffForPC: chooseStaffForPC_1.chooseStaffForPC$, chooseUserFromList: chooseUserFromList_1.chooseUserFromList$, clearShake: clearShake_2.clearShake$, closeBluetoothAdapter: closeBluetoothAdapter_1.closeBluetoothAdapter$, closePage: closePage_1.closePage$, complexChoose: complexChoose_1.complexChoose$, compressImage: compressImage_2.compressImage$, confirm: confirm_2.confirm$, connectBLEDevice: connectBLEDevice_1.connectBLEDevice$, createBLEPeripheralServer: createBLEPeripheralServer_1.createBLEPeripheralServer$, createDing: createDing_1.createDing$, createDingForPC: createDingForPC_1.createDingForPC$, createGroupChat: createGroupChat_1.createGroupChat$, createLiveClassRoom: createLiveClassRoom_1.createLiveClassRoom$, createPayOrder: createPayOrder_1.createPayOrder$, cropImage: cropImage_1.cropImage$, customChooseUsers: customChooseUsers_1.customChooseUsers$, datePicker: datePicker_1.datePicker$, dateRangePicker: dateRangePicker_1.dateRangePicker$, decrypt: decrypt_2.decrypt$, disablePullDownRefresh: disablePullDownRefresh_1.disablePullDownRefresh$, disableWebViewBounce: disableWebViewBounce_1.disableWebViewBounce$, disconnectBLEDevice: disconnectBLEDevice_1.disconnectBLEDevice$, downloadAudio: downloadAudio_1.downloadAudio$, downloadFile: downloadFile_3.downloadFile$, editExternalUser: editExternalUser_1.editExternalUser$, editPicture: editPicture_1.editPicture$, enablePullDownRefresh: enablePullDownRefresh_1.enablePullDownRefresh$, enableWebViewBounce: enableWebViewBounce_1.enableWebViewBounce$, encrypt: encrypt_2.encrypt$, exclusiveLiveCheck: exclusiveLiveCheck_2.exclusiveLiveCheck$, generateImageFromCode: generateImageFromCode_1.generateImageFromCode$, getAccountType: getAccountType_1.getAccountType$, getActiveConferenceInfo: getActiveConferenceInfo_1.getActiveConferenceInfo$, getAdvertisingStatus: getAdvertisingStatus_1.getAdvertisingStatus$, getAuthCode: getAuthCode_1.getAuthCode$, getAuthCodeV2: getAuthCodeV2_1.getAuthCodeV2$, getAuthInfo: getAuthInfo_1.getAuthInfo$, getBLEDeviceCharacteristics: getBLEDeviceCharacteristics_1.getBLEDeviceCharacteristics$, getBLEDeviceServices: getBLEDeviceServices_1.getBLEDeviceServices$, getBatteryInfo: getBatteryInfo_2.getBatteryInfo$, getBeacons: getBeacons_1.getBeacons$, getBluetoothAdapterState: getBluetoothAdapterState_1.getBluetoothAdapterState$, getBluetoothDevices: getBluetoothDevices_1.getBluetoothDevices$, getCachedAPIResponse: getCachedAPIResponse_1.getCachedAPIResponse$, getCloudCallInfo: getCloudCallInfo_2.getCloudCallInfo$, getCloudCallList: getCloudCallList_2.getCloudCallList$, getCurrentCorpId: getCurrentCorpId_1.getCurrentCorpId$, getDeviceId: getDeviceId_1.getDeviceId$, getDeviceUUID: getDeviceUUID_1.getDeviceUUID$, getDingerDeviceStatus: getDingerDeviceStatus_1.getDingerDeviceStatus$, getImageInfo: getImageInfo_1.getImageInfo$, getLocatingStatus: getLocatingStatus_1.getLocatingStatus$, getLocation: getLocation_1.getLocation$, getNetworkType: getNetworkType_2.getNetworkType$, getOperateAuthCode: getOperateAuthCode_1.getOperateAuthCode$, getPageTerminateInfo: getPageTerminateInfo_1.getPageTerminateInfo$, getPersonalWorkInfo: getPersonalWorkInfo_1.getPersonalWorkInfo$, getScreenBrightness: getScreenBrightness_2.getScreenBrightness$, getStorage: getStorage_1.getStorage$, getSystemInfo: getSystemInfo_1.getSystemInfo$, getSystemSettings: getSystemSettings_1.getSystemSettings$, getThirdAppConfCustomData: getThirdAppConfCustomData_1.getThirdAppConfCustomData$, getThirdAppUserCustomData: getThirdAppUserCustomData_1.getThirdAppUserCustomData$, getTodaysStepCount: getTodaysStepCount_1.getTodaysStepCount$, getTranslateStatus: getTranslateStatus_1.getTranslateStatus$, getUserExclusiveInfo: getUserExclusiveInfo_2.getUserExclusiveInfo$, getWifiHotspotStatus: getWifiHotspotStatus_1.getWifiHotspotStatus$, getWifiStatus: getWifiStatus_2.getWifiStatus$, goBackPage: goBackPage_1.goBackPage$, hideLoading: hideLoading_1.hideLoading$, hideToast: hideToast_1.hideToast$, isInTabWindow: isInTabWindow_1.isInTabWindow$, isLocalFileExist: isLocalFileExist_2.isLocalFileExist$, isScreenReaderEnabled: isScreenReaderEnabled_2.isScreenReaderEnabled$, locateInMap: locateInMap_1.locateInMap$, makeCloudCall: makeCloudCall_1.makeCloudCall$, makeVideoConfCall: makeVideoConfCall_1.makeVideoConfCall$, minutesCreateFromVideo: minutesCreateFromVideo_1.minutesCreateFromVideo$, minutesStart: minutesStart_1.minutesStart$, minutesUploadVideo: minutesUploadVideo_1.minutesUploadVideo$, minutesViewDetail: minutesViewDetail_1.minutesViewDetail$, multiSelect: multiSelect_2.multiSelect$, navigateBackPage: navigateBackPage_2.navigateBackPage$, navigateToPage: navigateToPage_2.navigateToPage$, nfcReadCardNumber: nfcReadCardNumber_1.nfcReadCardNumber$, notifyBLECharacteristicValueChange: notifyBLECharacteristicValueChange_1.notifyBLECharacteristicValueChange$, notifyTranslateEvent: notifyTranslateEvent_1.notifyTranslateEvent$, offBLECharacteristicValueChange: offBLECharacteristicValueChange_1.offBLECharacteristicValueChange$, offBLEConnectionStateChanged: offBLEConnectionStateChanged_1.offBLEConnectionStateChanged$, offBluetoothAdapterStateChange: offBluetoothAdapterStateChange_1.offBluetoothAdapterStateChange$, offBluetoothDeviceFound: offBluetoothDeviceFound_1.offBluetoothDeviceFound$, onBLECharacteristicValueChange: onBLECharacteristicValueChange_1.onBLECharacteristicValueChange$, onBLEConnectionStateChanged: onBLEConnectionStateChanged_1.onBLEConnectionStateChanged$, onBLEPeripheralCharacteristicReadRequest: onBLEPeripheralCharacteristicReadRequest_1.onBLEPeripheralCharacteristicReadRequest$, onBLEPeripheralCharacteristicWriteRequest: onBLEPeripheralCharacteristicWriteRequest_1.onBLEPeripheralCharacteristicWriteRequest$, onBLEPeripheralConnectionStateChanged: onBLEPeripheralConnectionStateChanged_1.onBLEPeripheralConnectionStateChanged$, onBeaconServiceChange: onBeaconServiceChange_1.onBeaconServiceChange$, onBeaconUpdate: onBeaconUpdate_1.onBeaconUpdate$, onBluetoothAdapterStateChange: onBluetoothAdapterStateChange_1.onBluetoothAdapterStateChange$, onBluetoothDeviceFound: onBluetoothDeviceFound_1.onBluetoothDeviceFound$, onPlayAudioEnd: onPlayAudioEnd_1.onPlayAudioEnd$, onRecordEnd: onRecordEnd_2.onRecordEnd$, openBluetoothAdapter: openBluetoothAdapter_1.openBluetoothAdapter$, openChatByChatId: openChatByChatId_1.openChatByChatId$, openChatByConversationId: openChatByConversationId_1.openChatByConversationId$, openChatByUserId: openChatByUserId_1.openChatByUserId$, openDocument: openDocument_2.openDocument$, openLink: openLink_2.openLink$, openLocalFile: openLocalFile_2.openLocalFile$, openLocation: openLocation_1.openLocation$, openMicroApp: openMicroApp_1.openMicroApp$, openPageInMicroApp: openPageInMicroApp_1.openPageInMicroApp$, openPageInModalForPC: openPageInModalForPC_1.openPageInModalForPC$, openPageInSlidePanelForPC: openPageInSlidePanelForPC_1.openPageInSlidePanelForPC$, openPageInWorkBenchForPC: openPageInWorkBenchForPC_1.openPageInWorkBenchForPC$, pauseAudio: pauseAudio_1.pauseAudio$, playAudio: playAudio_1.playAudio$, popGesture: popGesture_1.popGesture$, previewFileInDingTalk: previewFileInDingTalk_1.previewFileInDingTalk$, previewImage: previewImage_2.previewImage$, previewImagesInDingTalkBatch: previewImagesInDingTalkBatch_1.previewImagesInDingTalkBatch$, previewMedia: previewMedia_1.previewMedia$, prompt: prompt_2.prompt$, quickCallList: quickCallList_2.quickCallList$, quitPage: quitPage_1.quitPage$, readBLECharacteristicValue: readBLECharacteristicValue_1.readBLECharacteristicValue$, readNFC: readNFC_1.readNFC$, removeCachedAPIResponse: removeCachedAPIResponse_1.removeCachedAPIResponse$, removeStorage: removeStorage_1.removeStorage$, replacePage: replacePage_1.replacePage$, requestAuthCode: requestAuthCode_3.requestAuthCode$, requestMoneySubmmitOrder: requestMoneySubmmitOrder_1.requestMoneySubmmitOrder$, resetScreenView: resetScreenView_1.resetScreenView$, resumeAudio: resumeAudio_1.resumeAudio$, rotateScreenView: rotateScreenView_1.rotateScreenView$, rsa: rsa_2.rsa$, saveFileToDingTalk: saveFileToDingTalk_1.saveFileToDingTalk$, saveImageToPhotosAlbum: saveImageToPhotosAlbum_2.saveImageToPhotosAlbum$, saveVideoToPhotosAlbum: saveVideoToPhotosAlbum_1.saveVideoToPhotosAlbum$, scan: scan_2.scan$, scanCard: scanCard_2.scanCard$, searchMap: searchMap_1.searchMap$, setClipboard: setClipboard_1.setClipboard$, setGestures: setGestures_1.setGestures$, setKeepScreenOn: setKeepScreenOn_1.setKeepScreenOn$, setNavigationIcon: setNavigationIcon_1.setNavigationIcon$, setNavigationLeft: setNavigationLeft_1.setNavigationLeft$, setNavigationTitle: setNavigationTitle_1.setNavigationTitle$, setScreenBrightness: setScreenBrightness_2.setScreenBrightness$, setStorage: setStorage_1.setStorage$, share: share_2.share$, showActionSheet: showActionSheet_1.showActionSheet$, showAuthGuide: showAuthGuide_2.showAuthGuide$, showCallMenu: showCallMenu_2.showCallMenu$, showLoading: showLoading_1.showLoading$, showModal: showModal_1.showModal$, showRecordTabRedDot: showRecordTabRedDot_1.showRecordTabRedDot$, showSharePanel: showSharePanel_2.showSharePanel$, showToast: showToast_1.showToast$, singleSelect: singleSelect_1.singleSelect$, startAdvertising: startAdvertising_1.startAdvertising$, startBeaconDiscovery: startBeaconDiscovery_1.startBeaconDiscovery$, startBluetoothDevicesDiscovery: startBluetoothDevicesDiscovery_1.startBluetoothDevicesDiscovery$, startDingerRecord: startDingerRecord_1.startDingerRecord$, startLocating: startLocating_1.startLocating$, startRecord: startRecord_2.startRecord$, stopAdvertising: stopAdvertising_1.stopAdvertising$, stopAudio: stopAudio_1.stopAudio$, stopBeaconDiscovery: stopBeaconDiscovery_1.stopBeaconDiscovery$, stopBluetoothDevicesDiscovery: stopBluetoothDevicesDiscovery_1.stopBluetoothDevicesDiscovery$, stopDingerRecord: stopDingerRecord_1.stopDingerRecord$, stopLocating: stopLocating_1.stopLocating$, stopPullDownRefresh: stopPullDownRefresh_1.stopPullDownRefresh$, stopRecord: stopRecord_2.stopRecord$, subscribe: subscribe_2.subscribe$, timePicker: timePicker_1.timePicker$, translate: translate_1.translate$, translateVoice: translateVoice_2.translateVoice$, uploadAttachmentToDingTalk: uploadAttachmentToDingTalk_1.uploadAttachmentToDingTalk$, uploadFile: uploadFile_2.uploadFile$, vibrate: vibrate_2.vibrate$, watchShake: watchShake_2.watchShake$, writeBLECharacteristicValue: writeBLECharacteristicValue_1.writeBLECharacteristicValue$, writeBLEPeripheralCharacteristicValue: writeBLEPeripheralCharacteristicValue_1.writeBLEPeripheralCharacteristicValue$, writeNFC: writeNFC_1.writeNFC$, util: { domainStorage: { getItem: getItem_1.getItem$, getStorageInfo: getStorageInfo_1.getStorageInfo$, removeItem: removeItem_1.removeItem$, setItem: setItem_1.setItem$ }, openTemporary: { getData: getData_1.getData$ } } };
    }
  });

  // node_modules/dingtalk-jsapi/entry/mobile.js
  var require_mobile = __commonJS({
    "node_modules/dingtalk-jsapi/entry/mobile.js"(exports, module) {
      "use strict";
      var dd3 = require_core();
      require_android(), require_ios(), require_harmony(), module.exports = dd3;
    }
  });

  // node_modules/dingtalk-jsapi/plugin/coolAppSdk/utils.js
  var require_utils = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/coolAppSdk/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.isMobile = void 0;
      var env_1 = require_env();
      var dingtalkEnv = env_1.getENV();
      var isAndroidDingTalk = function() {
        return dingtalkEnv.platform === env_1.ENV_ENUM.android;
      };
      var isIOSDingTalk = function() {
        return dingtalkEnv.platform === env_1.ENV_ENUM.ios;
      };
      exports.isMobile = isIOSDingTalk() || isAndroidDingTalk();
    }
  });

  // node_modules/dingtalk-jsapi/plugin/coolAppSdk/installToGroup.js
  var require_installToGroup = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/coolAppSdk/installToGroup.js"(exports) {
      "use strict";
      function installCoolAppToGroup(o) {
        return mobile_1._invoke("biz.util.callComponent", { componentType: "h5", params: { url: "/resource-picker/" + (utils_1.isMobile ? "mob" : "index") + ".html?scene=addCoolAppToGroup&params=" + encodeURIComponent(JSON.stringify(o)), target: utils_1.isMobile ? "" : "float", title: "\u9009\u62E9\u7FA4\u6DFB\u52A0\u5E94\u7528", wnId: "addCoolAppToGroup", panelHeight: "percent90" } });
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.installCoolAppToGroup = void 0, require_union();
      var mobile_1 = require_mobile();
      var utils_1 = require_utils();
      exports.installCoolAppToGroup = installCoolAppToGroup;
    }
  });

  // node_modules/dingtalk-jsapi/plugin/coolAppSdk/sendMessageToGroup.js
  var require_sendMessageToGroup = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/coolAppSdk/sendMessageToGroup.js"(exports) {
      "use strict";
      function sendMessageToGroup(e) {
        var o, n = JSON.stringify(e).length;
        return mobile_1._invoke("biz.util.callComponent", { componentType: "h5", params: { url: "/im/cool-app-component.html?corpId=" + encodeURIComponent(null === (o = null === e || void 0 === e ? void 0 : e.context) || void 0 === o ? void 0 : o.corpId) + "#/send-message?params=" + encodeURIComponent(JSON.stringify({ body: e, bodyLengthList: [n] })), target: "float", title: "\u63D0\u793A", wnId: "sendMessageToGroup", panelHeight: "percent83" } });
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.sendMessageToGroup = void 0, require_union();
      var mobile_1 = require_mobile();
      exports.sendMessageToGroup = sendMessageToGroup;
    }
  });

  // node_modules/dingtalk-jsapi/plugin/coolAppSdk/createGroup.js
  var require_createGroup2 = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/coolAppSdk/createGroup.js"(exports) {
      "use strict";
      function createGroup(e) {
        var o;
        return union_1._invoke("biz.util.callComponent", { componentType: "h5", params: { url: "/im/cool-app-component.html?corpId=" + encodeURIComponent(null === (o = null === e || void 0 === e ? void 0 : e.context) || void 0 === o ? void 0 : o.corpId) + "#/create-group?params=" + encodeURIComponent(JSON.stringify(e)), target: "float", title: "\u63D0\u793A", wnId: "createGroup", panelHeight: "percent83" } });
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.createGroup = void 0, require_union();
      var union_1 = require_union();
      exports.createGroup = createGroup;
    }
  });

  // node_modules/dingtalk-jsapi/plugin/coolAppSdk/addMembers.js
  var require_addMembers = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/coolAppSdk/addMembers.js"(exports) {
      "use strict";
      function addMembers(e) {
        var o;
        return mobile_1._invoke("biz.util.callComponent", { componentType: "h5", params: { url: "/im/cool-app-component.html?corpId=" + encodeURIComponent(null === (o = null === e || void 0 === e ? void 0 : e.context) || void 0 === o ? void 0 : o.corpId) + "#/add-members?params=" + encodeURIComponent(JSON.stringify(e)), target: "float", title: "\u63D0\u793A", wnId: "addMembers", panelHeight: "percent83" } });
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.addMembers = void 0, require_union();
      var mobile_1 = require_mobile();
      exports.addMembers = addMembers;
    }
  });

  // node_modules/dingtalk-jsapi/plugin/coolAppSdk/sendMessageToSingleChat.js
  var require_sendMessageToSingleChat = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/coolAppSdk/sendMessageToSingleChat.js"(exports) {
      "use strict";
      function sendMessageToSingleChat(e) {
        var n, o = JSON.stringify(e).length;
        return union_1._invoke("biz.util.callComponent", { componentType: "h5", params: { url: "/im/cool-app-component.html?corpId=" + encodeURIComponent(null === (n = null === e || void 0 === e ? void 0 : e.context) || void 0 === n ? void 0 : n.corpId) + "#/send-message-to-single-chat?params=" + encodeURIComponent(JSON.stringify({ body: e, bodyLengthList: [o] })), target: "float", title: "\u63D0\u793A", wnId: "sendMessageToSingleChat", panelHeight: "percent83" } });
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.sendMessageToSingleChat = void 0, require_union();
      var union_1 = require_union();
      exports.sendMessageToSingleChat = sendMessageToSingleChat;
    }
  });

  // node_modules/dingtalk-jsapi/plugin/coolAppSdk/batchInstallToGroup.js
  var require_batchInstallToGroup = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/coolAppSdk/batchInstallToGroup.js"(exports) {
      "use strict";
      function batchInstallCoolApp(e) {
        var o = Object.assign({}, e, { isBatchApi: true });
        return mobile_1._invoke("biz.util.callComponent", { componentType: "h5", params: { url: "/resource-picker/" + (utils_1.isMobile ? "mob" : "index") + ".html?scene=addCoolAppToGroup&params=" + encodeURIComponent(JSON.stringify(o)), target: utils_1.isMobile ? "" : "float", title: "\u9009\u62E9\u4F1A\u8BDD\u6DFB\u52A0\u5E94\u7528", wnId: "addCoolAppToGroup", panelHeight: "percent90" } });
      }
      Object.defineProperty(exports, "__esModule", { value: true }), exports.batchInstallCoolApp = void 0, require_union();
      var mobile_1 = require_mobile();
      var utils_1 = require_utils();
      exports.batchInstallCoolApp = batchInstallCoolApp;
    }
  });

  // node_modules/dingtalk-jsapi/plugin/coolAppSdk/index.js
  var require_coolAppSdk = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/coolAppSdk/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(e, r, t, o) {
        void 0 === o && (o = t), Object.defineProperty(e, o, { enumerable: true, get: function() {
          return r[t];
        } });
      } : function(e, r, t, o) {
        void 0 === o && (o = t), e[o] = r[t];
      });
      var __exportStar = exports && exports.__exportStar || function(e, r) {
        for (var t in e) "default" === t || r.hasOwnProperty(t) || __createBinding(r, e, t);
      };
      Object.defineProperty(exports, "__esModule", { value: true }), __exportStar(require_installToGroup(), exports), __exportStar(require_sendMessageToGroup(), exports), __exportStar(require_createGroup2(), exports), __exportStar(require_addMembers(), exports), __exportStar(require_sendMessageToSingleChat(), exports), __exportStar(require_batchInstallToGroup(), exports);
    }
  });

  // node_modules/dingtalk-jsapi/plugin/index.js
  var require_plugin = __commonJS({
    "node_modules/dingtalk-jsapi/plugin/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true }), exports.coolAppSdk = void 0;
      var coolAppSdk = require_coolAppSdk();
      exports.coolAppSdk = coolAppSdk;
    }
  });

  // node_modules/dingtalk-jsapi/index.js
  var require_dingtalk_jsapi = __commonJS({
    "node_modules/dingtalk-jsapi/index.js"(exports, module) {
      "use strict";
      var ddWithoutApi = require_union();
      var apiObj_1 = require_apiObj();
      var plugin = require_plugin();
      var dd3 = Object.assign(ddWithoutApi, apiObj_1.apiObj, { plugin });
      module.exports = dd3;
    }
  });

  // scripts/dingtalk-entry.js
  var dd2 = __toESM(require_dingtalk_jsapi(), 1);
  window.requestDingTalkAuthCode = dd2.requestAuthCode;
})();
