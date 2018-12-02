
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as zrUtil from 'zrender/src/core/util';
import TooltipContent from './TooltipContent';

// var each = zrUtil.each;

/**
 * @alias module:echarts/component/tooltip/TooltipContentManager
 * @constructor
 */
function TooltipContentManager(container, api) {

    /**
     * @private
     */
    this._contents = {
        // Default tooltip content
        main: new TooltipContent(container, api)
    };
}

TooltipContentManager.prototype = {

    constructor: TooltipContentManager,

    /**
     * Update when tooltip is rendered
     */
    update: function () {
        this._each('update');
    },

    /**
     * @param {module:echarts/component/tooltip/TooltipModel}
     * @param {string} [key='main']
     */
    show: function (tooltipModel, key) {
        key = key || 'main';
        this._giveContent(key).show(tooltipModel);
    },

    /**
     * Create content if not exists.
     */
    _giveContent: function (key) {
        return this._contents[key] || (
            this._contents[key] = new TooltipContent()
        );
    },

    setContent: function (content) {
        this.el.innerHTML = content;
    },

    setEnterable: function (enterable) {
        this._enterable = enterable;
    },

    getSize: function () {
        var el = this.el;
        return [el.clientWidth, el.clientHeight];
    },

    moveTo: function (x, y) {
        var style = this.el.style;
        style.left = x + 'px';
        style.top = y + 'px';

        this._x = x;
        this._y = y;
    },

    hide: function () {
        this.el.style.display = 'none';
        this._show = false;
    },

    // showLater: function ()

    hideLater: function (time) {
        if (this._show && !(this._inContent && this._enterable)) {
            if (time) {
                this._hideDelay = time;
                // Set show false to avoid invoke hideLater mutiple times
                this._show = false;
                this._hideTimeout = setTimeout(zrUtil.bind(this.hide, this), time);
            }
            else {
                this.hide();
            }
        }
    },

    _each: function (method, args) {
        zrUtil.each(this._contents, function (content) {
            content[method].apply(content, args);
        });
    }
};

export default TooltipContentManager;