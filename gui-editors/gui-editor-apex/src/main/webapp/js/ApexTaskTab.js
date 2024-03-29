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

import {createTable} from "./ApexTable";
import {ajax_get} from "./ApexAjax";
import {rightClickMenu_scopePreserver} from "./contextMenu";
import {apexUtils_removeElement} from "./ApexUtils";

function taskTab_reset() {
    taskTab_deactivate();
    taskTab_activate();
}

function taskTab_activate() {
    taskTab_create();

    const requestURL = window.restRootURL + "/Task/Get?name=&version=";

    ajax_get(requestURL, function(data) {
        $("#taskTableBody").find("tr:gt(0)").remove();

        for (let value of data.messages) {
            const task = JSON.parse(value);

            const taskRow_tr = document.createElement("tr");

            var taskTableRow =
                "<td>"                              +
                task.key.name + ":"  + task.key.version +
                "</td>"                                 +
                "<td>"                                  +
                task.taskLogic.logicFlavour             +
                "</td>";

            taskTableRow += "<td><table class='ebTable'><thead><tr class='headerRow'><th>Parameter Name</th><th>Default Value</th></tr></thead><tbody>";
            for (let parameterEntry of task.taskParameters.entry) {

                taskTableRow +=
                    "<tr><td>"                        +
                    parameterEntry.key                +
                    "</td>"                           +
                    "<td>"                            +
                    parameterEntry.value.defaultValue +
                    "</td>";
            }
            taskTableRow += "</tbody></table></td>";

            taskTableRow += "<td><table class='ebTable'><tbody>";
            for (let contextAlbumReference of task.contextAlbumReference) {

                taskTableRow +=
                    "<tr><td>"                            +
                    contextAlbumReference.name + ":" + contextAlbumReference.version  +
                    "</td></tr>";
            }
            taskTableRow += "</tbody></table></td>";

            taskRow_tr.innerHTML = taskTableRow;
            taskRow_tr.addEventListener('contextmenu', rightClickMenu_scopePreserver("taskTabContent", "Task", task.key.name, task.key.version));

            $("#taskTableBody").append(taskRow_tr);

        }
    });
}

function taskTab_deactivate() {
    apexUtils_removeElement("taskTabContent");
}

function taskTab_create() {
    var taskTab = document.getElementById("tasksTab");

    //Testing purposes
    if(taskTab === null) {
        taskTab = document.createElement("tasksTab");
    }

    var taskTabContent = document.getElementById("taskTabContent");
    if (taskTabContent != null) {
        return
    }

    taskTabContent = document.createElement("taskTabContent");
    taskTab.appendChild(taskTabContent);
    taskTabContent.setAttribute("id", "taskTabContent");
    taskTabContent.addEventListener('contextmenu', rightClickMenu_scopePreserver("taskTabContent", "Task", null, null));

    var taskTable = createTable("taskTable");
    taskTabContent.appendChild(taskTable);

    var taskTableHeader = document.createElement("thead");
    taskTable.appendChild(taskTableHeader);
    taskTableHeader.setAttribute("id", "taskTableHeader");

    var taskTableHeaderRow = document.createElement("tr");
    taskTableHeader.appendChild(taskTableHeaderRow);
    taskTableHeaderRow.setAttribute("id", "taskTableHeaderRow");

    var taskTableKeyHeader = document.createElement("th");
    taskTableHeaderRow.appendChild(taskTableKeyHeader);
    taskTableKeyHeader.setAttribute("id", "taskTableKeyHeader");
    taskTableKeyHeader.appendChild(document.createTextNode("Task"));

    var taskTableLogicFlavourHeader = document.createElement("th");
    taskTableHeaderRow.appendChild(taskTableLogicFlavourHeader);
    taskTableLogicFlavourHeader.setAttribute("id", "taskTableLogicFlavourHeader");
    taskTableLogicFlavourHeader.appendChild(document.createTextNode("Logic Flavour"));

    var taskTableParameterHeader = document.createElement("th");
    taskTableHeaderRow.appendChild(taskTableParameterHeader);
    taskTableParameterHeader.setAttribute("id", "taskTableParameterHeader");
    taskTableParameterHeader.appendChild(document.createTextNode("Parameters"));

    var taskTableContextReferenceHeader = document.createElement("th");
    taskTableHeaderRow.appendChild(taskTableContextReferenceHeader);
    taskTableContextReferenceHeader.setAttribute("id", "taskTableContextReferenceHeader");
    taskTableContextReferenceHeader.appendChild(document.createTextNode("Context Album References"));

    var taskTableBody = document.createElement("tbody");
    taskTable.appendChild(taskTableBody);
    taskTable.setAttribute("id", "taskTableBody");
}

export {
    taskTab_create,
    taskTab_reset,
    taskTab_activate,
    taskTab_deactivate
};
