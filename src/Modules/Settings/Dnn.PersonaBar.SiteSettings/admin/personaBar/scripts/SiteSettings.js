﻿'use strict';
define(['jquery',
    'main/config'
],
    function ($, cf) {
        var utility;
        var config = cf.init();

        function loadScript() {
            var url = "modules/dnn.sitesettings/scripts/bundles/site-settings-bundle.js";
            
            $.ajax({
                dataType: "script",
                cache: true,
                url: url
            });
        }

        return {
            init: function (wrapper, util, params, callback) {
                utility = util;

                window.dnn.initSiteSettings = function initializeSiteSettings() {
                    return {
                        utility: utility,
                        settings: params.settings,
                        moduleName: 'SiteSettings'
                    };
                };
                loadScript();
                
                if (typeof callback === "function") {
                    callback();
                }
            },

            initMobile: function (wrapper, util, params, callback) {
                this.init(wrapper, util, params, callback);
            },

            load: function (params, callback) {
                if (typeof callback === 'function') {
                    callback();
                }
            },

            loadMobile: function (params, callback) {
                this.load(params, callback);
            }
        };
    });

