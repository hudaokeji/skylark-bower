var path = require('path');
var spkgmJson = require('skylark-pkgm-json');
var Q = require('q');

// The valid options are the same as skylark-pkgm-json#readFile.
// If the "assume" option is passed, it will be used if no json file was found

// This promise is resolved with [json, deprecated, assumed]
// - json: The read json
// - deprecated: The deprecated filename being used or false otherwise
// - assumed: True if a dummy json was returned if no json file was found, false otherwise
function readJson(file, options) {
    options = options || {};

    // Read
    return Q.nfcall(spkgmJson.read, file, options).spread(
        function(json, jsonFile) {
            var deprecated;

            if (options.logger) {
                var issues = spkgmJson.getIssues(json);
                if (issues.warnings.length > 0) {
                    options.logger.warn('invalid-meta', 'for:' + jsonFile);
                }
                issues.warnings.forEach(function(warning) {
                    options.logger.warn('invalid-meta', warning);
                });
            }

            jsonFile = path.basename(jsonFile);
            deprecated = jsonFile === 'component.json' ? jsonFile : false;

            return [json, deprecated, false];
        },
        function(err) {
            // No json file was found, assume one
            if (err.code === 'ENOENT' && options.assume) {
                return [spkgmJson.parse(options.assume, options), false, true];
            }

            err.details = err.message;

            if (err.file) {
                err.message = 'Failed to read ' + err.file;
                err.data = { filename: err.file };
            } else {
                err.message = 'Failed to read json from ' + file;
            }

            throw err;
        }
    );
}

module.exports = readJson;
