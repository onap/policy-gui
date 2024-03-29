/*
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2016-2018 Ericsson. All rights reserved.
 *  Modifications Copyright (C) 2020-2022 Nordix Foundation.
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

const {ajax_get} = require("./ApexAjax");
const {createTable} = require('./ApexTable');
const {rightClickMenu_scopePreserver} = require('./contextMenu');
const {apexUtils_escapeHtml, apexUtils_removeElement} = require('./ApexUtils');

function contextSchemaTab_reset() {
    contextSchemaTab_deactivate();
    contextSchemaTab_activate();
}
function contextSchemaTab_activate() {
    contextSchemaTab_create();

    var requestURL = window.restRootURL + "/ContextSchema/Get?name=&version=";

    ajax_get(requestURL, function(data) {
        $("#contextSchemaTableBody").find("tr:gt(0)").remove();

        for (let value of data.messages) {
            var contextSchema = JSON.parse(value);

            var contextSchemaRow_tr = document.createElement("tr");
            var contextSchemaid = contextSchema.key.name + ":"  + contextSchema.key.version;

            var contextSchemaRow =
                "<td>"                                                    +
                contextSchemaid                                         +
                "</td>"                                                    +
                "<td>"                                                    +
                contextSchema.schemaFlavour                                +
                "</td>"                                                    +
                "<td><java>"                                            +
                apexUtils_escapeHtml(contextSchema.schemaDefinition)    +
                "</java></td>";

            contextSchemaRow_tr.innerHTML = contextSchemaRow;
            contextSchemaRow_tr.addEventListener('contextmenu', rightClickMenu_scopePreserver("contextSchemaTabContent", "ContextSchema", contextSchema.key.name, contextSchema.key.version));

            $("#contextSchemaTableBody").append(contextSchemaRow_tr);
        }
    });
}

function contextSchemaTab_deactivate() {
    apexUtils_removeElement("contextSchemaTabContent");
}

function contextSchemaTab_create() {
    var contextSchemaTab = document.getElementById("contextSchemasTab");

    //Testing purposes
    if(contextSchemaTab === null){
        contextSchemaTab = document.createElement('contextSchemasTab');
    }

    var contextSchemaTabContent = document.getElementById("contextSchemaTabContent");
    if (contextSchemaTabContent != null) {
        return
    }

    contextSchemaTabContent = document.createElement("contextSchemaTabContent");
    contextSchemaTab.appendChild(contextSchemaTabContent);
    contextSchemaTabContent.setAttribute("id", "contextSchemaTabContent");
    contextSchemaTabContent.addEventListener('contextmenu', rightClickMenu_scopePreserver("contextSchemaTabContent", "ContextSchema",null,null));

    var contextSchemaTable = createTable("contextSchemaTable");
    contextSchemaTabContent.appendChild(contextSchemaTable);

    var contextSchemaTableHeader = document.createElement("thead");
    contextSchemaTable.appendChild(contextSchemaTableHeader);
    contextSchemaTableHeader.setAttribute("id", "contextSchemaTableHeader");

    var contextSchemaTableHeaderRow = document.createElement("tr");
    contextSchemaTableHeader.appendChild(contextSchemaTableHeaderRow);
    contextSchemaTableHeaderRow.setAttribute("id", "contextSchemaTableHeaderRow");

    var contextSchemaTableKeyHeader = document.createElement("th");
    contextSchemaTableHeaderRow.appendChild(contextSchemaTableKeyHeader);
    contextSchemaTableKeyHeader.setAttribute("id", "contextSchemaTableKeyHeader");
    contextSchemaTableKeyHeader.appendChild(document.createTextNode("Context Item"));

    var contextSchemaTableSchemaFlavourHeader = document.createElement("th");
    contextSchemaTableHeaderRow.appendChild(contextSchemaTableSchemaFlavourHeader);
    contextSchemaTableSchemaFlavourHeader.setAttribute("id", "contextSchemaTableJavatypeHeader");
    contextSchemaTableSchemaFlavourHeader.appendChild(document.createTextNode("Schema Flavour"));

    var contextSchemaTableSchemaDefHeader = document.createElement("th");
    contextSchemaTableHeaderRow.appendChild(contextSchemaTableSchemaDefHeader);
    contextSchemaTableSchemaDefHeader.setAttribute("id", "contextSchemaTableJavatypeHeader");
    contextSchemaTableSchemaDefHeader.appendChild(document.createTextNode("Context Item Schema Definition"));

    var contextSchemaTableBody = document.createElement("tbody");
    contextSchemaTable.appendChild(contextSchemaTableBody);
    contextSchemaTable.setAttribute("id", "contextSchemaTableBody");
}

//Testing purposes
export {
    contextSchemaTab_activate,
    contextSchemaTab_deactivate,
    contextSchemaTab_reset,
    contextSchemaTab_create
}
