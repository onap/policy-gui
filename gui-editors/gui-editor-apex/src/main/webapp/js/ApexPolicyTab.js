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

import {rightClickMenu_scopePreserver} from "./contextMenu";
import {createTable} from "./ApexTable";
import {ajax_get} from "./ApexAjax";
import {apexUtils_removeElement} from "./ApexUtils";

function policyTab_reset() {
    policyTab_deactivate();
    policyTab_activate();
}

function policyTab_activate() {
    policyTab_create();

    var requestURL = window.restRootURL + "/Policy/Get?name=&version=";

    ajax_get(requestURL, function(data) {
        $("#policyTableBody").find("tr:gt(0)").remove();

        for (let value of data.messages) {
            var policy = JSON.parse(value);

            var policyRow_tr = document.createElement("tr");
            var policyid = policy.policyKey.name + ":"  + policy.policyKey.version;

            var policyTableRow =
                "<td>"              +
                policyid            +
                "</td>"             +
                "<td>"              +
                policy.template       +
                "</td>"              +
                "<td>"                +
                policy.firstState     +
                "</td>";

            policyTableRow += "<td><table class='ebTable'><thead><tr class='headerRow'><th>State</th><th>Trigger</th><th>Referenced Tasks</th><th>Default Task</th>";
            policyTableRow += "<th>TSL</th><th>State Outputs</th><th>State Finsalizer Logic</th><th>Context Album References</th></tr></thead><tbody>";

            var states = policy.state.entry;
            for(var s in states) {
                var state = states[s];
                if(state.key == policy.firstState) {
                    states.splice(s, 1);
                    states.unshift(state);
                    break;
                }
            }

            for (let entry of policy.state.entry) {
                var stateName = entry.key;
                state     = entry.value;

                policyTableRow +=
                    "<tr><td>"                                            +
                    stateName                                             +
                    "</td>"                                               +
                    "<td>"                                                +
                    state.trigger.name     + ":"  + state.trigger.version +
                    "</td>";

                policyTableRow += "<td><table class='ebTable'><thead><tr class='headerRow'><th>Task Reference</th><th>Output Type</th><th>Output</th></thead><tbody>";
                for (let taskEntry of state.taskReferences.entry) {
                    var taskKey = taskEntry.key;
                    var taskRef = taskEntry.value;

                    policyTableRow +=
                        "<tr><td>"                +
                        taskKey.name              + ":" + taskKey.version +
                        "</td>"                   +
                        "<td>"                    +
                        taskRef.outputType        +
                        "</td>"                   +
                        "<td>"                    +
                        taskRef.output.localName  +
                        "</td>";
                }
                policyTableRow += "</tbody></table></td>";

                policyTableRow +=
                    "<td>"                                                    +
                    state.defaultTask.name                + ":"  + state.defaultTask.version +
                    "</td>"                               +
                    "<td>"                                +
                    state.taskSelectionLogic.logicFlavour +
                    "</td>";

                policyTableRow += "<td><table class='ebTable'><thead><tr class='headerRow'><th>Name</th><th>Next State</th><th>Event</th></thead><tbody>";
                for (let outputEntry of state.stateOutputs.entry) {

                    policyTableRow +=
                        "<tr><td>"                             +
                        outputEntry.key                        +
                        "</td>"                                +
                        "<td>"                                 +
                        outputEntry.value.nextState.localName  +
                        "</td>"                                +
                        "<td>"                                 +
                        outputEntry.value.outgoingEvent.name + ":" + outputEntry.value.outgoingEvent.version +
                        "</td>";
                }
                policyTableRow += "</tbody></table></td>";

                policyTableRow += "<td><table class='ebTable'><thead><tr class='headerRow'><th>Name</th><th>Type</th></thead><tbody>";
                for (let sflEntry of state.stateFinalizerLogicMap.entry) {

                    policyTableRow +=
                        "<tr><td>"                  +
                        sflEntry.key                +
                        "</td>"                     +
                        "<td>"                      +
                        sflEntry.value.logicFlavour +
                        "</td>";
                }
                policyTableRow += "</tbody></table></td>";


                policyTableRow += "<td><table class='ebTable'><tbody>";
                for (let contextAlbumReference of state.contextAlbumReference) {

                    policyTableRow +=
                        "<tr><td>"  +
                        contextAlbumReference.name + ":" + contextAlbumReference.version +
                        "</td></tr>";
                }
                policyTableRow += "</tbody></table></td></tr>";

                policyTableRow += "</tr>";
            }

            policyTableRow += "</tbody></table></td>";


            policyRow_tr.innerHTML = policyTableRow;
            policyRow_tr.addEventListener('contextmenu', rightClickMenu_scopePreserver("policyTabContent", "Policy", policy.policyKey.name, policy.policyKey.version));

            $("#policyTableBody").append(policyRow_tr);
        }
    });
}

function policyTab_deactivate() {
    apexUtils_removeElement("policyTabContent");
}

function policyTab_create() {
    var policyTab = document.getElementById("policiesTab");

    //Testing purposes
    if(policyTab === null) {
        policyTab = document.createElement("policiesTab");
    }

    var policyTabContent = document.getElementById("policyTabContent");
    if (policyTabContent != null) {
        return
    }

    policyTabContent = document.createElement("policyTabContent");
    policyTab.appendChild(policyTabContent);
    policyTabContent.setAttribute("id", "policyTabContent");
    policyTabContent.addEventListener('contextmenu', rightClickMenu_scopePreserver("policyTabContent", "Policy", null, null));

    var policyTable = createTable("policyTable");
    policyTabContent.appendChild(policyTable);

    var policyTableHeader = document.createElement("thead");
    policyTable.appendChild(policyTableHeader);
    policyTableHeader.setAttribute("id", "policyTableHeader");

    var policyTableHeaderRow = document.createElement("tr");
    policyTableHeader.appendChild(policyTableHeaderRow);
    policyTableHeaderRow.setAttribute("id", "policyTableHeaderRow");

    var policyTableKeyHeader = document.createElement("th");
    policyTableHeaderRow.appendChild(policyTableKeyHeader);
    policyTableKeyHeader.setAttribute("id", "policyTableKeyHeader");
    policyTableKeyHeader.appendChild(document.createTextNode("Policy"));

    var policyTableTemplateHeader = document.createElement("th");
    policyTableHeaderRow.appendChild(policyTableTemplateHeader);
    policyTableTemplateHeader.setAttribute("id", "policyTableTemplateHeader");
    policyTableTemplateHeader.appendChild(document.createTextNode("Template"));

    var policyTableFirstStateHeader = document.createElement("th");
    policyTableHeaderRow.appendChild(policyTableFirstStateHeader);
    policyTableFirstStateHeader.setAttribute("id", "policyTableFirstStateHeader");
    policyTableFirstStateHeader.appendChild(document.createTextNode("First State"));

    var policyTableStatesHeader = document.createElement("th");
    policyTableHeaderRow.appendChild(policyTableStatesHeader);
    policyTableStatesHeader.setAttribute("id", "policyTableStatesHeader");
    policyTableStatesHeader.appendChild(document.createTextNode("States"));

    var policyTableBody = document.createElement("tbody");
    policyTable.appendChild(policyTableBody);
    policyTable.setAttribute("id", "policyTableBody");
}

export {
    policyTab_activate,
    policyTab_create,
    policyTab_deactivate,
    policyTab_reset
}
