// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.easeInOutCubic = exports.getCurrentTimeInMillis = exports.appendCanvasToDOM = exports.create2dCanvas = void 0;

var create2dCanvas = function create2dCanvas() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

exports.create2dCanvas = create2dCanvas;

var appendCanvasToDOM = function appendCanvasToDOM(canvas) {
  document.body.appendChild(canvas);
};

exports.appendCanvasToDOM = appendCanvasToDOM;

var getCurrentTimeInMillis = function getCurrentTimeInMillis() {
  var date = new Date();
  var millisInASecond = 1000;
  var secondsInAMinute = 60;
  var minutesInAnHour = 60;
  var millisInAMinute = secondsInAMinute * millisInASecond;
  var millisInAnHour = minutesInAnHour * millisInAMinute;
  return date.getHours() * millisInAnHour + date.getMinutes() * millisInAMinute + date.getSeconds() * millisInASecond + date.getMilliseconds();
};

exports.getCurrentTimeInMillis = getCurrentTimeInMillis;

var easeInOutCubic = function easeInOutCubic(x) {
  // This code is from https://easings.net/#easeInOutCubic
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

exports.easeInOutCubic = easeInOutCubic;
},{}],"clock-renderer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _clock = require("./clock");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Configuration options
var CanvasMargin = 10;
var OuterCircleStrokeColor = '#92949C';
var CenterCircleRadius = 2;
var CenterCircleLineWidth = 3;
var CenterCircleStrokeColor = '#0C3D4A';
var CenterCircleFillColor = '#353535';
var HourMarkLength = 10;
var HourMarkWidth = 2;
var HourMarkColor = '#466B76';
var HoursHandleToWatchRadiusRatio = 0.7;
var HoursHandleWidth = 2;
var HoursHandleColor = '#000000';
var MinutesMarkLength = 5;
var MinutesMarkWidth = 1;
var MinutesMarkColor = '#C4D1D5';
var MinutesHandleWidth = 0.8;
var MinutesHandleToWatchRadiusRatio = 0.8;
var MinutesHandleColor = '#000000';
var SecondsHandleWidth = 0.5;
var SecondsHandleToWatchRadiusRatio = 0.9;
var SecondsHandleColor = '#ff0000';
var SecondsTailToWatchRadiusRatio = 0.1;
var CangeModeAnimationDurationMillis = 500;

var ClockRenderer = /*#__PURE__*/function () {
  function ClockRenderer(canvas, backgroundCanvas, clockState) {
    _classCallCheck(this, ClockRenderer);

    this.canvas = canvas;
    this.backgroundCanvas = backgroundCanvas;
    this.state = clockState;
    this.ctx = canvas.getContext('2d');
    this.backgroundCtx = backgroundCanvas.getContext('2d');
    this.regularModeIcon = document.getElementById('regular-mode-icon');
    this.stopWatchModeIcon = document.getElementById('stopwatch-mode-icon');
    this.canvasHalfWidth = canvas.width / 2;
    this.canvasHalfHeight = canvas.height / 2;
    this.circleRadians = Math.PI * 2;
    this.changeModeAnimationStart = 0;
    this.renderBackgroundToOffscreenCanvas();
  }

  _createClass(ClockRenderer, [{
    key: "switchModeIcons",
    value: function switchModeIcons() {
      var elementToEnable = this.state.clockMode === _clock.ClockMode.RegularToStopWatch ? this.stopWatchModeIcon : this.regularModeIcon;
      var elementToDisable = this.state.clockMode === _clock.ClockMode.RegularToStopWatch ? this.regularModeIcon : this.stopWatchModeIcon;
      elementToEnable.classList.add("active");
      elementToDisable.classList.remove("active");
    }
  }, {
    key: "renderBackgroundToOffscreenCanvas",
    value: function renderBackgroundToOffscreenCanvas() {
      this.renderCirclesToBackgroundCanvas();
      this.renderMarksToBackgroundCanvas();
    }
  }, {
    key: "renderCirclesToBackgroundCanvas",
    value: function renderCirclesToBackgroundCanvas() {
      this.renderCircles(this.backgroundCtx);
    }
  }, {
    key: "renderCircles",
    value: function renderCircles(ctx) {
      ctx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
      ctx.arc(this.canvasHalfWidth, this.canvasHalfHeight, Math.min(this.canvasHalfWidth, this.canvasHalfHeight) - CanvasMargin, 0, this.circleRadians);
      ctx.strokeStyle = OuterCircleStrokeColor;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.canvasHalfWidth, this.canvasHalfHeight, CenterCircleRadius, 0, this.circleRadians);
      ctx.lineWidth = CenterCircleLineWidth;
      ctx.fillStyle = CenterCircleFillColor;
      ctx.strokeStyle = CenterCircleStrokeColor;
      ctx.stroke();
    }
  }, {
    key: "renderMarksToBackgroundCanvas",
    value: function renderMarksToBackgroundCanvas() {
      this.renderMarks(this.backgroundCtx);
    }
  }, {
    key: "renderMarks",
    value: function renderMarks(ctx) {
      var outerRadius = Math.min(this.canvasHalfWidth, this.canvasHalfHeight) - CanvasMargin;

      for (var i = 0; i < 60; ++i) {
        if (i % 5 === 0) {
          var angle = this.computeCircleAngle(i, 12);
          this.renderMark(ctx, angle, outerRadius, HourMarkLength, HourMarkWidth, HourMarkColor);
        } else {
          var _angle = this.computeCircleAngle(i, 60);

          this.renderMark(ctx, _angle, outerRadius, MinutesMarkLength, MinutesMarkWidth, MinutesMarkColor);
        }
      }
    }
  }, {
    key: "computeCircleAngle",
    value: function computeCircleAngle(index, total) {
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return this.circleRadians * (index / total) - offset;
    }
  }, {
    key: "renderMark",
    value: function renderMark(ctx, angle, outerStart, length, lineWidth, color) {
      var angleSin = Math.sin(angle);
      var angleCos = Math.cos(angle);
      var x1 = this.canvasHalfWidth + angleCos * outerStart;
      var y1 = this.canvasHalfHeight + angleSin * outerStart;
      var x2 = this.canvasHalfWidth + angleCos * (outerStart - length);
      var y2 = this.canvasHalfHeight + angleSin * (outerStart - length);
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }, {
    key: "draw",
    value: function draw(step) {
      var _this = this;

      this.clear();
      this.drawBackground();
      this.drawForeground(step);
      requestAnimationFrame(function (frameStep) {
        return _this.draw(frameStep);
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "drawBackground",
    value: function drawBackground() {
      this.ctx.drawImage(this.backgroundCanvas, 0, 0);
    }
  }, {
    key: "drawForeground",
    value: function drawForeground(step) {
      this.drawHandles(step);
    }
  }, {
    key: "drawHandles",
    value: function drawHandles(step) {
      if (this.state.clockMode === _clock.ClockMode.Regular) {
        this.renderRegularModeHandles();
      } else if (this.state.clockMode === _clock.ClockMode.StopWatch) this.renderStopWatchModeHandles(this.state.stopWatchMillis);else if (this.state.clockMode === _clock.ClockMode.RegularToStopWatch || this.state.clockMode === _clock.ClockMode.StopWatchToRegular) this.renderModeChangeAnimation(step);else if (this.state.clockMode === _clock.ClockMode.ResettingStopWatch) this.renderResetStopWatch(step);
    }
  }, {
    key: "renderRegularModeHandles",
    value: function renderRegularModeHandles() {
      var currentTimeMillis = (0, _utils.getCurrentTimeInMillis)();

      var _this$getRegularModeH = this.getRegularModeHandsValuesFromMillis(currentTimeMillis),
          hoursHandValue = _this$getRegularModeH.hoursHandValue,
          minutesHandValue = _this$getRegularModeH.minutesHandValue,
          secondsHandValue = _this$getRegularModeH.secondsHandValue;

      this.renderHandles(hoursHandValue, minutesHandValue, secondsHandValue);
    }
  }, {
    key: "getRegularModeHandsValuesFromMillis",
    value: function getRegularModeHandsValuesFromMillis(millis) {
      // In regular mode the hour, minute and second hands
      // are the hour, minute and seconds values
      var minutesInAnHour = 60;
      var secondsInAMinute = 60;
      var secondsInAnHour = minutesInAnHour * secondsInAMinute;
      var millisInASecond = 1000;
      var secondsHandValue = millis / millisInASecond;
      var hoursHandValue = secondsHandValue / secondsInAnHour;
      secondsHandValue %= secondsInAnHour;
      var minutesHandValue = secondsHandValue / secondsInAMinute;
      secondsHandValue %= secondsInAMinute;
      return {
        hoursHandValue: hoursHandValue,
        minutesHandValue: minutesHandValue,
        secondsHandValue: secondsHandValue
      };
    }
  }, {
    key: "renderHandles",
    value: function renderHandles(hours, minutes, seconds) {
      var clockRadius = this.canvasHalfWidth;
      var quarterCircleAngle = this.circleRadians / 4;
      var secondsAngle = this.computeCircleAngle(seconds, 60, quarterCircleAngle);
      var minutesAngle = this.computeCircleAngle(minutes, 60, quarterCircleAngle);
      var hoursAngle = this.computeCircleAngle(hours, 12, quarterCircleAngle);
      this.renderHandle(secondsAngle, clockRadius * SecondsHandleToWatchRadiusRatio, SecondsHandleWidth, SecondsHandleColor, clockRadius * SecondsTailToWatchRadiusRatio);
      this.renderHandle(minutesAngle, clockRadius * MinutesHandleToWatchRadiusRatio, MinutesHandleWidth, MinutesHandleColor);
      this.renderHandle(hoursAngle, clockRadius * HoursHandleToWatchRadiusRatio, HoursHandleWidth, HoursHandleColor);
    }
  }, {
    key: "renderHandle",
    value: function renderHandle(angle, handleLength, handleWidth, handleColor) {
      var tailLength = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var angleSin = Math.sin(angle);
      var angleCos = Math.cos(angle);
      this.ctx.lineWidth = handleWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvasHalfWidth, this.canvasHalfHeight);
      this.ctx.lineTo(this.canvasHalfWidth + angleCos * handleLength, this.canvasHalfHeight + angleSin * handleLength);
      this.ctx.moveTo(this.canvasHalfWidth, this.canvasHalfHeight);
      this.ctx.lineTo(this.canvasHalfWidth - angleCos * tailLength, this.canvasHalfHeight - angleSin * tailLength);
      this.ctx.strokeStyle = handleColor;
      this.ctx.stroke();
    }
  }, {
    key: "renderStopWatchModeHandles",
    value: function renderStopWatchModeHandles(millis) {
      var _this$getStopWatchMod = this.getStopWatchModeHandsValuesFromMillis(millis),
          hoursHandValue = _this$getStopWatchMod.hoursHandValue,
          minutesHandValue = _this$getStopWatchMod.minutesHandValue,
          secondsHandValue = _this$getStopWatchMod.secondsHandValue;

      this.renderHandles(hoursHandValue, minutesHandValue, secondsHandValue);
    }
  }, {
    key: "renderModeChangeAnimation",
    value: function renderModeChangeAnimation(step) {
      if (this.changeModeAnimationStart === 0) this.changeModeAnimationStart = step;else {
        var _this$getAnimValues = this.getAnimValues(),
            handsStartValues = _this$getAnimValues.handsStartValues,
            handsEndValues = _this$getAnimValues.handsEndValues;

        var shouldEndAnimation = this.renderAnimationModeHandles(step, handsStartValues, handsEndValues);

        if (shouldEndAnimation) {
          if (this.state.clockMode === _clock.ClockMode.RegularToStopWatch) this.state.clockMode = _clock.ClockMode.StopWatch;else if (this.state.clockMode === _clock.ClockMode.StopWatchToRegular) this.state.clockMode = _clock.ClockMode.Regular;
        }
      }
    }
  }, {
    key: "getAnimValues",
    value: function getAnimValues() {
      var nowInMillis = (0, _utils.getCurrentTimeInMillis)();

      var _this$getRegularModeH2 = this.getRegularModeHandsValuesFromMillis(nowInMillis),
          rH = _this$getRegularModeH2.hoursHandValue,
          rM = _this$getRegularModeH2.minutesHandValue,
          rS = _this$getRegularModeH2.secondsHandValue;

      var _this$getStopWatchMod2 = this.getStopWatchModeHandsValuesFromMillis(this.state.stopWatchMillis),
          sH = _this$getStopWatchMod2.hoursHandValue,
          sM = _this$getStopWatchMod2.minutesHandValue,
          sS = _this$getStopWatchMod2.secondsHandValue;

      var sourceSecondsHandValue, targetSecondsHandValue;
      var sourceMinutesHandValue, targetMinutesHandValue;
      var sourceHoursHandValue, targetHoursHandValue;

      if (this.state.clockMode === _clock.ClockMode.RegularToStopWatch) {
        sourceSecondsHandValue = rS;
        sourceMinutesHandValue = rM;
        sourceHoursHandValue = rH;
        targetSecondsHandValue = sS;
        targetMinutesHandValue = sM;
        targetHoursHandValue = sH;
      } else {
        sourceSecondsHandValue = sS;
        sourceMinutesHandValue = sM;
        sourceHoursHandValue = sH;
        targetSecondsHandValue = rS;
        targetMinutesHandValue = rM;
        targetHoursHandValue = rH;
      } // If the target value is less than the source one, we add the needed amount
      // We don't want our clock hands going backward!


      targetSecondsHandValue = targetSecondsHandValue < sourceSecondsHandValue ? targetSecondsHandValue + 60 : targetSecondsHandValue;
      targetMinutesHandValue = targetMinutesHandValue < sourceMinutesHandValue ? targetMinutesHandValue + 60 : targetMinutesHandValue;
      targetHoursHandValue = targetHoursHandValue % 12;
      targetHoursHandValue = targetHoursHandValue < sourceHoursHandValue ? sourceHoursHandValue < 12 ? targetHoursHandValue + 12 : targetHoursHandValue + 24 : targetHoursHandValue;
      return {
        handsStartValues: {
          hours: sourceHoursHandValue,
          minutes: sourceMinutesHandValue,
          seconds: sourceSecondsHandValue
        },
        handsEndValues: {
          hours: targetHoursHandValue,
          minutes: targetMinutesHandValue,
          seconds: targetSecondsHandValue
        }
      };
    }
  }, {
    key: "getStopWatchModeHandsValuesFromMillis",
    value: function getStopWatchModeHandsValuesFromMillis(millis) {
      // In stopwatch mode the hour, minute and second hands
      // are the minute, seconds and deciseconds values
      // This means we need to account for differences between
      // angles i.e. a whole lap of the seconds hand should be
      // 10 deciseconds instead of 60 seconds. Similarly, a whole lap of the hour hand
      // should be 60 seconds instead of 12 hours
      var millisecondsInADecisecond = 100;
      var decisecondsToSecondsAngleMapping = 60 / 10;
      var minutesToHoursAngleMapping = 60 / 12;
      var secondsHandValue = millis / millisecondsInADecisecond * decisecondsToSecondsAngleMapping % 60;

      var _this$getRegularModeH3 = this.getRegularModeHandsValuesFromMillis(millis),
          minutesHandValue = _this$getRegularModeH3.minutesHandValue,
          secondsValue = _this$getRegularModeH3.secondsHandValue;

      return {
        hoursHandValue: minutesHandValue / minutesToHoursAngleMapping,
        minutesHandValue: secondsValue,
        secondsHandValue: secondsHandValue
      };
    }
  }, {
    key: "renderAnimationModeHandles",
    value: function renderAnimationModeHandles(step, handsStartValues, handsEndValues) {
      var animDuration = step - this.changeModeAnimationStart;
      var animProgress = animDuration / CangeModeAnimationDurationMillis;
      if (animProgress >= 1) return true;else {
        var mappedProgress = (0, _utils.easeInOutCubic)(animProgress);
        var hoursHandValue = this.interpolateValue(mappedProgress, handsStartValues.hours, handsEndValues.hours);
        var minutesHandValue = this.interpolateValue(mappedProgress, handsStartValues.minutes, handsEndValues.minutes);
        var secondsHandValue = this.interpolateValue(mappedProgress, handsStartValues.seconds, handsEndValues.seconds);
        this.renderHandles(hoursHandValue, minutesHandValue, secondsHandValue);
      }
      return false;
    }
  }, {
    key: "interpolateValue",
    value: function interpolateValue(progress, startValue, endValue) {
      return startValue + (endValue - startValue) * progress;
    }
  }, {
    key: "renderResetStopWatch",
    value: function renderResetStopWatch(step) {
      if (this.changeModeAnimationStart === 0) this.changeModeAnimationStart = step;else {
        var _this$getStopWatchMod3 = this.getStopWatchModeHandsValuesFromMillis(this.state.stopWatchMillis),
            sH = _this$getStopWatchMod3.hoursHandValue,
            sM = _this$getStopWatchMod3.minutesHandValue,
            sS = _this$getStopWatchMod3.secondsHandValue;

        var handsStartValues = {
          hours: sH % 60,
          minutes: sM % 60,
          seconds: sS % 60
        };
        var handsEndValues = this.state.stopWatchMillis === 0 ? {
          hours: 0,
          minutes: 0,
          seconds: 0
        } : {
          hours: 12,
          minutes: 60,
          seconds: 60
        };
        var shouldEndAnimation = this.renderAnimationModeHandles(step, handsStartValues, handsEndValues);

        if (shouldEndAnimation) {
          this.state.clockMode = _clock.ClockMode.StopWatch;
          this.state.stopWatchMillis = 0;
        }
      }
    }
  }, {
    key: "resetChangeModeAnimation",
    value: function resetChangeModeAnimation() {
      this.changeModeAnimationStart = 0;
    }
  }]);

  return ClockRenderer;
}();

var _default = ClockRenderer;
exports.default = _default;
},{"./clock":"clock.js","./utils":"utils.js"}],"clock.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ClockMode = void 0;

var _clockRenderer = _interopRequireDefault(require("./clock-renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ClockMode = {
  Regular: 0,
  StopWatch: 1,
  StopWatchToRegular: 2,
  RegularToStopWatch: 3,
  ResettingStopWatch: 4
};
exports.ClockMode = ClockMode;

var Clock = /*#__PURE__*/function () {
  function Clock(canvas, backgroundCanvas) {
    _classCallCheck(this, Clock);

    this.state = {
      clockMode: ClockMode.Regular,
      stopWatchMillis: 0,
      isStopWatchRunning: false
    };
    this.renderer = new _clockRenderer.default(canvas, backgroundCanvas, this.state);
    this.topButton = document.getElementById('top-button');
    this.middleButton = document.getElementById('middle-button');
    this.bottomButton = document.getElementById('bottom-button');
    this.stopWatchIntervalMillis = 10;
    this.stopWatchIntervalId = null;
    this.addEventListeners();
  }

  _createClass(Clock, [{
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this = this;

      this.topButton.addEventListener('click', function () {
        if (_this.state.clockMode === ClockMode.StopWatch && _this.state.isStopWatchRunning) _this.pauseStopWatch();else if (_this.state.clockMode === ClockMode.StopWatch && !_this.state.isStopWatchRunning) _this.startStopWatch();
      });
      this.middleButton.addEventListener('click', function () {
        if (_this.state.clockMode === ClockMode.Regular) _this.switchModeToStopWatch();else if (_this.state.clockMode === ClockMode.StopWatch) _this.switchModeToRegular();

        _this.renderer.switchModeIcons();
      });
      this.bottomButton.addEventListener('click', function () {
        if (_this.state.clockMode === ClockMode.StopWatch) {
          _this.resetStopWatch();
        }
      });
    }
  }, {
    key: "pauseStopWatch",
    value: function pauseStopWatch() {
      this.state.isStopWatchRunning = false;
      clearInterval(this.stopWatchIntervalId);
    }
  }, {
    key: "startStopWatch",
    value: function startStopWatch() {
      var _this2 = this;

      this.state.isStopWatchRunning = true;
      this.stopWatchIntervalId = setInterval(function () {
        return _this2.increaseMillis();
      }, this.stopWatchIntervalMillis);
    }
  }, {
    key: "increaseMillis",
    value: function increaseMillis() {
      this.state.stopWatchMillis += this.stopWatchIntervalMillis;
      this.renderer.setStopWatchMillis(this.stopWatchMillis);
    }
  }, {
    key: "resetStopWatch",
    value: function resetStopWatch() {
      this.pauseStopWatch();
      this.state.clockMode = ClockMode.ResettingStopWatch;
      this.renderer.resetChangeModeAnimation();
    }
  }, {
    key: "switchModeToStopWatch",
    value: function switchModeToStopWatch() {
      this.state.clockMode = ClockMode.RegularToStopWatch;
      this.renderer.resetChangeModeAnimation();
    }
  }, {
    key: "switchModeToRegular",
    value: function switchModeToRegular() {
      this.state.clockMode = ClockMode.StopWatchToRegular;
      this.renderer.resetChangeModeAnimation();
    }
  }, {
    key: "draw",
    value: function draw() {
      this.renderer.draw();
    }
  }]);

  return Clock;
}();

var _default = Clock;
exports.default = _default;
},{"./clock-renderer":"clock-renderer.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _clock = _interopRequireDefault(require("./clock"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var main = function main() {
  var canvas = (0, _utils.create2dCanvas)();
  canvas.className = 'main-canvas';
  var backgroundCanvas = (0, _utils.create2dCanvas)();
  (0, _utils.appendCanvasToDOM)(canvas);
  var clock = new _clock.default(canvas, backgroundCanvas);
  clock.draw();
};

main();
},{"./clock":"clock.js","./utils":"utils.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "45487" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map