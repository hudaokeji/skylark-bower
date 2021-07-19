var path = require('path');
var expect = require('expect.js');
var _s = require('underscore.string');
var spkgmJson = require('../lib/json');
var request = require('request');

describe('.find', function() {
    it('should find the spkgm.json file', function(done) {
        spkgmJson.find(__dirname + '/pkg-skylark-pkgm-json', function(err, file) {
            if (err) {
                return done(err);
            }

            expect(file).to.equal(
                path.resolve(__dirname + '/pkg-skylark-pkgm-json/spkgm.json')
            );
            done();
        });
    });

    it('should fallback to the component.json file', function(done) {
        spkgmJson.find(__dirname + '/pkg-component-json', function(err, file) {
            if (err) {
                return done(err);
            }

            expect(file).to.equal(
                path.resolve(__dirname + '/pkg-component-json/component.json')
            );
            done();
        });
    });

    it("should not fallback to the component.json file if it's a component(1) file", function(done) {
        spkgmJson.find(__dirname + '/pkg-component(1)-json', function(err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.equal('ENOENT');
            expect(err.message).to.equal(
                'None of spkgm.json, component.json, .spkgm.json were found in ' +
                    __dirname +
                    '/pkg-component(1)-json'
            );
            done();
        });
    });

    it('should fallback to the .spkgm.json file', function(done) {
        spkgmJson.find(__dirname + '/pkg-dot-skylark-pkgm-json', function(err, file) {
            if (err) {
                return done(err);
            }

            expect(file).to.equal(
                path.resolve(__dirname + '/pkg-dot-skylark-pkgm-json/.spkgm.json')
            );
            done();
        });
    });

    it('should error if no component.json / spkgm.json / .spkgm.json is found', function(done) {
        spkgmJson.find(__dirname, function(err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.equal('ENOENT');
            expect(err.message).to.equal(
                'None of spkgm.json, component.json, .spkgm.json were found in ' +
                    __dirname
            );
            done();
        });
    });
});

describe('.findSync', function() {
    it('should find the spkgm.json file', function(done) {
        var file = spkgmJson.findSync(__dirname + '/pkg-skylark-pkgm-json');

        expect(file).to.equal(
            path.resolve(__dirname + '/pkg-skylark-pkgm-json/spkgm.json')
        );
        done();
    });

    it('should fallback to the component.json file', function(done) {
        var file = spkgmJson.findSync(__dirname + '/pkg-component-json');

        expect(file).to.equal(
            path.resolve(__dirname + '/pkg-component-json/component.json')
        );
        done();
    });

    it('should fallback to the .spkgm.json file', function(done) {
        var file = spkgmJson.findSync(__dirname + '/pkg-dot-skylark-pkgm-json');

        expect(file).to.equal(
            path.resolve(__dirname + '/pkg-dot-skylark-pkgm-json/.spkgm.json')
        );
        done();
    });

    it('should error if no component.json / spkgm.json / .spkgm.json is found', function(done) {
        var err = spkgmJson.findSync(__dirname);
        expect(err).to.be.an(Error);
        expect(err.code).to.equal('ENOENT');
        expect(err.message).to.equal(
            'None of spkgm.json, component.json, .spkgm.json were found in ' +
                __dirname
        );
        done();
    });
});

describe('.read', function() {
    it('should give error if file does not exists', function(done) {
        spkgmJson.read(__dirname + '/willneverexist', function(err) {
            expect(err).to.be.an(Error);
            expect(err.code).to.equal('ENOENT');
            done();
        });
    });

    it('should give error if when reading an invalid json', function(done) {
        spkgmJson.read(
            __dirname + '/pkg-skylark-pkgm-json-malformed/spkgm.json',
            function(err) {
                expect(err).to.be.an(Error);
                expect(err.code).to.equal('EMALFORMED');
                expect(err.file).to.equal(
                    path.resolve(
                        __dirname + '/pkg-skylark-pkgm-json-malformed/spkgm.json'
                    )
                );
                done();
            }
        );
    });

    it('should read the file and give an object', function(done) {
        spkgmJson.read(__dirname + '/pkg-skylark-pkgm-json/spkgm.json', function(
            err,
            json
        ) {
            if (err) {
                return done(err);
            }

            expect(json).to.be.an('object');
            expect(json.name).to.equal('some-pkg');
            expect(json.version).to.equal('0.0.0');

            done();
        });
    });

    it('should give the json file that was read', function(done) {
        spkgmJson.read(__dirname + '/pkg-skylark-pkgm-json', function(
            err,
            json,
            file
        ) {
            if (err) {
                return done(err);
            }

            expect(file).to.equal(
                path.resolve(__dirname + '/pkg-skylark-pkgm-json/spkgm.json')
            );
            done();
        });
    });

    it('should find for a json file if a directory is given', function(done) {
        spkgmJson.read(__dirname + '/pkg-component-json', function(
            err,
            json,
            file
        ) {
            if (err) {
                return done(err);
            }

            expect(json).to.be.an('object');
            expect(json.name).to.equal('some-pkg');
            expect(json.version).to.equal('0.0.0');
            expect(file).to.equal(
                path.resolve(__dirname + '/pkg-component-json/component.json')
            );
            done();
        });
    });

    it('should validate the returned object unless validate is false', function(done) {
        spkgmJson.read(
            __dirname + '/pkg-skylark-pkgm-json-invalid/spkgm.json',
            function(err) {
                expect(err).to.be.an(Error);
                expect(err.message).to.contain('name');
                expect(err.file).to.equal(
                    path.resolve(
                        __dirname + '/pkg-skylark-pkgm-json-invalid/spkgm.json'
                    )
                );

                spkgmJson.read(
                    __dirname + '/pkg-skylark-pkgm-json-invalid/spkgm.json',
                    { validate: false },
                    function(err) {
                        done(err);
                    }
                );
            }
        );
    });

    it('should normalize the returned object if normalize is true', function(done) {
        spkgmJson.read(__dirname + '/pkg-skylark-pkgm-json/spkgm.json', function(
            err,
            json
        ) {
            if (err) {
                return done(err);
            }

            expect(json.main).to.equal('foo.js');

            spkgmJson.read(
                __dirname + '/pkg-skylark-pkgm-json/spkgm.json',
                { normalize: true },
                function(err, json) {
                    if (err) {
                        return done(err);
                    }

                    expect(json.main).to.eql(['foo.js']);
                    done();
                }
            );
        });
    });
});

describe('.readSync', function() {
    it('should give error if file does not exists', function(done) {
        var err = spkgmJson.readSync(__dirname + '/willneverexist');
        expect(err).to.be.an(Error);
        expect(err.code).to.equal('ENOENT');
        done();
    });

    it('should give error if when reading an invalid json', function(done) {
        var err = spkgmJson.readSync(
            __dirname + '/pkg-skylark-pkgm-json-malformed/spkgm.json'
        );
        expect(err).to.be.an(Error);
        expect(err.code).to.equal('EMALFORMED');
        expect(err.file).to.equal(
            path.resolve(__dirname + '/pkg-skylark-pkgm-json-malformed/spkgm.json')
        );
        done();
    });

    it('should read the file and give an object', function(done) {
        var json = spkgmJson.readSync(__dirname + '/pkg-skylark-pkgm-json/spkgm.json');

        expect(json).to.be.an('object');
        expect(json.name).to.equal('some-pkg');
        expect(json.version).to.equal('0.0.0');

        done();
    });

    it('should find for a json file if a directory is given', function(done) {
        var json = spkgmJson.readSync(__dirname + '/pkg-component-json');

        expect(json).to.be.an('object');
        expect(json.name).to.equal('some-pkg');
        expect(json.version).to.equal('0.0.0');
        done();
    });

    it('should validate the returned object unless validate is false', function(done) {
        var err = spkgmJson.readSync(
            __dirname + '/pkg-skylark-pkgm-json-invalid/spkgm.json'
        );
        expect(err).to.be.an(Error);
        expect(err.message).to.contain('name');
        expect(err.file).to.equal(
            path.resolve(__dirname + '/pkg-skylark-pkgm-json-invalid/spkgm.json')
        );

        err = spkgmJson.readSync(
            __dirname + '/pkg-skylark-pkgm-json-invalid/spkgm.json',
            { validate: false }
        );
        expect(err).to.not.be.an(Error);
        done();
    });

    it('should normalize the returned object if normalize is true', function(done) {
        var json = spkgmJson.readSync(__dirname + '/pkg-skylark-pkgm-json/spkgm.json');
        expect(json.main).to.equal('foo.js');

        json = spkgmJson.readSync(__dirname + '/pkg-skylark-pkgm-json/spkgm.json', {
            normalize: true
        });

        expect(json.main).to.eql(['foo.js']);
        done();
    });
});

describe('.parse', function() {
    it('should return the same object, unless clone is true', function() {
        var json = { name: 'foo' };

        expect(spkgmJson.parse(json)).to.equal(json);
        expect(spkgmJson.parse(json, { clone: true })).to.not.equal(json);
        expect(spkgmJson.parse(json, { clone: true })).to.eql(json);
    });

    it('should validate the passed object, unless validate is false', function() {
        expect(function() {
            spkgmJson.parse({});
        }).to.throwException(/name/);

        expect(function() {
            spkgmJson.parse({}, { validate: false });
        }).to.not.throwException();
    });

    it('should not normalize the passed object unless normalize is true', function() {
        var json = { name: 'foo', main: 'foo.js' };

        spkgmJson.parse(json);
        expect(json.main).to.eql('foo.js');

        spkgmJson.parse(json, { normalize: true });
        expect(json.main).to.eql(['foo.js']);
    });
});

describe('.getIssues', function() {
    it('should print no errors even for weird package names', function() {
        var json = { name: '@gruNt/my dependency' };

        expect(spkgmJson.getIssues(json).errors).to.be.empty();
    });

    it('should validate the name length', function() {
        var json = {
            name: 'a_123456789_123456789_123456789_123456789_123456789_z'
        };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "name" is too long, the limit is 50 characters'
        );
    });

    it('should validate the name is lowercase', function() {
        var json = { name: 'gruNt' };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "name" is recommended to be lowercase, can contain digits, dots, dashes'
        );
    });

    it('should validate the name starts with lowercase', function() {
        var json = { name: '-runt' };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "name" cannot start with dot or dash'
        );
    });

    it('should validate the name starts with lowercase', function() {
        var json = { name: '.grunt' };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "name" cannot start with dot or dash'
        );
    });

    it('should validate the name ends with lowercase', function() {
        var json = { name: 'grun-' };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "name" cannot end with dot or dash'
        );
    });

    it('should validate the name ends with lowercase', function() {
        var json = { name: 'grun.' };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "name" cannot end with dot or dash'
        );
    });

    it('should validate the name is valid', function() {
        var json = { name: 'gru.n-t' };

        expect(spkgmJson.getIssues(json).warnings).to.eql([]);
    });

    it('should validate the description length', function() {
        var json = {
            name: 'foo',
            description: _s.repeat('æ', 141)
        };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "description" is too long, the limit is 140 characters'
        );
    });

    it('should validate the description is valid', function() {
        var json = {
            name: 'foo',
            description: _s.repeat('æ', 140)
        };

        expect(spkgmJson.getIssues(json).warnings).to.eql([]);
    });

    it('should validate that main does not contain globs', function() {
        var json = {
            name: 'foo',
            main: ['js/*.js']
        };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "main" field cannot contain globs (example: "*.js")'
        );
    });

    it('should validate that main does not contain minified files', function() {
        var json = {
            name: 'foo',
            main: ['foo.min.css']
        };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "main" field cannot contain minified files'
        );
    });

    it('should validate that main does not contain fonts', function() {
        var json = {
            name: 'foo',
            main: ['foo.woff']
        };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "main" field cannot contain font, image, audio, or video files'
        );
    });

    it('should validate that main does not contain images', function() {
        var json = {
            name: 'foo',
            main: ['foo.png']
        };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "main" field cannot contain font, image, audio, or video files'
        );
    });

    it('should validate that main does not contain multiple files of the same filetype', function() {
        var json = {
            name: 'foo',
            main: ['foo.js', 'bar.js']
        };

        expect(spkgmJson.getIssues(json).warnings).to.contain(
            'The "main" field has to contain only 1 file per filetype; found multiple .js files: ["foo.js","bar.js"]'
        );
    });
});

describe('.validate', function() {
    it('should validate the name property', function() {
        expect(function() {
            spkgmJson.validate({});
        }).to.throwException(/name/);
    });

    it('should validate the type of main', function() {
        var json = {
            name: 'foo',
            main: {}
        };
        expect(function() {
            spkgmJson.validate(json);
        }).to.throwException();
    });
    it('should validate the type of items of an Array main', function() {
        var json = {
            name: 'foo',
            main: [{}]
        };
        expect(function() {
            spkgmJson.validate(json);
        }).to.throwException();
    });
});

describe('.normalize', function() {
    it('should normalize the main property', function() {
        var json = { name: 'foo', main: 'foo.js' };

        spkgmJson.normalize(json);
        expect(json.main).to.eql(['foo.js']);
    });
});

describe('packages from spkgm registry', function() {
    var packageList,
        packageListUrl = 'http://registry.spkgm.io/packages';

    this.timeout(60000);

    it('can be downloaded from online source ' + packageListUrl, function(
        done
    ) {
        request(
            {
                url: packageListUrl,
                json: true
            },
            function(error, response, body) {
                if (error) {
                    throw error;
                }

                expect(body).to.be.an('array');
                expect(body).to.not.be.empty();
                packageList = body;

                done();
            }
        );
    });

    it('should validate each listed package', function(done) {
        expect(packageList).to.be.an('array');

        var invalidPackageCount = 0;

        packageList.forEach(function(package) {
            try {
                spkgmJson.validate(package);
            } catch (e) {
                invalidPackageCount++;
                console.error(
                    'validation of "' + package.name + '" failed: ' + e.message
                );
            }
        });

        if (invalidPackageCount) {
            throw new Error(
                invalidPackageCount +
                    '/' +
                    packageList.length +
                    ' package names do not validate'
            );
        }

        done();
    });
});
