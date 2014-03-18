#!/usr/bin/env node

var _USAGE = '\n' +
'   Usage:\n' +
'       node JSON.js [--help]\n' +
'                    [--verbose]\n' +
'                    [--output output-json-file]\n' +
'                    [--nopretty]\n' +
'                    [--nosort]\n' +
'                    input-output-json-file\n' +
'\n'+
'   See:\n'+
'       https://github.com/uupaa/JSON.js/wiki/JSON\n';

var _CONSOLE_COLOR = {
        RED:    "\u001b[31m",
        YELLOW: "\u001b[33m",
        GREEN:  "\u001b[32m",
        CLEAR:  "\u001b[0m"
    };

var fs      = require("fs");
var argv    = process.argv.slice(2);
var options = _parseCommandLineOptions(argv, {
        help:       false,      // Boolean: true is show help.
        verbose:    false,      // Boolean: true is verbose mode.
        sort:       true,       // Boolean: true is sort keys.
        pretty:     true,       // Boolean: true is pretty print.
        input:      "",         // PathString: "input-output-json-file-name"
        output:     ""          // PathString: "output-json-file-name"
    });


if (options.help) {
    console.log(_CONSOLE_COLOR.YELLOW + _USAGE + _CONSOLE_COLOR.CLEAR);
    return;
}
if (!options.input) {
    console.log(_CONSOLE_COLOR.RED + "Input file is empty." + _CONSOLE_COLOR.CLEAR);
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
        case "-h":
        case "--help":      options.help = true; break;
        case "-v":
        case "--verbose":   options.verbose = true; break;
        case "--nosort":    options.sort = false; break;
        case "--nopretty":  options.pretty = false; break;
        case "--output":    options.output = argv[++i]; break;
        default:
            options.input = argv[i];
        }
    }
    return options;
}

