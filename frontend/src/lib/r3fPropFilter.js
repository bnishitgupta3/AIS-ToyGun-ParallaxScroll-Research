/* eslint-disable */
/**
 * R3F prop sanitizer — patches React's classic createElement AND the new
 * automatic JSX runtime so editor-injected x-* attributes never reach R3F's
 * reconciler (where they would be misinterpreted as nested THREE property
 * paths and throw).
 *
 * Uses CommonJS `require()` so we mutate the CACHED CJS module.exports
 * (the real object that webpack's import bindings read from), not a
 * synthetic ES-namespace facade.
 */
const React = require("react");
const JsxRuntime = require("react/jsx-runtime");
let JsxDevRuntime = null;
try {
    JsxDevRuntime = require("react/jsx-dev-runtime");
} catch (_) {
    /* not available in some builds */
}

const HTML_AND_SVG = new Set([
    "a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","menu","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr",
    "svg","circle","ellipse","g","line","path","polygon","polyline","rect","text","tspan","defs","mask","clippath","pattern","stop","linearGradient","radialGradient","filter","feblend","fecolormatrix","fecomponenttransfer","fecomposite","feconvolvematrix","fediffuselighting","fedisplacementmap","feflood","fegaussianblur","feimage","femerge","femergenode","femorphology","feoffset","fepointlight","fespecularlighting","fespotlight","fetile","feturbulence","foreignObject","marker","symbol","use","view"
]);

const STRIP_PREFIXES = ["x-source-","x-array-","x-file-","x-line-","x-column","x-id","x-component","x-dynamic","x-excluded","x-element-","x-opening-"];
const STRIP_EXACT = new Set(["data-ve-dynamic"]);

function shouldStrip(name) {
    if (typeof name !== "string") return false;
    if (STRIP_EXACT.has(name)) return true;
    for (let i = 0; i < STRIP_PREFIXES.length; i++) {
        if (name.startsWith(STRIP_PREFIXES[i])) return true;
    }
    return false;
}

function isR3FIntrinsic(type) {
    if (typeof type !== "string") return false;
    if (/[A-Z]/.test(type)) return true;
    return !HTML_AND_SVG.has(type);
}

function cleanProps(props) {
    if (!props) return props;
    let clone = null;
    for (const key in props) {
        if (shouldStrip(key)) {
            if (!clone) clone = { ...props };
            delete clone[key];
        }
    }
    return clone || props;
}

function patchFn(mod, fnName) {
    const orig = mod[fnName];
    if (!orig || mod["__r3f_patched_" + fnName]) return;
    const patched = function (type, props, key, ...rest) {
        if (props && isR3FIntrinsic(type)) {
            const cleaned = cleanProps(props);
            if (cleaned !== props) {
                return orig(type, cleaned, key, ...rest);
            }
        }
        return orig(type, props, key, ...rest);
    };
    try {
        mod[fnName] = patched;
    } catch (_) {
        try {
            Object.defineProperty(mod, fnName, {
                value: patched,
                writable: true,
                configurable: true,
            });
        } catch (__) {
            /* unable to patch */
        }
    }
    mod["__r3f_patched_" + fnName] = true;
}

// classic
if (!React.__r3f_patched_createElement) {
    const orig = React.createElement;
    React.createElement = function patchedCreateElement(type, props, ...children) {
        if (props && isR3FIntrinsic(type)) {
            const cleaned = cleanProps(props);
            if (cleaned !== props) return orig(type, cleaned, ...children);
        }
        return orig(type, props, ...children);
    };
    React.__r3f_patched_createElement = true;
}

patchFn(JsxRuntime, "jsx");
patchFn(JsxRuntime, "jsxs");
if (JsxDevRuntime) {
    patchFn(JsxDevRuntime, "jsxDEV");
    patchFn(JsxDevRuntime, "jsx");
    patchFn(JsxDevRuntime, "jsxs");
}

// Debug breadcrumb in dev console so we can confirm patch ran.
if (typeof window !== "undefined") {
    window.__r3fPropFilterReady = true;
}

module.exports = {};
