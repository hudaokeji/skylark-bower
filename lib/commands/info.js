var mout = require('mout');
var Q = require('q');
var endpointParser = require('skylark-pkgm-endpoint-parser');
var PackageRepository = require('../core/PackageRepository');
var defaultConfig = require('../config');

function info(logger, endpoint, property, config) {
    if (!endpoint) {
        return;
    }

    // handle @ as version divider
    var splitParts = endpoint.split('/');
    splitParts[splitParts.length - 1] = splitParts[
        splitParts.length - 1
    ].replace('@', '#');
    endpoint = splitParts.join('/');

    var repository;
    var decEndpoint;

    config = defaultConfig(config);
    repository = new PackageRepository(config, logger);

    decEndpoint = endpointParser.decompose(endpoint);

    return Q.all([
        getPkgMeta(repository, decEndpoint, property),
        decEndpoint.target === '*' && !property
            ? repository.versions(decEndpoint.source)
            : null
    ]).spread(function(pkgMeta, versions) {
        if (versions) {
            return {
                name: decEndpoint.source,
                versions: versions,
                latest: pkgMeta
            };
        }

        return pkgMeta;
    });
}

function getPkgMeta(repository, decEndpoint, property) {
    return repository
        .fetch(decEndpoint)
        .spread(function(canonicalDir, pkgMeta) {
            pkgMeta = mout.object.filter(pkgMeta, function(value, key) {
                return key.charAt(0) !== '_';
            });

            // Retrieve specific property
            if (property) {
                pkgMeta = mout.object.get(pkgMeta, property);
            }

            return pkgMeta;
        });
}

// -------------------

info.readOptions = function(argv) {
    var cli = require('../util/cli');
    var options = cli.readOptions(argv);
    var pkg = options.argv.remain[1];
    var property = options.argv.remain[2];

    return [pkg, property];
};

module.exports = info;
