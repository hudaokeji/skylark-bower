# Changelog

## 1.4.2

- Prevent errors when expanded env variable does not exist

## 1.4.2

- Update minimist to 0.2.1 to fix security issue

## 1.4.0

- Change default shorthand resolver from git:// to https://

## 1.3.1

- Ignore hook scripts for environment variable expansion

## 1.3.0 - 2015-12-07

- Allow the use of environment variables in .spkgmrc. Fixes [#41](https://github.com/spkgm/config/issues/41)
- Loads the .spkgmrc file from the cwd specified on the command line. Fixes [spkgm/spkgm#1993](https://github.com/spkgm/spkgm/issues/1993)
- Allwow for array notation in ENV variables [#44](https://github.com/spkgm/config/issues/44)

## 1.2.3 - 2015-11-27

- Restores env variables if they are undefined at the beginning
- Handles default setting for config.ca. Together with [spkgm/spkgm PR #1972](https://github.com/spkgm/spkgm/pull/1972), fixes downloading with `strict-ssl` using custom CA
- Displays an error message if .spkgmrc is a directory instead of file. Fixes [spkgm/spkgm#2022](https://github.com/spkgm/spkgm/issues/2022)

## 1.2.2 - 2015-10-16
- Fixes registry configurartion expanding [spkgm/spkgm#1950](https://github.com/spkgm/spkgm/issues/1950)

## 1.2.1 - 2015-10-15
- Fixes case insenstivity HTTP_PROXY setting issue on Windows

## 1.2.0 - 2015-09-28
- Prevent defaulting cwd to process.cwd()

## 1.1.2 - 2015-09-27
- Performs only camel case normalisation before merging

## 1.1.1 - 2015-09-27
- Fix: Merge extra options after camel-case normalisation, instead of before it

## 1.1.0 - 2015-09-27
- Allow for overwriting options with .load(overwrites) / .read(cwd, overwrites)

## 1.0.1 - 2015-09-27
- Update dependencies and relax "mout" version range
- Most significant changes:
  - graceful-fs updated from 2.x version to 4.x
  - osenv updated to from 0.0.x to 0.1.x, [tmp location changed](https://github.com/npm/osenv/commit/d6eddbc026538b09026b1dbd60fbc081a8c67e03)

## 1.0.0 - 2015-09-27
- Support for no-proxy configuration variable
- Overwrite HTTP_PROXY, HTTPS_PROXY, and NO_PROXY env variables in load method
- Normalise paths to certificates with contents of them, [#28](https://github.com/spkgm/config/pull/28)

## 0.6.1 - 2015-04-1
- Fixes merging .spkgmrc files upward directory tree. [#25](https://github.com/spkgm/config/issues/25)

## 0.6.0 - 2015-03-30
- Merge .spkgmrc files upward directory tree (fixes [spkgm/spkgm#1689](https://github.com/spkgm/spkgm/issues/1689)) [#24](https://github.com/spkgm/config/pull/24)
- Allow NPM config variables (resolves [spkgm/spkgm#1711](https://github.com/spkgm/spkgm/issues/1711)) [#23](https://github.com/spkgm/config/pull/23)

## 0.5.2 - 2014-06-09
- Fixes downloading of spkgm modules with ignores when .spkgmrc is overridden with a relative tmp path. [#17](https://github.com/spkgm/config/issues/17) [spkgm/spkgm#1299](https://github.com/spkgm/spkgm/issues/1299)

## 0.5.1 - 2014-05-21
- [perf] Uses the same mout version as spkgm
- [perf] Uses only relevant parts of mout. Related [spkgm/spkgm#1134](https://github.com/spkgm/spkgm/pull/1134)

## 0.5.0 - 2013-08-30
- Adds a DEFAULT_REGISTRY key to the Config class that exposes the spkgm registry UR. [#6](https://github.com/spkgm/config/issues/6)

## 0.4.5 - 2013-08-28
- Fixes crashing when home is not set

## 0.4.4 - 2013-08-21
- Supports nested environment variables [#8](https://github.com/spkgm/config/issues/8)

## 0.4.3 - 2013-08-19
- Improvement in argv.config parsing

## 0.4.2 - 2013-08-18
- Sets interative to auto

## 0.4.1 - 2013-08-18
- Generates a fake user instead of using 'unknown'

## 0.4.0 - 2013-08-16
- Suffixes temp folder with the user and 'spkgm'

## 0.3.5 - 2013-08-14
- Casts buffer to string

## 0.3.4 - 2013-08-11
- Empty .spkgmrc files no longer throw an error.

## 0.3.3 - 2013-08-11
- Changes git folder to empty (was not being used anyway)

## 0.3.2 - 2013-08-07
- Uses a known user agent by default when a proxy.

## 0.3.1 - 2013-08-06
- Fixes Typo

## 0.3.0 - 2013-08-06
- Appends the username when using the temporary folder.
