/*
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2016-2018 Ericsson. All rights reserved.
 *  Modifications Copyright (C) 2020-2022 Nordix Foundation.
 *  Modifications Copyright (C) 2021 Bell Canada. All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * ============LICENSE_END=========================================================
 */

import {resultForm_activate} from "./ApexResultForm";

const {ajax_put, ajax_get, ajax_getOKOrFail} = require("./ApexAjax");
const {pageControl_modelMode} = require("./ApexPageControl");
const {modelFileName} = require("./ApexNewModelForm");

function files_fileOpen() {
    $('<input type="file">').on('change', function() {
        var reader = new FileReader();
        var fileName = this.files[0].name;
        reader.readAsText(this.files[0]);

        reader.onload = function(event) {
            var requestURL = window.restRootURL + "/Model/Load";
            ajax_put(requestURL, event.target.result, function(resultData) {
                localStorage.setItem("apex_model_loaded", true);
                requestURL = window.restRootURL + "/Model/GetKey";
                ajax_get(requestURL, function(data) {
                    var modelKey = JSON.parse(data.messages[0]);
                    pageControl_modelMode(modelKey.name, modelKey.version, fileName);
                });
            });
        };
    }).click();
}

function files_fileDownload() {
    var requestURL = window.restRootURL + "/Model/Download";

    var downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.download = modelFileName;
    downloadLink.href = requestURL;
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function files_fileUpload() {
    let requestURL = window.restRootURL + "/Model/Upload";
    const userId = new URLSearchParams(window.location.search).get('userId');
    if (userId) {
        requestURL = requestURL + "?userId=" + userId;
    }
    ajax_getOKOrFail(requestURL, function(data) {
        let uploadResultString = "";
        for (let value of data.messages) {
            uploadResultString += (value + "\n");
        }
        resultForm_activate(document.getElementById("mainArea"), "Model Upload Result", uploadResultString);
    });
}

export {files_fileUpload, files_fileDownload, files_fileOpen};
