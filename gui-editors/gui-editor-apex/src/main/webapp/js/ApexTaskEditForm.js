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

import {taskTab_reset} from "./ApexTaskTab";
import {dropdownList} from "./dropdownList";
import { ajax_delete, ajax_getWithKeyInfo, ajax_post, ajax_put, ajax_get } from "./ApexAjax";
import { formUtils_generateDescription, formUtils_generateUUID } from "./ApexFormUtils";
import { apexUtils_removeElement, apexUtils_emptyElement, apexUtils_areYouSure, createAddFormButton, scrollToTop } from "./ApexUtils";
import { showHideTextarea } from "./showhideTextarea";
import {keyInformationTab_reset} from "./ApexKeyInformationTab";

function editTaskForm_createTask(formParent) {
    // Get all contextAlbums too for task context album references
    var requestURL = window.restRootURL + "/ContextAlbum/Get?name=&version=";
    var contextAlbums = new Array();
    ajax_get(requestURL, function(data3) {
        for (let value of data3.messages) {
            var contextAlbum = JSON.parse(value);
            var ca = {
                "name" : contextAlbum.key.name,
                "version" : contextAlbum.key.version,
                "displaytext" : contextAlbum.key.name + ":" + contextAlbum.key.version,
                "contextAlbum" : contextAlbum
            };
            contextAlbums.push(ca);
        }
        editTaskForm_activate(formParent, "CREATE", null, contextAlbums);
    });
}

function editTaskForm_deleteTask(parent, name, version) {
    var message = "Are you sure you want to delete Task \"" + name + ":" + version + "\"?";
    if (apexUtils_areYouSure(message)) {
        var requestURL = window.restRootURL + "/Task/Delete?name=" + name + "&version=" + version;
        ajax_delete(requestURL, function(data) {
            apexUtils_removeElement("editTaskFormDiv");
            taskTab_reset();
            keyInformationTab_reset()
        });
    }
}

function editTaskForm_viewTask(formParent, name, version) {
    editTaskForm_editTask_inner(formParent, name, version, "VIEW");
}

function editTaskForm_editTask(formParent, name, version) {
    editTaskForm_editTask_inner(formParent, name, version, "EDIT");
}

function editTaskForm_editTask_inner(formParent, name, version, viewOrEdit) {
    var requestURL = window.restRootURL + "/Task/Get?name=" + name + "&version=" + version;
    ajax_getWithKeyInfo(requestURL, function(task) {
        // Get all contextAlbums too for task context album references
        requestURL = window.restRootURL + "/ContextAlbum/Get?name=&version=";
        var contextAlbums = new Array();
        ajax_get(requestURL, function(data3) {
            for (let value of data3.messages) {
                var contextAlbum = JSON.parse(value);
                var ca = {
                    "name" : contextAlbum.key.name,
                    "version" : contextAlbum.key.version,
                    "displaytext" : contextAlbum.key.name + ":" + contextAlbum.key.version,
                    "contextAlbum" : contextAlbum
                };
                contextAlbums.push(ca);
            }
            editTaskForm_activate(formParent, viewOrEdit, task, contextAlbums);
        });
    });
}

function editTaskForm_activate(parent, operation, task, contextAlbums) {
    apexUtils_removeElement("editTaskFormDiv");
    var formParent = document.getElementById(parent);

    //Testing purposes
    if(formParent === null) {
        formParent = document.createElement('testFormParent');
    }
    apexUtils_emptyElement(parent);

    var createEditOrView = "";

    if (!operation) {
        console.warn("No operation specified for TaskForm form")
    } else {
        createEditOrView = operation.toUpperCase();
    }

    if (createEditOrView == "EDIT" || createEditOrView == "VIEW") {

        if (!task) {
            console.warn("Invalid value (\"" + task + "\") passed as a value for \"task\" for TaskForm form.");
        } else {
            if (!task.key || !task.key.name || task.key.name == "") {
                console.warn("Invalid value (\"" + task.key.name
                        + "\") passed as a value for \"name\" for TaskForm form.");
            }
            if (!task.key || !task.key.version || task.key.version == "") {
                console.warn("Invalid value (\"" + task.key.version
                        + "\") passed as a value for \"version\" for TaskForm form.");
            }
            if (!task.uuid || task.uuid == "") {
                console.warn("Invalid value (\"" + task.uuid + "\") passed as a value for \"uuid\" for TaskForm form.");
            }
        }
    } else {
        console.warn("Invalid operation (\"" + operation
                + "\") specified for TaskForm form. Only \"Create\", \"Edit\" and \"View\" operations are supported");
    }

    var contentelement = document.createElement("editTaskFormDiv");
    var formDiv = document.createElement("div");
    contentelement.appendChild(formDiv);
    formDiv.setAttribute("id", "editTaskFormDiv");
    formDiv.setAttribute("class", "editTaskFormDiv");

    var headingSpan = document.createElement("h2");
    formDiv.appendChild(headingSpan);
    headingSpan.innerHTML = "Task Editor";

    var form = document.createElement("editTaskForm");
    formDiv.appendChild(form);

    form.setAttribute("id", "editTaskForm");
    form.setAttribute("class", "form-style-1");
    form.setAttribute("method", "post");
    form.setAttribute("createEditOrView", createEditOrView);

    var formul = document.createElement("ul");
    form.appendChild(formul);

    var nameLI = document.createElement("li");
    formul.appendChild(nameLI);
    var nameLabel = document.createElement("label");
    nameLI.appendChild(nameLabel);
    nameLabel.setAttribute("for", "editTaskFormNameInput");
    nameLabel.innerHTML = "Name: ";
    var nameLabelSpan = document.createElement("span");
    nameLabel.appendChild(nameLabelSpan);
    nameLabelSpan.setAttribute("class", "required");
    nameLabelSpan.innerHTML = "*";
    var nameInput = document.createElement("input");
    nameLI.appendChild(nameInput);
    nameInput.setAttribute("id", "editTaskFormNameInput");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "editTaskFormNameInput");
    nameInput.setAttribute("class", "field ebInput");
    nameInput.setAttribute("placeholder", "name");
    if (task && task.key && task.key.name) {
        nameInput.value = task.key.name;
    }
    if (createEditOrView != "CREATE") {
        nameInput.readOnly = true;
    }

    var versionLI = document.createElement("li");
    formul.appendChild(versionLI);
    var versionLabel = document.createElement("label");
    versionLI.appendChild(versionLabel);
    versionLabel.setAttribute("for", "editTaskFormVersionInput");
    versionLabel.innerHTML = "Version: ";
    var versionInput = document.createElement("input");
    versionLI.appendChild(versionInput);
    versionInput.setAttribute("id", "editTaskFormVersionInput");
    versionInput.setAttribute("type", "text");
    versionInput.setAttribute("name", "editTaskFormVersionInput");
    versionInput.setAttribute("class", "field ebInput");
    versionInput.setAttribute("placeholder", "0.0.1");
    if (task && task.key && task.key.version) {
        versionInput.value = task.key.version;
    }
    if (createEditOrView != "CREATE") {
        versionInput.readOnly = true;
    }

    var uuidLI = document.createElement("li");
    formul.appendChild(uuidLI);
    var uuidLabel = document.createElement("label");
    uuidLI.appendChild(uuidLabel);
    uuidLabel.setAttribute("for", "editTaskFormUuidInput");
    uuidLabel.innerHTML = "UUID: ";
    var uuidInput = document.createElement("input");
    uuidLI.appendChild(uuidInput);
    uuidInput.setAttribute("id", "editTaskFormUuidInput");
    uuidInput.setAttribute("type", "text");
    uuidInput.setAttribute("name", "editTaskFormUuidInput");
    uuidInput.setAttribute("class", "field-long ebInput ebInput_width_full");
    uuidInput.setAttribute("placeholder", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
    if (task && task.uuid) {
        uuidInput.value = task.uuid;
    }
    if (createEditOrView != "CREATE") {
        uuidInput.readOnly = true;
    }

    var edit_disabled = (createEditOrView != "CREATE" && createEditOrView != "EDIT");

    // description
    var descriptionLI = document.createElement("li");
    formul.appendChild(descriptionLI);
    var descriptionLabel = document.createElement("label");
    descriptionLI.appendChild(descriptionLabel);
    descriptionLabel.setAttribute("for", "editTaskFormDescriptionTextArea");
    descriptionLabel.innerHTML = "Description: ";
    var descriptionTextArea = document.createElement("textarea");
    descriptionLI.appendChild(descriptionTextArea);
    descriptionTextArea.setAttribute("id", "editTaskFormDescriptionTextArea");
    descriptionTextArea.setAttribute("name", "editTaskFormDescriptionTextArea");
    descriptionTextArea.setAttribute("class", "field-long field-textarea ebTextArea ebTextArea_width_full");
    if (task && task.description) {
        descriptionTextArea.value = task.description;
    }
    descriptionTextArea.readOnly = edit_disabled;

    // tasklogic
    var tasklogicLI = document.createElement("li");
    formul.appendChild(tasklogicLI);
    var tasklogicLabel = document.createElement("label");
    tasklogicLI.appendChild(tasklogicLabel);
    tasklogicLabel.setAttribute("for", "editTaskFormTaskLogicTextArea");
    tasklogicLabel.innerHTML = "Task Logic: ";
    var tlogic = null;
    if (task && task.taskLogic && task.taskLogic.logic) {
        tlogic = task.taskLogic.logic;
    }
    // showHideTextarea(id_prefix, content, initialshow, editable, disabled)
    var textarea = showHideTextarea("editTaskFormTaskLogicTextArea", tlogic, false, !edit_disabled, false);

    tasklogicLI.appendChild(textarea);

    // tasklogic type
    var taskLogicTypeLI = document.createElement("li");
    formul.appendChild(taskLogicTypeLI);
    var taskLogicTypeLabel = document.createElement("label");
    taskLogicTypeLI.appendChild(taskLogicTypeLabel);
    taskLogicTypeLabel.setAttribute("for", "editTaskFormTaskLogicTypeInput");
    taskLogicTypeLabel.innerHTML = "Task Logic Type / Flavour: ";
    var taskLogicTypeInput = document.createElement("input");
    taskLogicTypeLI.appendChild(taskLogicTypeInput);
    taskLogicTypeInput.setAttribute("id", "editTaskFormTaskLogicTypeInput");
    taskLogicTypeInput.setAttribute("type", "text");
    taskLogicTypeInput.setAttribute("name", "editTaskFormTaskLogicTypeInput");
    taskLogicTypeInput.setAttribute("class", "field-taskLogicType ebInput");
    taskLogicTypeInput.setAttribute("placeholder", "MVEL");
    if (task && task.taskLogic && task.taskLogic.logicFlavour) {
        taskLogicTypeInput.value = task.taskLogic.logicFlavour;
    }
    if (createEditOrView != "CREATE" && createEditOrView != "EDIT") {
        taskLogicTypeInput.readOnly = true;
    }

    // parameters
    var paramsLI = document.createElement("li");
    formul.appendChild(paramsLI);
    var paramsLabel = document.createElement("label");
    paramsLI.appendChild(paramsLabel);
    paramsLabel.setAttribute("for", "editTaskFormParamsTable");
    paramsLabel.innerHTML = "Task Parameters: ";
    var paramstable = document.createElement("table");
    paramstable.setAttribute("id", "editTaskFormParamsTable");
    paramstable.setAttribute("name", "editTaskFormParamsTable");
    paramstable.setAttribute("class", "table-taskparam");
    paramsLI.appendChild(paramstable);
    var paramstable_head = document.createElement("thead");
    paramstable.appendChild(paramstable_head);
    var paramstable_head_tr = document.createElement("tr");
    paramstable_head.appendChild(paramstable_head_tr);
    paramstable_head_tr.appendChild(document.createElement("th")); // empty,
                                                                    // for
                                                                    // delete
                                                                    // button
    var paramstable_head_th = document.createElement("th");
    paramstable_head_tr.appendChild(paramstable_head_th);
    paramstable_head_th.innerHTML = "Task Parameter Name: ";
    paramstable_head_th.setAttribute("class", "table-taskparam-heading form-heading");
    paramstable_head_th = document.createElement("th");
    paramstable_head_tr.appendChild(paramstable_head_th);
    paramstable_head_th.innerHTML = "Task Parameter Value: ";
    paramstable_head_th.setAttribute("class", "table-taskparam-heading form-heading");
    var paramstable_body = document.createElement("tbody");
    paramstable.appendChild(paramstable_body);
    // Add the params
    if (task && task.taskParameters && task.taskParameters.entry) {
        for (let paramEntry of task.taskParameters.entry) {
            var paramName = paramEntry.key;
            var paramValue = paramEntry.value.defaultValue;
            editTaskForm_addTaskParameter(paramstable_body, (createEditOrView == "VIEW"), paramName, paramValue);
        }
    }
    // add the Task Parameter button
    if (createEditOrView == "CREATE" || createEditOrView == "EDIT") {
        var paramTR = document.createElement("tr");
        paramTR.setAttribute("class", "field-taskparam-tr.new");
        paramstable_body.appendChild(paramTR);
        var paramTD = document.createElement("td");
        paramTD.setAttribute("colspan", "3");
        paramTR.appendChild(paramTD);
        var addParamInput = createAddFormButton();
        paramTD.appendChild(addParamInput);
        addParamInput.onclick = function() {
            editTaskForm_addTaskParameter(paramstable_body, false, null, null);
        };
    }

    // Context Albums references
    var contextsLI = document.createElement("li");
    formul.appendChild(contextsLI);
    var contextsLabel = document.createElement("label");
    contextsLI.appendChild(contextsLabel);
    contextsLabel.setAttribute("for", "editTaskFormContextsTable");
    contextsLabel.innerHTML = "Context Albums used in Task Logic: ";
    var contextstable = document.createElement("table");
    contextstable.setAttribute("id", "editTaskFormContextsTable");
    contextstable.setAttribute("name", "editTaskFormContextsTable");
    contextstable.setAttribute("class", "table-taskcontext");
    contextsLI.appendChild(contextstable);
    var contextstable_head = document.createElement("thead");
    contextstable.appendChild(contextstable_head);
    var contextstable_head_tr = document.createElement("tr");
    contextstable_head.appendChild(contextstable_head_tr);
    contextstable_head_tr.appendChild(document.createElement("th")); // empty,
                                                                        // for
                                                                        // delete
                                                                        // button
    var contextstable_head_th = document.createElement("th");
    contextstable_head_tr.appendChild(contextstable_head_th);
    contextstable_head_th.innerHTML = "Context Album: ";
    contextstable_head_th.setAttribute("class", "table-taskcontext-heading form-heading");
    var contextstable_body = document.createElement("tbody");
    contextstable.appendChild(contextstable_body);
    // Add the contexts
    if (task && task.contextAlbumReference && $.isArray(task.contextAlbumReference)) {
        for (let contextEntry of task.contextAlbumReference) {
            var contextName = contextEntry.name + ":" + contextEntry.version;
            var ce = {
                "name" : contextEntry.name,
                "version" : contextEntry.version,
                "displaytext" : contextName
            };
            editTaskForm_addTaskContext(contextstable_body, (createEditOrView == "VIEW"), contextName, ce,
                    contextAlbums);
        }
    }
    // add the Task Context button
    if (createEditOrView == "CREATE" || createEditOrView == "EDIT") {
        var contextTR = document.createElement("tr");
        contextTR.setAttribute("class", "field-taskcontext-tr.new");
        contextstable_body.appendChild(contextTR);
        var contextTD = document.createElement("td");
        contextTD.setAttribute("colspan", "2");
        contextTR.appendChild(contextTD);
        var addContextInput = createAddFormButton();
        contextTD.appendChild(addContextInput);
        addContextInput.onclick = function() {
            editTaskForm_addTaskContext(contextstable_body, false, null, null, contextAlbums);
        };
    }

    // buttons
    var inputLI = document.createElement("li");
    formul.appendChild(inputLI);
    if (createEditOrView == "CREATE") {
        var generateUUIDInput = document.createElement("button");
        inputLI.appendChild(generateUUIDInput);
        generateUUIDInput.setAttribute("id", "generateUUID");
        generateUUIDInput.setAttribute("class", "ebBtn ebBtn_large");
        generateUUIDInput.setAttribute("type", "submit");
        generateUUIDInput.setAttribute("value", "Generate UUID");
        generateUUIDInput.onclick = editTaskForm_generateUUIDPressed;
        generateUUIDInput.innerHTML = generateUUIDInput.getAttribute("value");
        var inputSpan0 = document.createElement("span");
        inputLI.appendChild(inputSpan0);
        inputSpan0.setAttribute("class", "required");
        inputSpan0.innerHTML = " ";

        var generateDescriptionInput = document.createElement("button");
        inputLI.appendChild(generateDescriptionInput);
        generateDescriptionInput.setAttribute("id", "generateDescription");
        generateDescriptionInput.setAttribute("class", "ebBtn ebBtn_large");
        generateDescriptionInput.setAttribute("type", "submit");
        generateDescriptionInput.setAttribute("value", "Generate Description");
        generateDescriptionInput.onclick = editTaskForm_generateDescriptionPressed;
        generateDescriptionInput.innerHTML = generateDescriptionInput.getAttribute("value");
        var inputSpan1 = document.createElement("span");
        inputLI.appendChild(inputSpan1);
        inputSpan1.setAttribute("class", "required");
        inputSpan1.innerHTML = " ";
    }

    var cancelInput = document.createElement("button");
    inputLI.appendChild(cancelInput);
    cancelInput.setAttribute("id", "cancel");
    cancelInput.setAttribute("class", "ebBtn ebBtn_large");
    cancelInput.setAttribute("type", "submit");
    cancelInput.setAttribute("value", "Cancel");
    cancelInput.onclick = editTaskForm_cancelPressed;
    cancelInput.innerHTML = cancelInput.getAttribute("value");

    if (createEditOrView == "CREATE" || createEditOrView == "EDIT") {
        var inputSpan2 = document.createElement("span");
        inputLI.appendChild(inputSpan2);
        inputSpan2.setAttribute("class", "required");
        inputSpan2.innerHTML = " ";
        var submitInput = document.createElement("button");
        inputLI.appendChild(submitInput);
        submitInput.setAttribute("id", "submit");
        submitInput.setAttribute("class", "ebBtn ebBtn_large");
        submitInput.setAttribute("type", "submit");
        submitInput.setAttribute("value", "Submit");
        submitInput.onclick = editTaskForm_submitPressed;
        submitInput.innerHTML = submitInput.getAttribute("value");
    }

    formParent.appendChild(contentelement);
    scrollToTop();
}

function editTaskForm_addTaskParameter(parentTBody, disabled, name, value) {
    var random_suffix = formUtils_generateUUID();

    var paramTR = parentTBody.insertRow(parentTBody.rows.length - 1);
    paramTR.setAttribute("param_id", random_suffix);
    paramTR.setAttribute("class", "field-taskparam-tr");
    if (name == null && value == null && !disabled) {
        paramTR.setAttribute("class", "field-taskparam-tr.new field-add-new");
        $(paramTR).show("fast");
    }

    var deleteTD = document.createElement("td");
    paramTR.appendChild(deleteTD);
    var deleteDiv = document.createElement("div");
    deleteTD.appendChild(deleteDiv);
    if (!disabled) {
        deleteDiv.setAttribute("class", "ebIcon ebIcon_interactive ebIcon_delete");
        deleteDiv.onclick = function(event) {
            $(paramTR).hide("fast", function() {
                paramTR.parentNode.removeChild(paramTR);
            });
        }
    } else {
        deleteDiv.setAttribute("class", "ebIcon ebIcon_interactive ebIcon_delete ebIcon_disabled");
    }
    var nameTD = document.createElement("td");
    paramTR.appendChild(nameTD);
    var nameInput = document.createElement("input");
    nameTD.appendChild(nameInput);
    nameInput.setAttribute("id", "editTaskFormParamName" + "_" + random_suffix);
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "editTaskFormParamName" + "_" + random_suffix);
    nameInput.setAttribute("class", "field-taskparam-name ebInput ebInput_width_xLong");
    if (name == null && value == null && !disabled) {
        nameInput.setAttribute("class", "field-taskparam-name.new ebInput ebInput_width_xLong");
    }
    nameInput.setAttribute("placeholder", "Task Parameter Name");
    if (name) {
        nameInput.value = name;
    }
    nameInput.readOnly = disabled;

    var valueTD = document.createElement("td");
    paramTR.appendChild(valueTD);
    var paramInput = document.createElement("input");
    valueTD.appendChild(paramInput);
    paramInput.setAttribute("id", "editTaskFormParamValue" + "_" + random_suffix);
    paramInput.setAttribute("type", "text");
    paramInput.setAttribute("name", "editTaskFormParamValue" + "_" + random_suffix);
    paramInput.setAttribute("class", "field-taskparam-value  ebInput ebInput_width_xLong");
    if (name == null && value == null && !disabled) {
        paramInput.setAttribute("class", "field-taskparam-value.new ebInput ebInput_width_xLong");
    }
    paramInput.setAttribute("placeholder", "Task Parameter Value");
    if (value) {
        paramInput.value = value;
    }
    paramInput.readOnly = disabled;
}

function editTaskForm_addTaskContext(parentTBody, disabled, name, albumreference, contextAlbums) {
    var random_suffix = formUtils_generateUUID();

    var contextTR = parentTBody.insertRow(parentTBody.rows.length - 1);
    contextTR.setAttribute("context_id", random_suffix);
    contextTR.setAttribute("class", "field-taskcontext-tr");
    if (name == null && albumreference == null && !disabled) {
        contextTR.setAttribute("class", "field-taskcontext-tr.new field-add-new");
        $(contextTR).show("fast");
    }

    var deleteTD = document.createElement("td");
    contextTR.appendChild(deleteTD);
    var deleteDiv = document.createElement("div");
    deleteTD.appendChild(deleteDiv);
    if (!disabled) {
        deleteDiv.setAttribute("class", "ebIcon ebIcon_interactive ebIcon_delete");
        deleteDiv.onclick = function(event) {
            $(contextTR).hide("fast", function() {
                contextTR.parentNode.removeChild(contextTR);
            });
        }
    } else {
        deleteDiv.setAttribute("class", "ebIcon ebIcon_interactive ebIcon_delete ebIcon_disabled");
    }
    var valueTD = document.createElement("td");
    contextTR.appendChild(valueTD);

    var selectDiv = dropdownList("editTaskFormContextValue" + "_" + random_suffix, contextAlbums, albumreference,
            disabled, null);
    valueTD.appendChild(selectDiv);
}

function editTaskForm_generateUUIDPressed() {
    document.getElementById("editTaskFormUuidInput").value = formUtils_generateUUID();
}

function editTaskForm_generateDescriptionPressed() {
    document.getElementById("editTaskFormDescriptionTextArea").value = formUtils_generateDescription(document
            .getElementById("editTaskFormNameInput").value, document.getElementById("editTaskFormVersionInput").value,
            document.getElementById("editTaskFormUuidInput").value);
}

function editTaskForm_cancelPressed() {
    apexUtils_removeElement("editTaskFormDiv");
    taskTab_reset();
}

function editTaskForm_submitPressed() {
    var createEditOrView = document.getElementById("editTaskForm").getAttribute("createEditOrView");
    if (!createEditOrView || createEditOrView == "" || (createEditOrView != "CREATE" && createEditOrView != "EDIT")) {
        console.error("Invalid operation \"" + createEditOrView
                + "\" passed to editTaskForm_submitPressed function. Edit failed");
        apexUtils_removeElement("editTaskFormDiv");
        taskTab_reset();
        return;
    }

    var name = document.getElementById('editTaskFormNameInput').value;
    var version = document.getElementById('editTaskFormVersionInput').value;

    // get the logic fields
    var logicfield = document.getElementById("editTaskFormTaskLogicTextArea_textarea").value;
    var logictype = document.getElementById("editTaskFormTaskLogicTypeInput").value;
    if (logictype == null || logictype == "") {
        alert("Task \"" + name + "\" has no Task Logic Type");
        return false;
    }
    if (logicfield == null || logicfield == "") {
        alert("Task \"" + name + "\" has no Task Logic");
        return false;
    }
    var tasklogic = {
        "logic" : logicfield,
        "logicFlavour" : logictype
    };
    // get the task parameters
    var taskbean_parameters = null;
    var paramstablerows = document.getElementById("editTaskFormParamsTable").rows;
    if (paramstablerows && paramstablerows.length > 2) {
        taskbean_parameters = new Object();
        for (var h = 1; h < paramstablerows.length - 1; h++) {
            var paramTR = paramstablerows[h];
            if (paramTR && paramTR.getAttribute("param_id")) {
                var param_id = paramTR.getAttribute("param_id");
                var paramname = document.getElementById("editTaskFormParamName" + "_" + param_id).value;
                var paramvalue = document.getElementById("editTaskFormParamValue" + "_" + param_id).value;
                if (taskbean_parameters[paramname]) {
                    alert("Task \"" + name + "\" contains more than one Task Parameters called \"" + paramname + "\"");
                    return false;
                }
                taskbean_parameters[paramname] = {
                    "parameterName" : paramname,
                    "defaultValue" : paramvalue
                };
            }
        }
    }
    // get the context album references
    var taskbean_context = null;
    var contextstablerows = document.getElementById("editTaskFormContextsTable").rows;
    if (contextstablerows && contextstablerows.length > 2) {
        taskbean_context = new Array();
        for (var s = 1; s < contextstablerows.length - 1; s++) {
            var contextTR = contextstablerows[s];
            if (contextTR && contextTR.getAttribute("context_id")) {
                var context_id = contextTR.getAttribute("context_id");
                var contextalbumvalue = document.getElementById("editTaskFormContextValue" + "_" + context_id
                        + "_dropdownList").selectedOption;
                if (contextalbumvalue == null) {
                    alert("Task \"" + name + "\" has Context Album reference, but no Context Album is selected");
                    return false;
                }
                var contextalbumname = contextalbumvalue.displaytext;
                for (let value of taskbean_context) {
                    if (value != null && value.name == contextalbumvalue.name
                            && value.version == contextalbumvalue.version) {
                        alert("Task \"" + name + "\" references Context Album \"" + contextalbumname
                                + "\" more than once");
                        return false;
                    }
                }
                taskbean_context.push({
                    "name" : contextalbumvalue.name,
                    "version" : contextalbumvalue.version
                });
            }
        }
    }

    // generate an task bean to json-ify and send in rest request
    var taskbean = {
        "name" : name,
        "version" : version,
        "uuid" : document.getElementById('editTaskFormUuidInput').value,
        "description" : document.getElementById('editTaskFormDescriptionTextArea').value,
        "taskLogic" : tasklogic,
        "parameters" : taskbean_parameters,
        "contexts" : taskbean_context
    }
    var jsonString = JSON.stringify(taskbean);

    if (createEditOrView == "CREATE") {
        var requestURL = window.restRootURL + "/Task/Create";
        ajax_post(requestURL, jsonString, function(resultData) {
            apexUtils_removeElement("editTaskFormDiv");
            taskTab_reset();
            keyInformationTab_reset()
        });
    } else if (createEditOrView == "EDIT") {
        requestURL = window.restRootURL + "/Task/Update";
        ajax_put(requestURL, jsonString, function(resultData) {
            apexUtils_removeElement("editTaskFormDiv");
            taskTab_reset();
            keyInformationTab_reset()
        });
    }

}

export {
    editTaskForm_activate,
    editTaskForm_addTaskContext,
    editTaskForm_addTaskParameter,
    editTaskForm_cancelPressed,
    editTaskForm_createTask,
    editTaskForm_deleteTask,
    editTaskForm_editTask,
    editTaskForm_editTask_inner,
    editTaskForm_generateDescriptionPressed,
    editTaskForm_generateUUIDPressed,
    editTaskForm_submitPressed,
    editTaskForm_viewTask
}
