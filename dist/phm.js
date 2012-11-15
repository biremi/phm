(function() {

  (function() {
    var exports, self;
    exports = this;
    if (!exports.PHM) exports.PHM = {};
    self = exports.PHM;
    self.WINDOW_FOCUSED = typeof document.hasFocus === "function" ? document.hasFocus() : void 0;
    self.initApp = function() {
      self.initBlurHandler();
      self.initEscHandler();
      return self.initWindowFocus();
    };
    self.initBlurHandler = function() {
      $(document).click(function(e) {
        if ((!$.browser.msie && e.button === 0) || ($.browser.msie && e.button === 1)) {
          return self.processBlur();
        }
      });
      return $(document).focusin(function(event) {
        return self.processBlur();
      });
    };
    self.initEscHandler = function() {
      return $(document).keyup(function(e) {
        if (e.which === PHM.ui.escapeKeyCode) return self.processEsc();
      });
    };
    self.initWindowFocus = function() {
      $(window).focus(function() {
        self.WINDOW_FOCUSED = true;
        return PHM.utils.stopBlinkTitle();
      });
      return $(window).blur(function() {
        return self.WINDOW_FOCUSED = false;
      });
    };
    self.throwException = function(type, text) {
      throw "PHM Exception (" + type + "): " + text;
    };
    self.processBlur = function() {
      var focusWidget;
      focusWidget = PHM.app.focusWidget;
      if (focusWidget != null) {
        focusWidget.fireBlur();
        return PHM.app.focusWidget = null;
      }
    };
    self.processEsc = function() {
      var focusWidget;
      focusWidget = PHM.app.focusWidget;
      if ((focusWidget != null) && focusWidget.blurOnEscape) {
        focusWidget.fireBlur();
        return PHM.app.focusWidget = null;
      }
    };
    self.requestAnimationFrame = function(callback) {
      var fn;
      fn = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(job) {
        return setTimeout(function() {
          return job(Date.now());
        }, 0);
      };
      return fn.call(window, callback);
    };
    return self.doAsync = function(callback) {
      return setTimeout(function() {
        return callback.call();
      }, 0);
    };
  })();

}).call(this);

/*
PHM.log module
*/

(function() {

  (function() {
    var addTrailingZero, exports, getHours, getMilliseconds, getMinutes, getSeconds, getTimestamp, logToConsole, self;
    exports = this;
    self = exports.PHM.log = {};
    self.info = function(message) {
      return logToConsole('info', message);
    };
    self.error = function(message) {
      return logToConsole('error', message);
    };
    logToConsole = function(logLevel, message) {
      var log, ts;
      ts = getTimestamp();
      log = function(obj) {
        return console[logLevel](obj);
      };
      if (typeof message === 'string') {
        return log("[" + ts + "] " + message);
      } else {
        log("[" + ts + "]");
        return log(message);
      }
    };
    getTimestamp = function() {
      var hours, milliseconds, minutes, seconds, time;
      time = new Date();
      hours = getHours(time);
      minutes = getMinutes(time);
      seconds = getSeconds(time);
      milliseconds = getMilliseconds(time);
      return "" + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    };
    getHours = function(time) {
      return addTrailingZero(time.getHours());
    };
    getMinutes = function(time) {
      return addTrailingZero(time.getMinutes());
    };
    getSeconds = function(time) {
      return addTrailingZero(time.getSeconds());
    };
    getMilliseconds = function(time) {
      var ms;
      ms = time.getMilliseconds();
      if (ms < 10) {
        return "00" + ms;
      } else if (ms < 100) {
        return "0" + ms;
      } else {
        return "" + ms;
      }
    };
    return addTrailingZero = function(number) {
      if (number < 10) {
        return "0" + number;
      } else {
        return "" + number;
      }
    };
  })();

}).call(this);

/*
PHM.utils module
*/

(function() {

  (function() {
    var exports, self, time12h, to2DigitFormat;
    exports = this;
    self = exports.PHM.utils = {};
    self.uniqIdShift = 0;
    self.extend = function(obj, mixin) {
      var method, name;
      for (name in mixin) {
        method = mixin[name];
        obj[name] = method;
      }
      return obj;
    };
    self.include = function(klass, mixin) {
      return self.extend(klass.prototype, mixin);
    };
    self.generateUniqId = function() {
      var time;
      time = new Date();
      return time.getTime() + "_" + self.uniqIdShift++;
    };
    self.blinkTitle = function(message, oldTitle) {
      self.blinksLeft = 10;
      return self.doBlinkTick(message, oldTitle);
    };
    self.doBlinkTick = function(message, oldTitle) {
      if (self.blinksLeft <= 0) return;
      self.blinksLeft -= 1;
      document.title = message;
      return setTimeout(function() {
        document.title = oldTitle;
        return setTimeout(function() {
          return self.doBlinkTick(message, oldTitle);
        }, 1000);
      }, 1000);
    };
    self.stopBlinkTitle = function() {
      return self.blinksLeft = 0;
    };
    self.formatTimeUTCtoLocal = function(secondsUTC) {
      var date, time;
      date = new Date();
      date.setTime(secondsUTC * 1000);
      if (self.isUSATime()) {
        time = time12h(date.getHours(), to2DigitFormat(date.getMinutes()));
        return "" + (date.getFullYear()) + "-" + (to2DigitFormat(date.getMonth() + 1)) + "-" + (to2DigitFormat(date.getDate())) + " " + time;
      } else {
        return "" + (date.getFullYear()) + "-" + (to2DigitFormat(date.getMonth() + 1)) + "-" + (to2DigitFormat(date.getDate())) + " " + (to2DigitFormat(date.getHours())) + ":" + (to2DigitFormat(date.getMinutes()));
      }
    };
    to2DigitFormat = function(number) {
      if (number < 10) {
        return "0" + number;
      } else {
        return number;
      }
    };
    time12h = function(hours, minutes) {
      var sufix;
      sufix = "AM";
      if (hours >= 12) {
        hours -= 12;
        sufix = "PM";
      }
      if (hours === 0) hours = 12;
      return "" + hours + ":" + minutes + " " + sufix;
    };
    self.getTimeOffset = function() {
      var jan1, jan2, now, offset, temp;
      now = new Date();
      jan1 = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      temp = jan1.toGMTString();
      jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));
      return offset = (jan1 - jan2) / (1000 * 60 * 60);
    };
    self.isUSATime = function() {
      var offset;
      offset = self.getTimeOffset();
      return (offset >= -10) && (offset <= -5);
    };
    self.capitalize = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    self.loadScript = function(sScriptSrc, callbackfunction) {
      var loadFunction, oHead, oScript;
      oHead = document.getElementsByTagName("head")[0];
      if (oHead) {
        oScript = document.createElement("script");
        oScript.setAttribute("src", sScriptSrc);
        oScript.setAttribute("type", "text/javascript");
        loadFunction = function() {
          if (this.readyState === "complete" || this.readyState === "loaded") {
            return callbackfunction();
          }
        };
        oScript.onreadystatechange = loadFunction;
        oScript.onload = callbackfunction;
        return oHead.appendChild(oScript);
      }
    };
    self.pageUrlParams = function() {
      return $.url(window.location.search).param();
    };
    return false;
  })();

}).call(this);

/*
PHM.utils.Cookie module
*/

(function() {

  (function() {
    var calculateExpireTime, exports, getDomain, self;
    exports = this;
    self = exports.PHM.utils.Cookie = {};
    self.set = function(name, value, seconds) {
      var domain, expires;
      expires = calculateExpireTime(seconds);
      domain = ";domain=." + getDomain();
      return document.cookie = name + "=" + value + domain + expires + "; path=/";
    };
    self.get = function(name) {
      var cookie, _i, _len, _ref;
      name += "=";
      _ref = document.cookie.split(';');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cookie = _ref[_i];
        cookie = $.trim(cookie);
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
      return null;
    };
    self["delete"] = function(name) {
      return self.set(name, "", -60 * 60 * 24);
    };
    calculateExpireTime = function(seconds) {
      var date;
      if (!seconds) return "";
      date = new Date;
      date.setTime(date.getTime() + (seconds * 1000));
      return "; expires=" + date.toGMTString();
    };
    return getDomain = function() {
      return window.location.hostname.replace(/([a-zA-Z0-9/-]+.)/, "");
    };
  })();

}).call(this);

/*
PHM.utils.errorMessage module
*/

(function() {

  (function() {
    var exports, self;
    exports = this;
    self = exports.PHM.utils.errorMessage = {};
    self.get = function(displayName, error) {
      var message, text;
      message = self.commonMessages[error];
      if (!(message != null)) {
        console.warn('unexpected error message: ' + error);
        message = error;
      }
      text = message.replace('\{\{displayName\}\}', displayName);
      return PHM.utils.capitalize(text);
    };
    return self.commonMessages = {
      "empty": "enter your {{displayName}} please",
      "blank_value": "enter your {{displayName}} please",
      "nil_value": "enter your {{displayName}} please",
      "too_big": "{{displayName}} is too big",
      "too_small": "{{displayName}} is too small",
      "not_an_integer": "{{displayName}} should be valid number",
      "should_be_positive": "{{displayName}} should be positive number",
      "too_short": "{{displayName}} is too short",
      "already_taken": "such {{displayName}} is already taken",
      "too_long": "{{displayName}} is too long",
      "incorrect_domain": "non-existent email domain",
      "incorrect_format": "{{displayName}} has invalid format",
      "invalid_string_format": "{{displayName}} has illegal characters",
      "invalid_format": "{{displayName}} has invalid format",
      "invalid_url": "URL is invalid",
      "invalid": "invalid {{displayName}}",
      "float_received_instead_of_integer": "{{displayName}} should be integer number",
      "younger_than_13": "you should be at least 13 years old",
      "user_is_banned": "You have been banned"
    };
  })();

}).call(this);

/*
PHM.utils.number module
*/

(function() {

  (function() {
    var exports, self;
    exports = this;
    self = exports.PHM.utils.number = {};
    return self.shorten = function(number) {
      var abbreviations, result;
      result = Number(number);
      if (isNaN(result)) return "";
      abbreviations = {
        'K': 1000,
        'M': 1000000,
        'B': 1000000000
      };
      _(abbreviations).each(function(value, key) {
        var base, shortNumber;
        base = Number(number) / value;
        if (base >= 1) {
          if (Math.abs(base % 1) > 0.1) {
            shortNumber = base.toFixed(1);
          } else {
            shortNumber = base.toFixed(0);
          }
          return result = "" + shortNumber + key;
        }
      });
      return result;
    };
  })();

}).call(this);

/*
PHM.app module
*/

(function() {

  (function() {
    var checkRegisteredSingletonWidget, checkRegisteredWidget, checkWidgetClass, createWidget, exports, registerSingletonWidget, registerWidget, removeFromParentWidget, self, unregisterSingletonWidget, unregisterWidget, validateWidgetContext;
    exports = this;
    self = exports.PHM.app = {
      widgetClasses: {},
      widgets: {},
      models: {},
      db: {},
      behaviors: {},
      css_behaviors: {},
      eventsList: {
        "comet": {},
        "area": {},
        "widget": {},
        "control": {}
      },
      focusWidget: null
    };
    self.hasWidget = function(className, contextId) {
      var collection;
      collection = self.widgets[className];
      return (collection != null) && (collection[contextId] != null);
    };
    self.registerWidgetClass = function(className, widgetClass, viewPath) {
      if (viewPath == null) viewPath = null;
      self.widgetClasses[className] = widgetClass;
      widgetClass.prototype.className = className;
      return widgetClass.prototype.viewPath = viewPath || className;
    };
    self.addWidget = function(className, contextId, placeholder, params) {
      var widget;
      checkWidgetClass(className);
      validateWidgetContext(className, contextId);
      checkRegisteredWidget(className, contextId);
      widget = createWidget(className, contextId, params);
      widget.appendTo(placeholder, params != null ? params.prepend : void 0);
      registerWidget(widget, contextId);
      if (widget.postInit != null) widget.postInit();
      return widget;
    };
    self.addSingletonWidget = function(className, placeholder, params) {
      var widget;
      checkWidgetClass(className);
      checkRegisteredSingletonWidget(className);
      widget = createWidget(className, "singleton", params);
      widget.appendTo(placeholder, params != null ? params.prepend : void 0);
      registerSingletonWidget(widget);
      if (widget.postInit != null) widget.postInit();
      return widget;
    };
    self.removeWidget = function(className, contextId) {
      var widget;
      widget = self.getWidget(className, contextId);
      if (widget != null) {
        widget.removeChildren();
        widget.remove();
        unregisterWidget(widget);
        removeFromParentWidget(widget);
        return delete widget;
      }
    };
    self.removeSingletonWidget = function(className) {
      var widget;
      widget = self.getSingletonWidget(className);
      if (widget != null) {
        widget.remove();
        unregisterSingletonWidget(widget);
        removeFromParentWidget(widget);
        return delete widget;
      }
    };
    self.removeClassWidgets = function(className) {
      return _(PHM.app.widgets[className]).each(function(widget) {
        return PHM.app.removeWidget(widget.className, widget.contextId);
      });
    };
    self.getWidget = function(className, contextId) {
      var _ref;
      return (_ref = self.widgets[className]) != null ? _ref[contextId] : void 0;
    };
    self.getSingletonWidget = function(className) {
      return self.widgets[className];
    };
    self.withWidget = function(className, contextId, callback) {
      var widget;
      widget = self.getWidget(className, contextId);
      if (widget != null) return callback.call(widget);
    };
    self.withSingletonWidget = function(className, callback) {
      var widget;
      widget = self.getSingletonWidget(className);
      if (widget != null) return callback.call(widget);
    };
    self.blurredAt = new Date();
    self.lastBlurredTime = 0;
    self.observeBlurredTime = function() {
      $(window).blur(function() {
        self.blurredAt = new Date();
        return self.lastBlurredTime = 0;
      });
      return $(window).focus(function() {
        var now;
        now = new Date();
        return self.lastBlurredTime = now.getTime() - self.blurredAt.getTime();
      });
    };
    createWidget = function(className, contextId, params) {
      var widget, widgetClass;
      widgetClass = self.widgetClasses[className];
      return widget = new widgetClass(contextId, params);
    };
    checkWidgetClass = function(className) {
      var widgetClass;
      widgetClass = self.widgetClasses[className];
      if (!(widgetClass != null)) {
        return PHM.throwException("widgetClass", "" + className + " not found in application");
      }
    };
    validateWidgetContext = function(className, contextId) {
      var widgetClass;
      if (!(contextId != null)) {
        PHM.throwException("widget", "can't add widget " + className + " without contextId");
      }
      widgetClass = self.widgetClasses[className];
      if (widgetClass.validateContext != null) {
        return widgetClass.validateContext(contextId);
      }
    };
    checkRegisteredWidget = function(className, contextId) {
      var collection;
      collection = self.widgets[className];
      if ((collection != null) && (collection[contextId] != null)) {
        return PHM.throwException("widget", "" + className + ", id: " + contextId + " already registered in app");
      }
    };
    checkRegisteredSingletonWidget = function(className) {
      if (self.widgets[className] != null) {
        return PHM.throwException("widget", "singleton " + className + " already registered in app");
      }
    };
    registerWidget = function(widget, contextId) {
      if (!(self.widgets[widget.className] != null)) {
        self.widgets[widget.className] = {};
      }
      return self.widgets[widget.className][contextId] = widget;
    };
    registerSingletonWidget = function(widget) {
      return self.widgets[widget.className] = widget;
    };
    unregisterWidget = function(widget) {
      return delete self.widgets[widget.className][widget.contextId];
    };
    unregisterSingletonWidget = function(widget) {
      return delete self.widgets[widget.className];
    };
    return removeFromParentWidget = function(widget) {
      var idx, parent;
      if (widget.parentWidget != null) {
        parent = widget.parentWidget;
        idx = _(parent.children).indexOf(widget);
        if (idx != null) return parent.children.splice(idx, 1);
      }
    };
  })();

}).call(this);

/*
PHM.ui module
*/

(function() {

  (function() {
    var createLibraryElement, exports, getLibraryElementClass, self;
    exports = this;
    self = exports.PHM.ui = {
      Library: {}
    };
    self.enterKeyCode = 13;
    self.escapeKeyCode = 27;
    self.getSelector = function(jsClass, wrapperId) {
      if (wrapperId == null) wrapperId = null;
      if (wrapperId != null) {
        return $("#" + wrapperId + " [data-jsclass=" + jsClass + "]");
      } else {
        return $("[data-jsclass=" + jsClass + "]");
      }
    };
    self.renderView = function(viewPath, params) {
      if (JST[viewPath] != null) {
        return JST[viewPath](params);
      } else {
        return PHM.throwException("ui", "missing template: " + viewPath);
      }
    };
    self.appendView = function(viewPath, placeholder, params) {
      var view;
      view = self.renderView(viewPath, params);
      return placeholder.append(view);
    };
    self.registerLibraryElement = function(type, elementClass, viewPath) {
      if (viewPath == null) viewPath = null;
      self.Library[type] = elementClass;
      elementClass.prototype.type = type;
      return elementClass.prototype.viewPath = viewPath || ("library/" + type);
    };
    self.addLibraryElement = function(type, placeholder) {
      var element;
      element = createLibraryElement(type, placeholder);
      element.replace(placeholder);
      return element;
    };
    self.hideTokens = function() {
      return HIDE_TOKENS === 1;
    };
    createLibraryElement = function(type, placeholder) {
      var element, elementClass;
      elementClass = getLibraryElementClass(type);
      element = new elementClass(placeholder);
      return element;
    };
    return getLibraryElementClass = function(type) {
      var elementClass;
      elementClass = PHM.ui.Library[type];
      if (!(elementClass != null)) {
        PHM.throwException("ui", "invalid UI element type: " + type);
      }
      return elementClass;
    };
  })();

}).call(this);

/*
PHM.eventsDispatcher module
*/

(function() {

  (function() {
    var addAreaEventHandler, addCometEventHandler, addControlEventHandler, addEventHandler, addWidgetEventHandler, controlEventName, eventsList, exports, getEventHandlers, handleAreaEvent, handleEvent, handleSimpleEvent, self, widgetEventName;
    exports = this;
    self = exports.PHM.eventsDispatcher = {};
    exports.PHM.events = self;
    eventsList = PHM.app.eventsList;
    self.fireAreaEvent = function(eventName, data) {
      return handleAreaEvent(eventName, data);
    };
    self.fireCometEvent = function(eventName, data) {
      return self.handleCometEvent(eventName, data);
    };
    self.onArea = function(eventName, handler) {
      return addAreaEventHandler(eventName, handler);
    };
    self.onComet = function(eventName, handler) {
      return addCometEventHandler(eventName, handler);
    };
    self.onWidget = function(widgetClass, eventName, handler) {
      return addWidgetEventHandler(widgetClass, eventName, handler);
    };
    self.onControl = function(widgetClass, controlName, eventName, handler) {
      return addControlEventHandler(widgetClass, controlName, eventName, handler);
    };
    addCometEventHandler = function(eventName, handler) {
      return addEventHandler("comet", eventName, handler);
    };
    addAreaEventHandler = function(eventName, handler) {
      return addEventHandler("area", eventName, handler);
    };
    addWidgetEventHandler = function(widgetClass, eventName, handler) {
      var eventFullName;
      eventFullName = widgetEventName(widgetClass, eventName);
      return addEventHandler("widget", eventFullName, handler);
    };
    addControlEventHandler = function(widgetClass, controlName, eventName, handler) {
      var eventFullName;
      eventFullName = "" + widgetClass + "-" + controlName + "-" + eventName;
      return addEventHandler("control", eventFullName, handler);
    };
    addEventHandler = function(eventSource, eventName, handler) {
      var handlers;
      handlers = getEventHandlers(eventSource, eventName);
      if (_(handlers).size() === 0) {
        return eventsList[eventSource][eventName] = [handler];
      } else {
        return handlers.push(handler);
      }
    };
    handleAreaEvent = function(eventName, data) {
      return handleSimpleEvent("area", eventName, data);
    };
    self.handleCometEvent = function(eventName, data) {
      return handleSimpleEvent("comet", eventName, data);
    };
    self.handleWidgetEvent = function(widget, eventName, data) {
      var eventFullName;
      eventFullName = widgetEventName(widget.className, eventName);
      return handleEvent("widget", widget, eventFullName, data);
    };
    self.handleControlEvent = function(control, eventName, data) {
      var eventFullName, widgetClass;
      widgetClass = control.parentWidget.className;
      eventFullName = controlEventName(widgetClass, control.name, eventName);
      return handleEvent("control", control, eventFullName, data);
    };
    getEventHandlers = function(eventSource, eventName) {
      return eventsList[eventSource][eventName] || [];
    };
    widgetEventName = function(widgetClass, eventName) {
      return "" + widgetClass + "-" + eventName;
    };
    controlEventName = function(widgetClass, controlName, eventName) {
      return "" + widgetClass + "-" + controlName + "-" + eventName;
    };
    handleEvent = function(source, caller, name, data) {
      var handler, handlers, _i, _len, _results;
      if (data == null) data = null;
      PHM.log.info("Event: caller: " + caller + ", source: " + source + ", data: " + data + ", name: " + name);
      handlers = getEventHandlers(source, name);
      _results = [];
      for (_i = 0, _len = handlers.length; _i < _len; _i++) {
        handler = handlers[_i];
        _results.push(handler.call(caller, data));
      }
      return _results;
    };
    return handleSimpleEvent = function(source, name, data) {
      var handler, handlers, _i, _len, _results;
      if (data == null) data = null;
      PHM.log.info("Simple event: source: " + source + ", data: " + data + ", name: " + name);
      handlers = getEventHandlers(source, name);
      _results = [];
      for (_i = 0, _len = handlers.length; _i < _len; _i++) {
        handler = handlers[_i];
        _results.push(handler.call(null, data));
      }
      return _results;
    };
  })();

}).call(this);

/*
PHM.comet module
*/

(function() {

  (function() {
    var exports, self;
    exports = this;
    self = exports.PHM.comet = {};
    self.client = null;
    self.on = function(eventName, handler) {
      return PHM.eventsDispatcher.onComet(eventName, handler);
    };
    self.dispatchEvent = function(eventName, data) {
      if (self.bufferEvents) {
        return self.addToBuffer(eventName, data);
      } else {
        return self.handleCometEvent(eventName, data);
      }
    };
    self.flushBuffer = function() {
      _(self.buffer).each(function(event) {
        try {
          return self.handleCometEvent(event.name, event.data);
        } catch (error) {
          return PHM.log.error(error);
        }
      });
      return self.bufferEvents = false;
    };
    self.addToBuffer = function(eventName, data) {
      PHM.log.info("buffered " + eventName);
      return self.buffer.push({
        name: eventName,
        data: data
      });
    };
    self.handleCometEvent = function(eventName, data) {
      return setTimeout(function() {
        return PHM.eventsDispatcher.handleCometEvent(eventName, data);
      }, 0);
    };
    self.init = function(host, port, channel) {
      self.client = new PHM.comet.Client();
      self.client.connect(host, port, channel);
      self.buffer = [];
      return self.bufferEvents = true;
    };
    return self.disconnect = function() {
      PHM.log.info("started comet disconnection");
      try {
        PHM.comet.client.disconnect();
        return PHM.log.info("disconnection: closing connection");
      } catch (e) {
        return PHM.log.info("ERROR on disconnect: " + e.name + " : " + e.message);
      }
    };
  })();

  (function() {
    var Client, exports;
    exports = this;
    Client = (function() {

      function Client() {
        this.sockets = [];
        this.transports = [];
      }

      Client.prototype.connect = function(host, port, channel) {
        var portPart, protoPart, url;
        port = Number(port);
        portPart = (port === 80 || port === 443 ? "" : ":" + port);
        protoPart = (port === 443 ? "https:" : "http:");
        url = "" + protoPart + "//" + host + portPart;
        PHM.log.info("Comet url:" + url);
        if (typeof io === "undefined") {
          PHM.log.error("Comet isn't activated");
          return;
        }
        return this.sio = this.initSocketIO(url, {
          authQuery: "sio_channel=" + channel
        });
      };

      Client.prototype.disconnect = function() {
        PHM.log.info("do disconnect");
        if (this.sio) return this.sio.disconnect();
      };

      Client.prototype.initSocketIO = function(url, details) {
        var self, socket;
        self = this;
        socket = io.connect(url, details);
        PHM.log.info("Current socket.id: " + socket.socket.sessionid);
        PHM.log.info(socket);
        socket.on("connect", function() {
          self.sockets.push(socket.socket);
          self.transports.push(socket.socket.transport);
          PHM.log.info("Connected to comet-server(" + socket.socket.sessionid + ")");
          return PHM.log.info(socket);
        });
        socket.on("message", function(msg) {
          var nameWithData;
          PHM.log.info("SessionID: " + socket.socket.sessionid);
          PHM.log.info("Message(Q): " + msg);
          try {
            nameWithData = jQuery.parseJSON(msg);
            return PHM.comet.dispatchEvent(nameWithData[0], nameWithData[1]);
          } catch (e) {
            PHM.log.error("ERROR evaluating frame body: " + e.name + ":" + e.message);
            PHM.log.info(e);
            return PHM.log.info("on msg: " + msg);
          }
        });
        socket.on("reconnect", function() {
          PHM.log.info("Comet: Reconnected to the server");
          PHM.log.info("Current socket.id: " + socket.socket.sessionid);
          return PHM.log.info(socket);
        });
        socket.on("reconnecting", function() {
          return PHM.log.info("Comet: Attempting to re-connect to the server");
        });
        socket.on("disconnect", function() {
          return PHM.log.info("Comet: sio was disconnected");
        });
        socket.on("error", function(e) {
          PHM.log.info(e);
          return PHM.log.error("Comet", (e ? e : "An unknown error occurred"));
        });
        return socket;
      };

      return Client;

    })();
    return exports.PHM.comet.Client = Client;
  })();

}).call(this);

/*
PHM.server module
*/

(function() {

  (function() {
    var buildErrorCallback, buildSuccessCallback, exports, self;
    exports = this;
    self = exports.PHM.server = {};
    /*
      Common API
    */
    self.doPostCall = function(params) {
      return PHM.server.doAJAXCall('POST', params);
    };
    self.doPutCall = function(params) {
      return PHM.server.doAJAXCall('PUT', params);
    };
    self.doGetCall = function(params) {
      return PHM.server.doAJAXCall('GET', params);
    };
    self.doDeleteCall = function(params) {
      return PHM.server.doAJAXCall('DELETE', params);
    };
    self.parseResponse = function(text) {
      return $.parseJSON(text);
    };
    self.doAJAXCall = function(type, params) {
      if (!params.dataType) params.dataType = 'html';
      return $.ajax({
        type: type,
        url: params.url,
        dataType: params.dataType,
        data: params.data,
        success: buildSuccessCallback(params),
        error: buildErrorCallback(params)
      });
    };
    /*
      Common Helpers
    */
    buildSuccessCallback = function(params) {
      return function(data, text_status) {
        var response;
        if (params.dataType === 'json' || params.dataType === 'jsonp') {
          response = data;
        } else if (params.dataType === 'script') {
          response = {
            status: text_status
          };
        } else if (params.dataType === 'text') {
          response = data;
        } else {
          response = PHM.server.parseResponse(data);
        }
        PHM.log.info(response);
        switch (response.status) {
          case "ok":
            if ((response.message != null) && response.message === 'system_logout') {
              document.location = response.data.url;
            }
            if (params.success) return params.success(response);
            break;
          case "success":
            return params.success();
          case "error":
            PHM.log.error(response);
            if (params.error) return params.error(response);
            break;
          default:
            return PHM.log.info("Unexpected status: " + response.status);
        }
      };
    };
    return buildErrorCallback = function(params) {
      return function(data) {
        var options;
        options = {
          status: 'error',
          message: 'Critical server error',
          data: ''
        };
        PHM.log.error(params);
        if (params.error) return params.error(options);
      };
    };
  })();

}).call(this);

/*
PHM.sound module

How it works:

1. Put WAV soundfile into app/sounds (say app/sounds/poker/fun_sound_effect.wav)
2. Run rake sounds:compile (you must have Lame and Oggenc installed)
3. Call PHM.sound.init() on page load
4. Call PHM.sound.play('poker/fun_sound_effect') when you need it
*/

(function() {

  (function() {
    var exports, self;
    exports = this;
    self = exports.PHM.sound = {};
    self.skipAll = false;
    self.effects = {};
    self.addEffect = function(effectName, url) {
      return self.effects[effectName] = new buzz.sound(url, {
        formats: ['mp3', 'ogg'],
        preload: true
      });
    };
    self.init = function() {
      return _(self.catalog).each(function(url, name) {
        return self.addEffect(name, url);
      });
    };
    self.play = function(effectName) {
      if (self.skipAll) return;
      return self.effects[effectName].play();
    };
    return self.toggleMute = function(state) {
      if (arguments.length === 0) {
        return _(self.effects).each(function(sound) {
          return sound.toggleMute();
        });
      } else if (state) {
        return _(self.effects).each(function(sound) {
          return sound.mute();
        });
      } else {
        return _(self.effects).each(function(sound) {
          return sound.unmute();
        });
      }
    };
  })();

}).call(this);

/*
PHM.routing module
Based on jquer-bbq-plugin: http://benalman.com/projects/jquery-bbq-plugin/
*/

(function() {

  (function() {
    var doNavigation, escapeRegExp, exports, extractParameters, namedParam, navigateTo, parseURL, routeToRegExp, self, splatParam, updateHash;
    exports = this;
    self = exports.PHM.routing = {};
    namedParam = /:\w+/g;
    splatParam = /\*\w+/g;
    escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;
    self.routes = [];
    self.rootUrl = null;
    self.redirectStack = [];
    self.redirectStackDepthLimit = 2;
    self.init = function() {
      $(window).bind('hashchange', function(e) {
        var url;
        url = $.param.fragment().substr(1);
        if (url === '') {
          if (self.rootUrl != null) return self.redirectTo(self.rootUrl);
        } else {
          return doNavigation(url);
        }
      });
      return $(window).trigger('hashchange');
    };
    self.redirectTo = function(url) {
      if (_(self.redirectStack).size() >= self.redirectStackDepthLimit) {
        return PHM.throwException("routing", "redirect stack is too deep!: " + self.redirectStack);
      } else {
        self.redirectStack.push(url);
        return updateHash("!" + url);
      }
    };
    self.addRoute = function(route, callback) {
      var preparedRoute, routeExists;
      routeExists = _(self.routes).any(function(route) {
        return route.name === route;
      });
      if (routeExists) {
        PHM.throwException("routing", "route already exists: " + route);
      }
      preparedRoute = {
        name: route,
        regexp: routeToRegExp(route),
        callback: callback
      };
      return self.routes.push(preparedRoute);
    };
    doNavigation = function(url) {
      if (self.beforeNavigation != null) {
        return self.beforeNavigation(url, function() {
          return navigateTo(url);
        });
      } else {
        return navigateTo(url);
      }
    };
    navigateTo = function(url) {
      var params, route, _ref;
      _ref = parseURL(url) || [null, null], route = _ref[0], params = _ref[1];
      if (route != null) {
        route.callback.call(null, params);
        return self.redirectStack = [];
      } else {
        PHM.log.info("PHM:routing: Route not found for url: " + url);
        if (self.rootUrl != null) return self.redirectTo(self.rootUrl);
      }
    };
    parseURL = function(url) {
      var matched, params;
      matched = _(self.routes).find(function(route) {
        return route.regexp.test(url);
      });
      if (matched != null) {
        params = extractParameters(matched.regexp, url);
        return [matched, params];
      }
    };
    routeToRegExp = function(route) {
      route = route.replace(escapeRegExp, '\\$&').replace(namedParam, '([^\/]+)').replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    };
    extractParameters = function(routeRegexp, url) {
      return routeRegexp.exec(url).slice(1);
    };
    return updateHash = function(hash) {
      return location.hash = hash;
    };
  })();

}).call(this);

/*
PHM.commonBehaviours module
*/

(function() {

  (function() {
    var exports, self;
    exports = this;
    self = exports.PHM.commonBehaviours = {};
    return self.isLightbox = function(widgetClassName) {
      var klass;
      klass = PHM.app.widgetClasses[widgetClassName];
      if (klass != null) {
        klass.prototype.blurOnEscape = true;
        klass.prototype.show = function() {
          this.setFocus();
          return klass.__super__.show.call(this);
        };
        klass.prototype.hide = function() {
          this.removeFocus();
          return klass.__super__.hide.call(this);
        };
      }
      PHM.events.onControl(widgetClassName, 'overlayLabel', 'click', function() {
        return this.parentWidget.hide();
      });
      PHM.events.onControl(widgetClassName, 'closeButton', 'click', function() {
        this.parentWidget.hide();
        return this.stopLoading();
      });
      return PHM.events.onWidget(widgetClassName, 'blur', function() {
        return this.hide();
      });
    };
  })();

}).call(this);

/*
PHM.ui.Element module
*/

(function() {

  (function() {
    var exports;
    exports = this;
    return exports.PHM.ui.Element = {
      addClass: function(name) {
        return $("#" + this.elementId).addClass(name);
      },
      removeClass: function(name) {
        return $("#" + this.elementId).removeClass(name);
      },
      toggleClass: function(name) {
        return $("#" + this.elementId).toggleClass(name);
      },
      hasClass: function(name) {
        return $("#" + this.elementId).hasClass(name);
      },
      addChildElementClass: function(selector, name) {
        var element;
        element = this.getChildElement(selector);
        return element.addClass(name);
      },
      removeChildElementClass: function(selector, name) {
        var element;
        element = this.getChildElement(selector);
        return element.removeClass(name);
      },
      toggleChildElementClass: function(selector, name) {
        var element;
        element = this.getChildElement(selector);
        return element.toggleClass(name);
      },
      show: function() {
        return this.removeClass('state-hidden');
      },
      toggle: function() {
        return this.toggleClass('state-hidden');
      },
      hide: function() {
        return this.addClass('state-hidden');
      },
      isHidden: function() {
        return this.hasClass('state-hidden');
      },
      isVisible: function() {
        return !this.isHidden();
      },
      startLoading: function() {
        this.addClass('loading');
        return this.disableClick();
      },
      stopLoading: function() {
        this.removeClass('loading');
        return this.enableClick();
      },
      disable: function() {
        this.addClass('disabled');
        return this.disableClick();
      },
      enable: function() {
        this.removeClass('disabled');
        return this.enableClick();
      },
      disableClick: function() {
        return this.disabled = true;
      },
      enableClick: function() {
        return this.disabled = false;
      },
      isDisabled: function() {
        return (this.disabled != null) && this.disabled === true;
      },
      activate: function() {
        return this.addClass('active');
      },
      deactivate: function() {
        return this.removeClass('active');
      },
      isActive: function() {
        return this.hasClass('active');
      },
      setIdle: function() {
        return this.addClass('idle');
      },
      removeIdle: function() {
        return this.removeClass('idle');
      },
      getChildElement: function(selector) {
        return $("#" + this.elementId + " [data-jsclass=" + selector + "]");
      },
      showChildElement: function(selector) {
        return this.removeChildElementClass(selector, 'state-hidden');
      },
      hideChildElement: function(selector) {
        return this.addChildElementClass(selector, 'state-hidden');
      },
      focusChildElement: function(selector) {
        return this.getChildElement(selector).focus();
      },
      toggleChildElement: function(selector) {
        var element;
        element = this.getChildElement(selector);
        return element.toggleClass('state-hidden');
      },
      setChildElementText: function(selector, text) {
        var element;
        element = this.getChildElement(selector);
        return element.text(text);
      },
      getChildElementText: function(selector) {
        var element;
        element = this.getChildElement(selector);
        return element.text();
      },
      setChildElementValue: function(selector, value) {
        var element;
        element = this.getChildElement(selector);
        return element.val(value);
      },
      getChildElementValue: function(selector) {
        var element;
        element = this.getChildElement(selector);
        return element != null ? element.val() : void 0;
      },
      emptyChildElement: function(selector) {
        var element;
        element = this.getChildElement(selector);
        return element.empty();
      },
      isChildElementVisible: function(selector) {
        var element;
        element = this.getChildElement(selector);
        return !element.hasClass('state-hidden');
      }
    };
  })();

}).call(this);

/*
PHM.ui.CommonWidget module
*/

(function() {

  (function() {
    var exports;
    exports = this;
    return exports.PHM.ui.CommonWidget = {
      renderView: function() {
        var params;
        params = this.prepareRenderParams != null ? this.prepareRenderParams() : this.params || {};
        params.elementId = this.elementId;
        if (this.contextId != null) params.contextId = this.contextId;
        return PHM.ui.renderView(this.template || this.viewPath, params);
      },
      getElement: function() {
        return $("#" + this.elementId);
      },
      bindClick: function(callback) {
        var element, _this;
        if (callback == null) callback = null;
        element = this.getElement();
        _this = this;
        element.click(function(event) {
          if (!_this.isDisabled()) {
            if (callback != null) callback.call(_this);
            _this.fireEvent("click");
          }
          if ((_this.hasFocus != null) && _this.hasFocus === true) {
            return event.stopPropagation();
          }
        });
        return this.clickBinded = true;
      },
      setFocus: function() {
        var _this = this;
        return setTimeout(function() {
          _this.hasFocus = true;
          PHM.app.focusWidget = _this;
          _this.addClass('focus');
          if (_this.clickBinded == null) return _this.bindClick();
        }, 0);
      },
      removeFocus: function() {
        var _this = this;
        return setTimeout(function() {
          var focusWidget;
          _this.hasFocus = false;
          _this.removeClass('focus');
          focusWidget = PHM.app.focusWidget;
          if ((focusWidget != null) && focusWidget === _this) {
            return PHM.app.focusWidget = null;
          }
        }, 0);
      },
      fireBlur: function() {
        this.hasFocus = false;
        this.removeClass('focus');
        return this.fireEvent("blur");
      },
      getSelector: function(jsClass) {
        return PHM.ui.getSelector(jsClass, this.elementId);
      },
      remove: function() {
        return this.getElement().remove();
      }
    };
  })();

}).call(this);

/*
PHM.ui.Control class
*/

(function() {

  (function() {
    var Control, exports;
    exports = this;
    Control = (function() {

      function Control(element) {
        this.elementId = "" + this.type + "-" + (PHM.utils.generateUniqId());
        if (this.parseProperties != null) this.parseProperties(element);
        this.parseCommonProperties(element);
        this.params = {};
      }

      Control.prototype.parseCommonProperties = function(element) {
        return this.keepChildren = $(element).attr('keepChildren');
      };

      Control.prototype.replace = function(placeholder) {
        var classes, contents, html;
        html = this.renderView();
        classes = placeholder.attr('class');
        contents = $(placeholder).html();
        placeholder.replaceWith(html);
        if (this.keepChildren) this.getElement().append(contents);
        if (this.postInit != null) this.postInit();
        return this.getElement().addClass(classes);
      };

      Control.prototype.fireEvent = function(eventName, data) {
        if (data == null) data = null;
        return PHM.eventsDispatcher.handleControlEvent(this, eventName, data);
      };

      Control.prototype.uniqueId = function() {
        return "control-" + this.parentWidget.className + "-" + this.parentWidget.contextId + "-" + this.name;
      };

      return Control;

    })();
    PHM.utils.include(Control, PHM.ui.Element);
    PHM.utils.include(Control, PHM.ui.CommonWidget);
    exports.PHM.ui.Control = Control;
    return false;
  })();

}).call(this);

/*
PHM.ui.Widget class
*/

(function() {

  (function() {
    var Widget, checkIfNameTaken, exports, findLibraryElements;
    exports = this;
    Widget = (function() {

      function Widget(contextId, params) {
        this.contextId = contextId;
        this.params = params;
        this.elementId = "" + this.className + "-" + this.contextId;
        this.children = [];
        if (this.params != null) this.template = this.params.template;
      }

      Widget.prototype.appendTo = function(placeholder, prepend) {
        var html;
        if (prepend == null) prepend = false;
        html = this.renderView();
        if (prepend) {
          placeholder.prepend(html);
        } else {
          placeholder.append(html);
        }
        return this.addLibraryElements();
      };

      Widget.prototype.addWidget = function(className, contextId, jsClass, params) {
        var placeholder, widget;
        if (params == null) params = null;
        placeholder = PHM.ui.getSelector(jsClass, this.elementId);
        widget = PHM.app.addWidget(className, contextId, placeholder, params);
        this.children.push(widget);
        widget.parentWidget = this;
        return widget;
      };

      Widget.prototype.addSingletonWidget = function(className, jsClass, params) {
        var placeholder, widget;
        if (params == null) params = null;
        placeholder = PHM.ui.getSelector(jsClass, this.elementId);
        return widget = PHM.app.addSingletonWidget(className, placeholder, params);
      };

      Widget.prototype.removeChildren = function() {
        var childrenInfo;
        childrenInfo = _(this.children).map(function(child) {
          var info;
          return info = {
            className: child.className,
            contextId: child.contextId
          };
        });
        return _(childrenInfo).each(function(childInfo) {
          return PHM.app.removeWidget(childInfo.className, childInfo.contextId);
        });
      };

      Widget.prototype.removeWidget = function(className, contextId) {
        PHM.app.removeWidget(className, contextId);
        return this.children = _(this.children).reject(function(widget) {
          return (widget.className === className) && (widget.contextId === contextId);
        });
      };

      Widget.prototype.addLibraryElements = function() {
        var element, libraryElements, _i, _len, _results;
        libraryElements = findLibraryElements(this.getElement());
        _results = [];
        for (_i = 0, _len = libraryElements.length; _i < _len; _i++) {
          element = libraryElements[_i];
          _results.push(this.addLibraryElement($(element)));
        }
        return _results;
      };

      Widget.prototype.addLibraryElement = function(placeholder) {
        var name, type;
        type = placeholder.attr('type');
        name = placeholder.attr('name');
        checkIfNameTaken(this, name);
        return this.createLibraryElement(name, type, placeholder);
      };

      Widget.prototype.createLibraryElement = function(name, type, placeholder) {
        var element;
        element = PHM.ui.addLibraryElement(type, placeholder);
        this[name] = element;
        element.name = name;
        return element.parentWidget = this;
      };

      Widget.prototype.appendView = function(jsClass, viewPath, params) {
        var placeholder;
        placeholder = PHM.ui.getSelector(jsClass, this.elementId);
        return PHM.ui.appendView(viewPath, placeholder, params);
      };

      Widget.prototype.defineTabs = function(tabs) {
        var _this = this;
        if (!(this.tabs != null)) {
          this.tabs = tabs;
        } else {
          _(tabs).each(function(value, key) {
            return _this.tabs[key] = value;
          });
        }
        return this.bindTabs();
      };

      Widget.prototype.bindTabs = function() {
        var _this = this;
        return _(this.tabs).each(function(selector, name) {
          return PHM.events.onControl(_this.className, name, 'click', function() {
            return _this.activateTab(name);
          });
        });
      };

      Widget.prototype.activateTab = function(tabName) {
        var _this = this;
        return _(this.tabs).each(function(selector, name) {
          if (name === tabName) {
            _this[name].addClass('active');
            return _this.showChildElement(selector);
          } else {
            _this[name].removeClass('active');
            return _this.hideChildElement(selector);
          }
        });
      };

      Widget.prototype.fireEvent = function(eventName, data) {
        if (data == null) data = null;
        return PHM.eventsDispatcher.handleWidgetEvent(this, eventName, data);
      };

      Widget.prototype.uniqueId = function() {
        return "widget-" + this.className + "-" + this.contextId;
      };

      Widget.prototype.appendView = function(selector, templateName, params) {
        var html, placeholder;
        if (params == null) params = {};
        html = PHM.ui.renderView(templateName, params);
        placeholder = this.getChildElement(selector);
        return placeholder.append(html);
      };

      return Widget;

    })();
    findLibraryElements = function(element) {
      return element.find('uilibrary');
    };
    checkIfNameTaken = function(widget, name) {
      if (widget[name] != null) {
        return PHM.throwException("widget", "element with name: " + name + " already taken in " + widget.elementId);
      }
    };
    PHM.utils.include(Widget, PHM.ui.Element);
    PHM.utils.include(Widget, PHM.ui.CommonWidget);
    exports.PHM.ui.Widget = Widget;
    return false;
  })();

}).call(this);

/*
 Library::Button class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var Button;
    Button = (function(_super) {

      __extends(Button, _super);

      function Button() {
        Button.__super__.constructor.apply(this, arguments);
      }

      Button.prototype.parseProperties = function(element) {
        this.defaultText = $(element).attr('text');
        this.removeDefaultClass = $(element).attr('remove-default-class');
        return this.template = $(element).attr('template');
      };

      Button.prototype.prepareRenderParams = function() {
        return {
          text: this.defaultText
        };
      };

      Button.prototype.postInit = function() {
        this.bindClick(function() {
          return this.startLoading();
        });
        if (this.removeDefaultClass) return this.removeClass('button');
      };

      Button.prototype.setText = function(text) {
        return this.setChildElementText('text', text);
      };

      Button.prototype.getText = function() {
        return this.getChildElementText('text');
      };

      return Button;

    })(PHM.ui.Control);
    return PHM.ui.registerLibraryElement("button", Button);
  })();

}).call(this);

/*
 Library::ButtonWithTooltip class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var ButtonWithTooltip;
    ButtonWithTooltip = (function(_super) {

      __extends(ButtonWithTooltip, _super);

      function ButtonWithTooltip() {
        ButtonWithTooltip.__super__.constructor.apply(this, arguments);
      }

      ButtonWithTooltip.prototype.parseProperties = function(element) {
        this.tooltipText = $(element).attr('tooltip');
        return ButtonWithTooltip.__super__.parseProperties.call(this, element);
      };

      ButtonWithTooltip.prototype.postInit = function() {
        this.setTooltip(this.tooltipText);
        return ButtonWithTooltip.__super__.postInit.call(this);
      };

      ButtonWithTooltip.prototype.prepareRenderParams = function() {
        return {
          text: this.defaultText,
          tooltipText: this.tooltipText
        };
      };

      ButtonWithTooltip.prototype.setTooltip = function(text) {
        var refined;
        if (text === '') {
          return this.hideChildElement('tooltip');
        } else {
          refined = PHM.utils.number.shorten(text);
          this.setChildElementText('tooltip', refined);
          return this.showChildElement('tooltip');
        }
      };

      return ButtonWithTooltip;

    })(PHM.ui.Library.button);
    return PHM.ui.registerLibraryElement("button_with_tooltip", ButtonWithTooltip);
  })();

}).call(this);

/*
 Library::ChatTab class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var ChatTab;
    ChatTab = (function(_super) {

      __extends(ChatTab, _super);

      function ChatTab() {
        ChatTab.__super__.constructor.apply(this, arguments);
      }

      ChatTab.prototype.parseProperties = function(element) {};

      ChatTab.prototype.prepareRenderParams = function() {
        var params;
        return params = {};
      };

      ChatTab.prototype.incUnreadCount = function() {
        if (this.unread_count < 99) {
          return this.setUnreadCount(this.unread_count + 1);
        } else {
          return this.setUnreadCount('∞');
        }
      };

      ChatTab.prototype.setUnreadCount = function(count) {
        this.unread_count = count;
        this.getElement().toggleClass('is-unread', this.unread_count > 0);
        this.getSelector('new-chat-messages').toggleClass('state-hidden', this.unread_count === 0);
        return this.getSelector('new-chat-messages').text(count);
      };

      ChatTab.prototype.postInit = function() {
        this.bindClick();
        return this.unread_count = 0;
      };

      return ChatTab;

    })(PHM.ui.Control);
    return PHM.ui.registerLibraryElement("chat_tab", ChatTab);
  })();

}).call(this);

/*
 Library::Checkbox class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var Checkbox;
    Checkbox = (function(_super) {

      __extends(Checkbox, _super);

      function Checkbox() {
        Checkbox.__super__.constructor.apply(this, arguments);
      }

      Checkbox.prototype.parseProperties = function(element) {
        this.label = $(element).attr('label');
        this.checked = $(element).attr('checked') || false;
        this.template = $(element).attr('template');
        return this.toggleClass = $(element).attr('toggle-class') || 'selected';
      };

      Checkbox.prototype.prepareRenderParams = function() {
        return {
          label: this.label
        };
      };

      Checkbox.prototype.postInit = function() {
        this.bindEvents();
        if (this.checked) return this.check();
      };

      Checkbox.prototype.setLable = function(label) {
        return this.setChildElementText('label', label);
      };

      Checkbox.prototype.bindEvents = function() {
        var _this = this;
        return this.getElement().click(function() {
          return _this.toggleCheck(true);
        });
      };

      Checkbox.prototype.toggleCheck = function(auto) {
        if (auto == null) auto = false;
        if (this.isChecked()) {
          this.uncheck();
        } else {
          this.check();
        }
        if (auto) return this.fireEvent('state-changed');
      };

      Checkbox.prototype.isChecked = function() {
        return this.hasClass(this.toggleClass);
      };

      Checkbox.prototype.check = function() {
        return this.addClass(this.toggleClass);
      };

      Checkbox.prototype.uncheck = function() {
        return this.removeClass(this.toggleClass);
      };

      return Checkbox;

    })(PHM.ui.Control);
    return PHM.ui.registerLibraryElement("checkbox", Checkbox);
  })();

}).call(this);

/*
 Library::Countdown class
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var Countdown;
    Countdown = (function(_super) {

      __extends(Countdown, _super);

      function Countdown() {
        this.fireEndCallback = __bind(this.fireEndCallback, this);
        Countdown.__super__.constructor.apply(this, arguments);
      }

      Countdown.prototype.parseProperties = function(element) {
        this.description = $(element).attr('desc');
        this.layout = $(element).attr('with_layout');
        return this.countdownTime = 0;
      };

      Countdown.prototype.alreadyStarted = function() {
        return this.countdownTime > 0;
      };

      Countdown.prototype.start = function(countdownTime) {
        var countdown, layout, params;
        this.countdownTime = parseInt(countdownTime);
        countdown = this.getChildElement('countdown');
        params = {
          until: '+' + countdownTime + 's',
          compact: true,
          description: this.description,
          onExpiry: this.fireEndCallback
        };
        if (this.layout) {
          layout = this.getChildElement('layout');
          params['layout'] = layout.html();
        }
        return countdown.countdown(params);
      };

      Countdown.prototype.fireEndCallback = function() {
        this.stop();
        return this.fireEvent("countdown_ended");
      };

      Countdown.prototype.stop = function() {
        var countdown;
        this.countdownTime = 0;
        countdown = this.getChildElement('countdown');
        return countdown.countdown('destroy');
      };

      return Countdown;

    })(PHM.ui.Control);
    return PHM.ui.registerLibraryElement("countdown", Countdown);
  })();

}).call(this);

/*
 Library::DatePicker class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var DatePicker, monthList;
    DatePicker = (function(_super) {

      __extends(DatePicker, _super);

      function DatePicker() {
        DatePicker.__super__.constructor.apply(this, arguments);
      }

      DatePicker.prototype.parseProperties = function(element) {
        this.template = $(element).attr('template');
        return this.isShort = $(element).attr('short') === 'true';
      };

      DatePicker.prototype.postInit = function() {
        this.year = this.getChildElement('year');
        this.month = this.getChildElement('month');
        this.day = this.getChildElement('day');
        return this.bindEvents();
      };

      DatePicker.prototype.prepareRenderParams = function() {
        var params, _i, _j, _results, _results2;
        return params = {
          years: (function() {
            _results = [];
            for (_i = 1999; _i >= 1920; _i--){ _results.push(_i); }
            return _results;
          }).apply(this),
          months: monthList(this.isShort),
          days: (function() {
            _results2 = [];
            for (_j = 1; _j <= 31; _j++){ _results2.push(_j); }
            return _results2;
          }).apply(this)
        };
      };

      DatePicker.prototype.showError = function(error) {
        var errorMessage;
        switch (error) {
          case 'cant_be_nil':
            return this.showNilValueError();
          default:
            errorMessage = PHM.utils.errorMessage.get(this.name, error);
            return this.showAllFieldsError(errorMessage);
        }
      };

      DatePicker.prototype.showNilValueError = function() {
        var _this = this;
        this.hideError();
        return _(this.fields()).each(function(field) {
          if (_this[field].val() === '-1') {
            return _this.showFieldError(field, "Select " + field + " please");
          }
        });
      };

      DatePicker.prototype.showAllFieldsError = function(text) {
        var _this = this;
        return _(this.fields()).each(function(field) {
          return _this.showFieldError(field, text);
        });
      };

      DatePicker.prototype.showFieldError = function(field, text) {
        this.addChildElementClass("" + field + "-label", 'is-error');
        return this.setChildElementText("" + field + "-error-text", text);
      };

      DatePicker.prototype.hideFieldError = function(field) {
        return this.removeChildElementClass("" + field + "-label", 'is-error');
      };

      DatePicker.prototype.hideError = function() {
        var _this = this;
        return _(this.fields()).each(function(field) {
          return _this.hideFieldError(field);
        });
      };

      DatePicker.prototype.fields = function() {
        return ['day', 'month', 'year'];
      };

      DatePicker.prototype.getValue = function() {
        if (this.year.val() === '-1' || this.month.val() === '-1' || this.day.val() === '-1') {
          return '';
        } else {
          return this.day.val() + "-" + this.month.val() + "-" + this.year.val();
        }
      };

      DatePicker.prototype.bindEvents = function() {
        var _this = this;
        return _(this.fields()).each(function(field) {
          _this.bindFieldFocus(field);
          _this.bindFieldFocusin(field);
          return _this.bindFieldChange(field);
        });
      };

      DatePicker.prototype.isFilled = function() {
        var _this = this;
        return _(this.fields()).all(function(field) {
          return _this[field].val() !== '-1';
        });
      };

      DatePicker.prototype.hasValue = function() {
        var _this = this;
        return _(this.fields()).any(function(field) {
          return _this[field].val() !== '-1';
        });
      };

      DatePicker.prototype.bindFieldFocus = function(field) {
        var select,
          _this = this;
        select = this.getChildElement(field);
        return select.focus(function() {
          var caption;
          caption = _this.getChildElement("" + field).find("option[value=-1]");
          return caption.remove();
        });
      };

      DatePicker.prototype.bindFieldFocusin = function(field) {
        var select,
          _this = this;
        select = this.getChildElement(field);
        return select.focusin(function(event) {
          if (_this.hasFocus) {
            return event.stopPropagation();
          } else {
            return _this.setFocus();
          }
        });
      };

      DatePicker.prototype.bindFieldChange = function(field) {
        var select,
          _this = this;
        select = this.getChildElement(field);
        return select.change(function() {
          if (_this.isFilled()) return _this.fireEvent("value_changed");
        });
      };

      return DatePicker;

    })(PHM.ui.Control);
    monthList = function(isShort) {
      var months;
      months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
      };
      if (isShort === true) {
        _(months).each(function(value, key) {
          return months[key] = value.slice(0, 3);
        });
      }
      return months;
    };
    return PHM.ui.registerLibraryElement("date_picker", DatePicker);
  })();

}).call(this);

/*
 Library::Label class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var Label;
    Label = (function(_super) {

      __extends(Label, _super);

      function Label() {
        Label.__super__.constructor.apply(this, arguments);
      }

      Label.prototype.parseProperties = function(element) {
        this.text = $(element).attr('text');
        this.template = $(element).attr('template');
        return this.block = $(element).attr('block');
      };

      Label.prototype.prepareRenderParams = function() {
        return {
          text: this.text,
          block: this.block
        };
      };

      Label.prototype.postInit = function() {
        return this.bindClick();
      };

      Label.prototype.setText = function(txt) {
        return this.getElement().html(txt);
      };

      return Label;

    })(PHM.ui.Control);
    PHM.ui.registerLibraryElement("label", Label);
    return false;
  })();

}).call(this);

/*
 Library::Slider class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var Slider;
    Slider = (function(_super) {

      __extends(Slider, _super);

      function Slider() {
        Slider.__super__.constructor.apply(this, arguments);
      }

      Slider.fireEventTimeout = 200;

      Slider.prototype.parseProperties = function(element) {
        this.template = $(element).attr('template');
        this.minValue = Number($(element).attr('minvalue'));
        this.maxValue = Number($(element).attr('maxvalue'));
        if ($(element).attr('step') != null) {
          return this.step = Number($(element).attr('step'));
        } else {
          return this.step = 1;
        }
      };

      Slider.prototype.postInit = function() {
        this.movedBuffer = 0;
        this.updateTrackPosition();
        this.bindMouseUpDown();
        return this.bindClick();
      };

      Slider.prototype.bindMouseUpDown = function() {
        var handler,
          _this = this;
        handler = function(event) {
          return _this.trackMoveHandler(event);
        };
        this.getChildElement('track').mousedown(function(event) {
          if (_this.isDisabled()) return;
          event.preventDefault();
          _this.movedBuffer = 0;
          _this.saveLastTrackPosition(event);
          _this.clickDisabled = true;
          return $(document).mousemove(handler);
        });
        return $(document).mouseup(function() {
          $(document).unbind('mousemove', handler);
          return _this.clickDisabled = false;
        });
      };

      Slider.prototype.bindClick = function() {
        var _this = this;
        return this.getElement().click(function(event) {
          var differenceX, toMove;
          if (_this.isDisabled()) return;
          differenceX = _this.getTrackPositionDifference(event);
          toMove = _this.moveOnClick(differenceX);
          return _this.onTrackPositionMoved(toMove);
        });
      };

      Slider.prototype.trackMoveHandler = function(event) {
        var valueChange;
        this.movedBuffer += this.getTrackPositionDifference(event);
        this.saveLastTrackPosition(event);
        valueChange = this.movedValue(this.movedBuffer);
        if (Math.abs(valueChange) >= this.step) {
          this.updateMovedBuffer(valueChange);
          return this.onTrackPositionMoved(valueChange);
        }
      };

      Slider.prototype.updateMovedBuffer = function(valueChange) {
        var move;
        move = Math.round(valueChange * this.sliderWidth() / (this.step * this.valueInterval())) * this.step;
        return this.movedBuffer -= move;
      };

      Slider.prototype.updateTrackPosition = function() {
        var _ref;
        return this.lastTrackPosition = ((_ref = this.getChildElement('track').offset()) != null ? _ref.left : void 0) + 7;
      };

      Slider.prototype.saveLastTrackPosition = function(event) {
        return this.lastTrackPosition = event.pageX;
      };

      Slider.prototype.getTrackPositionDifference = function(event) {
        return this.lastTrackPosition - event.pageX;
      };

      Slider.prototype.onTrackPositionMoved = function(valueChange) {
        var _this = this;
        this.setValue(this.value - valueChange);
        if (this.moveEventFireTimer == null) {
          return this.moveEventFireTimer = setTimeout(function() {
            _this.fireEvent('value_changed');
            clearTimeout(_this.moveEventFireTimer);
            return delete _this.moveEventFireTimer;
          }, Slider.fireEventTimeout);
        }
      };

      Slider.prototype.setLimits = function(min, max) {
        this.minValue = Number(min);
        return this.maxValue = Number(max);
      };

      Slider.prototype.setValue = function(value) {
        var refinedValue;
        refinedValue = this.refineValue(value);
        this.value = refinedValue;
        this.setTrackPosition(refinedValue);
        this.setTooltipValue(refinedValue);
        return this.updateTrackPosition();
      };

      Slider.prototype.getValue = function() {
        return this.value;
      };

      Slider.prototype.getTrackPosition = function() {
        var position;
        position = this.getChildElement('track').css('right');
        return Number(position.replace(/px/, ''));
      };

      Slider.prototype.setTrackPosition = function(value) {
        var completePercentage;
        completePercentage = this.completePercentage(value);
        this.getChildElement('track').css('right', '-18px');
        return this.getChildElement('completed').width("" + completePercentage + "%");
      };

      Slider.prototype.setTooltipValue = function(value) {
        return this.setChildElementText('tooltip', value);
      };

      Slider.prototype.refineValue = function(value) {
        var refinedValue;
        refinedValue = value;
        if (value < this.minValue) refinedValue = this.minValue;
        if (value > this.maxValue) refinedValue = this.maxValue;
        return refinedValue;
      };

      Slider.prototype.valueInterval = function() {
        return this.maxValue - this.minValue;
      };

      Slider.prototype.completePercentage = function(value) {
        var completePercentage;
        return completePercentage = (value - this.minValue) * 100 / this.valueInterval();
      };

      Slider.prototype.movedValue = function(moved) {
        return Math.round(moved * this.valueInterval() / (this.step * this.sliderWidth())) * this.step;
      };

      Slider.prototype.moveOnClick = function(difference) {
        if (difference > 0) {
          return this.step;
        } else {
          return -this.step;
        }
      };

      Slider.prototype.sliderWidth = function() {
        return this.getChildElement('scrollbar').width();
      };

      return Slider;

    })(PHM.ui.Control);
    return PHM.ui.registerLibraryElement("slider", Slider);
  })();

}).call(this);

/*
 Library::Tab class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var Tab;
    Tab = (function(_super) {

      __extends(Tab, _super);

      function Tab() {
        Tab.__super__.constructor.apply(this, arguments);
      }

      Tab.prototype.parseProperties = function(element) {
        this.text = $(element).attr('text');
        return this.label = $(element).attr('label');
      };

      Tab.prototype.prepareRenderParams = function() {
        var params;
        return params = {
          text: this.text,
          label: this.label
        };
      };

      Tab.prototype.postInit = function() {
        return this.bindClick();
      };

      return Tab;

    })(PHM.ui.Control);
    return PHM.ui.registerLibraryElement("tab", Tab);
  })();

}).call(this);

/*
 Library::TextInput class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var TextInput;
    TextInput = (function(_super) {

      __extends(TextInput, _super);

      function TextInput() {
        TextInput.__super__.constructor.apply(this, arguments);
      }

      TextInput.prototype.parseProperties = function(element) {
        this.defaultValue = $(element).attr('default');
        this.template = $(element).attr('template');
        this.maxLength = $(element).attr('maxlength');
        this.predefinedValue = $(element).attr('value');
        this.placeholder = $(element).attr('placeholder');
        return this.name = $(element).attr('name');
      };

      TextInput.prototype.prepareRenderParams = function() {
        return {
          maxLength: this.maxLength,
          placeholder: this.placeholder,
          name: this.name
        };
      };

      TextInput.prototype.postInit = function() {
        this.setDefaultValue();
        if (this.predefinedValue != null) this.setValue(this.predefinedValue);
        return this.bindEvents();
      };

      TextInput.prototype.focus = function() {
        return this.focusChildElement('input');
      };

      TextInput.prototype.bindEvents = function() {
        var input;
        input = this.getChildElement('input');
        input.unbind();
        this.bindInputFocus(input);
        return this.bindInputBlur(input);
      };

      TextInput.prototype.bindInputFocus = function(input) {
        var _this = this;
        return input.focus(function() {
          _this.removeDefaultValue();
          return _this.setFocus();
        });
      };

      TextInput.prototype.bindInputBlur = function(input) {
        var _this = this;
        return input.blur(function() {
          return _this.setDefaultValue();
        });
      };

      TextInput.prototype.removeDefaultValue = function() {
        if (this.getChildElementValue('input') === this.defaultValue) {
          this.setValue('');
        }
        return this.removeIdle();
      };

      TextInput.prototype.setDefaultValue = function() {
        if (this.getChildElementValue('input') === '') {
          this.setChildElementValue('input', this.defaultValue);
          return this.setIdle();
        }
      };

      TextInput.prototype.setValue = function(value) {
        return this.setChildElementValue('input', value);
      };

      TextInput.prototype.getValue = function() {
        var rawValue, value;
        rawValue = this.getChildElementValue('input');
        value = $.trim(rawValue);
        if (value === this.defaultValue) {
          return '';
        } else {
          return value;
        }
      };

      TextInput.prototype.hasValue = function() {
        return this.getValue() !== '';
      };

      TextInput.prototype.bindValueChange = function(callback) {
        var input,
          _this = this;
        if (callback == null) callback = null;
        input = this.getChildElement('input');
        return input.keydown(function() {
          return _this.processValueChange(callback);
        });
      };

      TextInput.prototype.processValueChange = function(callback) {
        var prevValue,
          _this = this;
        prevValue = this.getValue();
        return setTimeout(function() {
          if (prevValue !== _this.getValue()) {
            if (callback != null) callback.call(_this);
            return _this.fireEvent("value_changed");
          }
        }, 1);
      };

      TextInput.prototype.bindSubmit = function(callback) {
        var input,
          _this = this;
        if (callback == null) callback = null;
        input = this.getChildElement('input');
        return input.keypress(function(e) {
          if (e.which === PHM.ui.enterKeyCode) {
            if (callback != null) callback.call(_this);
            return _this.fireEvent("submit");
          }
        });
      };

      TextInput.prototype.disable = function() {
        this.getChildElement('input').attr('disabled', true);
        return TextInput.__super__.disable.call(this);
      };

      TextInput.prototype.enable = function() {
        this.getChildElement('input').attr('disabled', false);
        return TextInput.__super__.enable.call(this);
      };

      TextInput.prototype.showError = function(error) {
        var errorMessage;
        this.addClass('is-error');
        errorMessage = PHM.utils.errorMessage.get(this.name, error);
        return this.setChildElementText('error-text', errorMessage);
      };

      TextInput.prototype.hideError = function() {
        return this.removeClass('is-error');
      };

      return TextInput;

    })(PHM.ui.Control);
    return PHM.ui.registerLibraryElement("text_input", TextInput);
  })();

}).call(this);

/*
 Library::ToggleTab class
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function() {
    var ToggleTab;
    ToggleTab = (function(_super) {

      __extends(ToggleTab, _super);

      function ToggleTab() {
        ToggleTab.__super__.constructor.apply(this, arguments);
      }

      ToggleTab.prototype.parseProperties = function(element) {
        this.text = $(element).attr('text');
        this.label = $(element).attr('label');
        return this.state = !!$(element).attr('state');
      };

      ToggleTab.prototype.prepareRenderParams = function() {
        var params;
        return params = {
          text: this.text,
          label: this.label,
          stateClass: this.stateClass()
        };
      };

      ToggleTab.prototype.toggle = function(state) {
        if (arguments.length === 0) {
          this.state = !this.state;
        } else {
          this.state = !!state;
        }
        return this.getElement().toggleClass('is-pressed', this.state);
      };

      ToggleTab.prototype.stateClass = function() {
        if (this.state) {
          return 'is-pressed';
        } else {
          return '';
        }
      };

      ToggleTab.prototype.postInit = function() {
        return this.bindClick();
      };

      return ToggleTab;

    })(PHM.ui.Control);
    return PHM.ui.registerLibraryElement("toggle_tab", ToggleTab);
  })();

}).call(this);
