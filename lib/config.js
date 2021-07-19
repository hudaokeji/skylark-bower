var tty = require('tty');
var object = require('mout').object;
var spkgmConfig = require('skylark-pkgm-config');
var Configstore = require('configstore');

var current;

function defaultConfig(config) {
    config = config || {};

    return readCachedConfig(config.cwd || process.cwd(), config);
}

function readCachedConfig(cwd, overwrites) {
    current = spkgmConfig.create(cwd).load(overwrites);

    var config = current.toObject();

    var configstore = new Configstore('skylark-pkgm-github').all;

    object.mixIn(config, configstore);

    // If interactive is auto (null), guess its value
    if (config.interactive == null) {
        config.interactive =
            process.bin === 'spkgm' && tty.isatty(1) && !process.env.CI;
    }

    // Merge common CLI options into the config
    if (process.bin === 'spkgm') {
        var cli = require('./util/cli');

        object.mixIn(
            config,
            cli.readOptions({
                force: { type: Boolean, shorthand: 'f' },
                offline: { type: Boolean, shorthand: 'o' },
                verbose: { type: Boolean, shorthand: 'V' },
                quiet: { type: Boolean, shorthand: 'q' },
                loglevel: { type: String, shorthand: 'l' },
                json: { type: Boolean, shorthand: 'j' },
                silent: { type: Boolean, shorthand: 's' }
            })
        );
    }

    return config;
}

function restoreConfig() {
    if (current) {
        current.restore();
    }
}

function resetCache() {
    restoreConfig();
    current = undefined;
}

module.exports = defaultConfig;
module.exports.restore = restoreConfig;
module.exports.reset = resetCache;
