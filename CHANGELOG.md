* Added a boolean property filter test.

v0.1.5

* Allowed a lambda alias to be any valid resource name and to be only a valid resource name, rather than any single character.

v0.1.4

* Updated ometa-js
* Added tests for grandchild lambdas.
* Allow `test.only`/`test.skip` to work with expand tests.
* Fix nested expand tests not actually testing nested expands.

v0.1.3

* Added support for brackets (and a bunch of other chars), as well as '', in quoted text.

v0.1.2

* Switched to being a scoped package.

v0.1.1

* Added support for options in a $expand (eg `/a?$expand=b($filter=c eq 'd')`)
