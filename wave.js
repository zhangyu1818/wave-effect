var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
};

// node_modules/dynamic-stylesheet/dist/index.js
var require_dist = __commonJS({
  "node_modules/dynamic-stylesheet/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.updateCSS = exports.injectCSS = void 0;
    var MARK_KEY = "INJECT_CSS_KEY";
    function getContainer(option) {
      if (option.attachTo) {
        return option.attachTo;
      }
      const head = document.querySelector("head");
      return head || document.body;
    }
    function injectCSS(css, option = {}) {
      const styleNode = document.createElement("style");
      styleNode.innerHTML = css;
      const container = getContainer(option);
      container.appendChild(styleNode);
      return styleNode;
    }
    exports.injectCSS = injectCSS;
    function updateCSS2(css, key, option = {}) {
      const container = getContainer(option);
      const existNode = Array.from(container.children).find((node) => node.tagName === "STYLE" && node[MARK_KEY] === key);
      if (existNode) {
        if (existNode.innerHTML !== css) {
          existNode.innerHTML = css;
        }
        return existNode;
      }
      const newNode = injectCSS(css, option);
      newNode[MARK_KEY] = key;
      return newNode;
    }
    exports.updateCSS = updateCSS2;
  }
});

// src/wave.ts
var import_dynamic_stylesheet = __toModule(require_dist());
var styleForPseudo;
var isHiddenElement = (element) => {
  if (false) {
    return false;
  }
  return !element.offsetParent || element.hidden;
};
function isNotGrey(color) {
  const match = (color || "").match(/rgba?\((\d*), (\d*), (\d*)(, [\d.]*)?\)/);
  if (match && match[1] && match[2] && match[3]) {
    return !(match[1] === match[2] && match[2] === match[3]);
  }
  return true;
}
var isValidColor = (color) => {
  return color && color !== "#ffffff" && color !== `rgb(255,255,255)` && isNotGrey(color) && !/rgba\((?:\d*, ){3}0\)/.test(color) && color !== "transparent";
};
var getWaveColor = (element) => {
  return getComputedStyle(element).getPropertyValue("border-color") || getComputedStyle(element).getPropertyValue("background-color");
};
var cancelWaveMap = new WeakMap();
var wave = (element, options = {}) => {
  const {waveColor: optionWaveColor, disabledClass = []} = options;
  if (!element) {
    console.warn("wave element is invalidate");
    return;
  }
  let timeoutId;
  const shouldFilter = () => disabledClass.some((name) => element.className.includes(name));
  const triggerWave = (element2, waveColor) => {
    if (!element2 || isHiddenElement(element2) || shouldFilter()) {
      return;
    }
    element2.setAttribute("wave-click-animating", "true");
    if (isValidColor(waveColor)) {
      const cssText = `
        [wave-click-animating='true']::after {
          --wave-shadow-color: ${waveColor};
        }
      `;
      styleForPseudo = (0, import_dynamic_stylesheet.updateCSS)(cssText, "wave-animate", {attachTo: document.body});
      element2.addEventListener(`animationend`, onWaveEnd);
    }
  };
  const onWaveEnd = (event) => {
    if (!event || event.animationName !== "fadeEffect") {
      return;
    }
    resetEffect();
  };
  const resetEffect = () => {
    element.setAttribute("wave-click-animating", "false");
    if (styleForPseudo) {
      styleForPseudo.innerHTML = "";
    }
    element.removeEventListener(`animationend`, onWaveEnd);
  };
  const internalOnClick = (event) => {
    const {target} = event;
    if (isHiddenElement(target)) {
      return;
    }
    resetEffect();
    const waveColor = getWaveColor(element);
    timeoutId = window.setTimeout(() => triggerWave(element, optionWaveColor ?? waveColor), 0);
  };
  element.addEventListener("click", internalOnClick, true);
  cancelWaveMap.set(element, () => {
    cancelWaveMap.delete(element);
    window.clearTimeout(timeoutId);
    element.removeEventListener("click", internalOnClick, true);
  });
};
var clearEffect = (element) => {
  const clear = cancelWaveMap.get(element);
  clear?.();
};
var wave_default = wave;
export {
  clearEffect,
  wave_default as default
};
