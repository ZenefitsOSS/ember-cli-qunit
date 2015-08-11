/* globals jQuery,QUnit */

jQuery(document).ready(function() {
  var TestLoaderModule = require('ember-cli/test-loader');
  var TestLoader = TestLoaderModule['default'];
  var addModuleIncludeMatcher = TestLoaderModule['addModuleIncludeMatcher'];
  var urlParams = QUnit.urlParams;
  var moduleFilter;
  
  if (urlParams.module_filter) {
    moduleFilter = new RegExp(decodeURIComponent(urlParams.module_filter));
  }

  function moduleMatcher(moduleName) {
    return ( !moduleFilter || moduleName.match(moduleFilter) ) && 
        ( moduleName.match(/\/.*[-_]test$/) || (!urlParams.nojshint && moduleName.match(/\.jshint$/)) );
  };
  
  if (addModuleIncludeMatcher) {
    addModuleIncludeMatcher(moduleMatcher);
  } else {
    TestLoader.prototype.shouldLoadModule = moduleMatcher;
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
