/* globals jQuery,QUnit */

jQuery(document).ready(function() {
  var TestLoader = require('ember-cli/test-loader')['default'];
  var urlParams = QUnit.urlParams;
  var moduleFilter;
  if (query.module_filter) {
    moduleFilter = new RegExp(decodeURIComponent(query.module_filter));
  }
  TestLoader.prototype.shouldLoadModule = function(moduleName) {
    if (moduleFilter) {
      return moduleFilter.test(moduleName) && (/[-_]test$/.test(moduleName) ||
            (!urlParams.nojshint && /\.jshint$/.test(moduleName)));
    }
    else {
      return /[-_]test$/.test(moduleName) || (!urlParams.nojshint && /\.jshint$/.test(moduleName));
    }


  };

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
