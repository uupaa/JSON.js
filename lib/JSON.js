// @name: JSON.js
// @require: Valid.js
// @cutoff: @assert @node
// @spec: http://developer.mozilla.org/En/Using_native_JSON

(function(global) {
"use strict";

// --- variable --------------------------------------------
//{@assert
var Valid = global["Valid"] || require("uupaa.valid.js");
//}@assert

var _inNode = "process" in global;
//var _inWorker = "WorkerLocation" in global;
//var _inBrowser = "self" in global;

// --- define ----------------------------------------------
var _MAX_DEPTH = 512;

// --- interface -------------------------------------------
function JSON() { // @help: JSON
}

JSON["repository"] = "https://github.com/uupaa/JSON.js";

JSON["parse"]     = JSON_parse;     // JSON.parse(source:String):Any
JSON["stringify"] = JSON_stringify; // JSON.stringify(source:Any):Object

// --- implement -------------------------------------------
function JSON_parse(source) { // @arg String: JSON String
                              // @ret Any:
                              // @throw: SyntaxError("Unexpected token: ...")
                              // @desc: Decode from string.
                              // @help: JSON.parse
    var unescaped = source.trim().replace(/"(\\.|[^"\\])*"/g, "");

    if (/[^,:{}\[\]0-9\.\-+Eaeflnr-u \n\r\t]/.test(unescaped)) {
        throw new SyntaxError("Unexpected token:" + source);
    }
    return (new Function("return " + source))(); // raise error
}

function JSON_stringify(source,   // @arg Any:
                        callback, // @arg Function/Array(= null):
                        indent) { // @arg Integer(= 0):
                                  // @ret JSONString:
                                  // @throw: TypeError("CYCLIC_REFERENCE_ERROR")
                                  // @help: JSON.stringify
                                  // @desc: encode to JSONString
    return _inspectJSON(source, callback || null, indent || 0, 0);
}

function _inspectJSON(source,   // @arg Any: value
                      callback, // @arg Function/Array:
                      indent,   // @arg Integer:
                      depth) {  // @arg Number: current depth
                                // @ret String:
    var rv = [];

    if (depth >= _MAX_DEPTH) {
        throw new TypeError("CYCLIC_REFERENCE_ERROR");
    }

    if (source === null || source === undefined) {
        return source + ""; // "null" or "undefined"
    }
    if (source["toJSON"]) { // Date#toJSON
        return source["toJSON"]();
    }

    var type = typeof source;

    if (type === "boolean" || type === "number") {
        return "" + source;
    }
    if (type === "string") {
        return '"' + _toJSONEscapedString(source) + '"';
    }
    var brackets = ["{", "}"];

    if (Array.isArray(source)) {
        brackets = ["[", "]"];
        for (var i = 0, iz = source.length; i < iz; ++i) {
            rv.push(_inspectJSON(source[i], callback, indent, depth + 1));
        }
    } else if (source.constructor === ({}).constructor) {
        var ary = source["keys"](source);

        for (var i = 0, iz = ary.length; i < iz; ++i) { // uupaa-looper
            var key = ary[i];
            rv.push('"' + _toJSONEscapedString(key) + '":' +
                          _inspectJSON(source[key], callback, indent, depth + 1));
        }
    }
    return brackets[0] + rv.join(",") + brackets[1]; // "{...}" or "[...]"
}

function _toJSONEscapedString(str) { // @arg String:
                                     // @ret String:
                                     // @inner: to JSON escaped string
    var JSON_ESCAPE = {
            '\b': '\\b',    // backspace       U+0008
            '\t': '\\t',    // tab             U+0009
            '\n': '\\n',    // line feed       U+000A
            '\f': '\\f',    // form feed       U+000C
            '\r': '\\r',    // carriage return U+000D
            '"':  '\\"',    // quotation mark  U+0022
            '\\': '\\\\'    // reverse solidus U+005C
        };

    return str.replace(/(?:[\b\t\n\f\r\"]|\\)/g, function(_) {
                return JSON_ESCAPE[_];
            }).replace(/(?:[\x00-\x1f])/g, function(_) {
                return "\\u00" + ("0" + _.charCodeAt(0).toString(16)).slice(-2);
            });
}

//{@assert
function _if(value, fn, hint) {
    if (value) {
        var msg = fn.name + " " + hint;

        console.error(Valid.stack(msg));
        if (global["Help"]) {
            global["Help"](fn, hint);
        }
        throw new Error(msg);
    }
}
//}@assert

// --- export ----------------------------------------------
//{@node
if (_inNode) {
    module["exports"] = JSON;
}
//}@node
if (global["JSON"]) {
    global["JSON_"] = JSON; // secondary
} else {
    global["JSON"]  = JSON; // primary
}

})((this || 0).self || global);

