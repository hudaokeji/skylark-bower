var expect = require('expect.js');
var helpers = require('../helpers');

describe('rc', function() {
    var tempDir = new helpers.TempDir();
    var tempDirBowerrc = new helpers.TempDir();

    var rc = require('../../lib/util/rc');

    tempDir.prepare({
        '.spkgmrc': {
            key: 'value'
        },
        'child/.spkgmrc': {
            key2: 'value2'
        },
        'child2/.spkgmrc': {
            key: 'valueShouldBeOverwriteParent'
        },
        'child3/spkgm.json': {
            name: 'without-spkgmrc'
        },
        'other_dir/.spkgmrc': {
            key: 'othervalue'
        }
    });

    tempDirBowerrc.prepare({
        '.spkgmrc/foo': {
            key: 'bar'
        }
    });

    it('correctly reads .spkgmrc files', function() {
        var config = rc('spkgm', tempDir.path);

        expect(config.key).to.eql('value');
        expect(config.key2).to.eql(undefined);
    });

    it('correctly reads .spkgmrc files from child', function() {
        var config = rc('spkgm', tempDir.path + '/child/');

        expect(config.key).to.eql('value');
        expect(config.key2).to.eql('value2');
    });

    it('correctly reads .spkgmrc files from child2', function() {
        var config = rc('spkgm', tempDir.path + '/child2/');

        expect(config.key).to.eql('valueShouldBeOverwriteParent');
        expect(config.key2).to.eql(undefined);
    });

    it('correctly reads .spkgmrc files from child3', function() {
        var config = rc('spkgm', tempDir.path + '/child3/');

        expect(config.key).to.eql('value');
        expect(config.key2).to.eql(undefined);
    });

    it('loads the .spkgmrc file from the cwd specified on the command line', function() {
        var argv = {
            config: {
                cwd: tempDir.path + '/other_dir/'
            }
        };

        var config = rc('spkgm', tempDir.path, argv);

        expect(config.key).to.eql('othervalue');
    });

    it('throws an easy to understand error if .spkgmrc is a dir', function() {
        // Gotta wrap this to catch the error
        var config = function() {
            rc('spkgm', tempDirBowerrc.path);
        };

        expect(config).to.throwError(/should not be a directory/);
    });
});
