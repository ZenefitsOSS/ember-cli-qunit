/* globals jQuery,QUnit */

jQuery(document).ready(function() {
  var TestLoaderModule = require('ember-cli/test-loader');
  var TestLoader = TestLoaderModule['default'];
  var addModuleExcludeMatcher = TestLoaderModule['addModuleExcludeMatcher'];
  var addModuleIncludeMatcher = TestLoaderModule['addModuleIncludeMatcher'];
  var moduleFilter;

  if (QUnit.urlParams.module_filter) {
    moduleFilter = new RegExp(decodeURIComponent(QUnit.urlParams.module_filter));
  }

  function excludeModule(moduleName) {
    return ( moduleFilter && !moduleName.match(moduleFilter) ) ||
           ( QUnit.urlParams.nolint && moduleName.match(/\.(jshint|lint-test)$/) );
  }

  function includeModule(moduleName) {
    return moduleName.match(/\.jshint$/);
  }

  if (addModuleExcludeMatcher && addModuleIncludeMatcher) {
    addModuleExcludeMatcher(excludeModule);
    addModuleIncludeMatcher(includeModule);
  } else {
    TestLoader.prototype.shouldLoadModule = function shouldLoadModule(moduleName) {
      return (moduleName.match(/[-_]test$/) || includeModule(moduleName)) && !excludeModule(moduleName);
    };
  }

  TestLoader.prototype.moduleLoadFailure = function(moduleName, error) {
    QUnit.module('TestLoader Failures');
    QUnit.test(moduleName + ': could not be loaded', function() {
      throw error;
    });
  };

  var autostart = QUnit.config.autostart !== false;
  QUnit.config.autostart = false;

  setTimeout(function() {
    TestLoader.load();

    if (autostart) {
      QUnit.start();
    }
  }, 250);
});
