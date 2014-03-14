#!/usr/bin/env node

var _USAGE = '\n\
    Usage:\n\
         node JSON.js [--output output-json-file]\n\
                      [--nopretty]\n\
                      [--nosort]\n\
                      input-output-json-file\n\
';

var _RED    = '\u001b[31m';
var _YELLOW = '\u001b[33m';
var _GREEN  = '\u001b[32m';
var _CLEAR  = "\u001b[0m";

var fs      = require("fs");
var argv    = process.argv.slice(2);
var options = _parseCommandLineOptions(argv, {
        sort:       true,       // Boolean: true is sort keys.
        pretty:     true,       // Boolean: true is pretty print.
        input:      "",         // PathString: "input-output-json-file-name"
        output:     ""          // PathString: "output-json-file-name"
    });

// --- error handler ---
if (!options.input) {
    console.log(_RED + _USAGE + _CLEAR);
    return;
}

// --- main ---
var jsonObject = _loadJSON(options.input);

if (options.sort) {
    jsonObject = _sortJSONObjectByKeys(jsonObject);
}

var jsonText = options.pretty ? JSON.stringify(jsonObject, null, 2)
                              : JSON.stringify(jsonObject);

fs.writeFileSync(options.output || options.input, jsonText + "\n"); // writeback or save

// ---------------------------------------------------------
function _loadJSON(inputFile, // @arg String:
                   sort) {    // @arg Boolean:
                              // @ret JSONObject:
    var text = fs.readFileSync(inputFile, "utf8");

    return JSON.parse(text);
}

function _sortJSONObjectByKeys(json) { // @arg Object:
                                       // @ret Object:
    var result = {};
    var keys = Object.keys(json).sort();

    for (var i = 0, iz = keys.length; i < iz; ++i) {
        result[keys[i]] = json[keys[i]];
    }
    return result;
}

function _parseCommandLineOptions(argv,      // @arg CommandlineOptionsArray: argv. [option, ...]
                                  options) { // @arg Object: { ... }
    for (var i = 0, iz = argv.length; i < iz; ++i) {
        switch (argv[i]) {
        case "--nosort":    options.sort = false; break;
        case "--nopretty":  options.pretty = false; break;
        case "--output":    options.output = argv[++i]; break;
        default:
            options.input = argv[i];
        }
    }
    return options;
}

