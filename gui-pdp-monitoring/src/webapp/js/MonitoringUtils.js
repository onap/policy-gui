/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2020 Nordix Foundation.
 *  Modifications Copyright (C) 2021 AT&T Intellectual Property. All rights reserved.
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

import $ from "jquery";
import { createEngineServiceTable } from "./PdpInformation";
import { createEngineSummaryTable } from "./PdpStatisticsSummary";
import { RenderPdpList } from "./PdpListView";

/*
 * Crate a dialog with input, attach it to a given parent and show an optional message
 */
function papDialogFormActivate(formParent, message) {
    papUtilsRemoveElement("papDialogDiv");

    var contentelement = document.createElement("papDialogDiv");
    var formDiv = document.createElement("div");
    var backgroundDiv = document.createElement("div");
    backgroundDiv.setAttribute("id", "papDialogDivBackground");
    backgroundDiv.setAttribute("class", "papDialogDivBackground");

    backgroundDiv.appendChild(formDiv);
    contentelement.appendChild(backgroundDiv);
    formParent.appendChild(contentelement);

    formDiv.setAttribute("id", "papDialogDiv");
    formDiv.setAttribute("class", "papDialogDiv");

    var headingSpan = document.createElement("span");
    formDiv.appendChild(headingSpan);

    headingSpan.setAttribute("class", "headingSpan");
    headingSpan.innerHTML = "PAP Configuration";

    var form = document.createElement("papDialog");
    formDiv.appendChild(form);

    form.setAttribute("id", "papDialog");
    form.setAttribute("class", "form-style-1");
    form.setAttribute("method", "post");

    if (message) {
        var messageLI = document.createElement("li");
        messageLI.setAttribute("class", "dialogMessage");
        messageLI.innerHTML = message;
        form.appendChild(messageLI);
    }

    var services = localStorage.getItem("pap-monitor-services_old");
    //url
    var input = createDialogList(form, "papDialogUrlInput","Pap rest baseURL:", "services_url_input", "http://localhost:12345", (services && services !== "null") ? JSON.parse(services).useHttps + "://" + JSON.parse(services).hostname + ":"
    + JSON.parse(services).port : "");

    //UserName
    createDialogList(form, "papDialogUsernameInput","Pap UserName:", "services_username_input", "username", (services && services !== "null") ? JSON.parse(services).username : "");

    //Password
    createDialogList(form, "papDialogPasswordInput","Pap Password:", "services_password_input", "password", (services && services !== "null") ? JSON.parse(services).password : "");

    //submit
    var inputLI = document.createElement("li");
    form.appendChild(inputLI);
    var submitInput = document.createElement("input");
    submitInput.setAttribute("id", "submit");
    submitInput.setAttribute("class", "button ebBtn");
    submitInput.setAttribute("type", "submit");
    submitInput.setAttribute("value", "Submit");
    submitInput.onclick = papDialogFormSubmitPressed;
    inputLI.appendChild(submitInput);

    // Enter key press triggers submit
    $(input).keyup(function(event) {
        if (event.keyCode == 13) {
            $(submitInput).click();
        }
    });

    input.focus();
}

function createDialogList(form, forA, reminder, id, placeholder, value_old){
    var diaLI = document.createElement("li");
    form.appendChild(diaLI);

    var diaLabel = document.createElement("label");
    diaLI.appendChild(diaLabel);

    diaLabel.setAttribute("for", forA);
    diaLabel.innerHTML = reminder;

    var diaLabelSpan = document.createElement("span");
    diaLabel.appendChild(diaLabelSpan);

    diaLabelSpan.setAttribute("class", "required");
    diaLabelSpan.innerHTML = "*";

    var input = document.createElement("input");
    input.setAttribute("id", id);
    input.setAttribute("placeholder", placeholder);
    input.value = value_old;
    diaLI.appendChild(input);
    return input;
}

/*
 * Create a dialog for displaying text
 */
function papTextDialogActivate(formParent, message, title) {
    papUtilsRemoveElement("papDialogDiv");

    var contentelement = document.createElement("div");
    contentelement.setAttribute("id", "papDialogDiv")
    var formDiv = document.createElement("div");
    var backgroundDiv = document.createElement("div");
    backgroundDiv.setAttribute("id", "papDialogDivBackground");
    backgroundDiv.setAttribute("class", "papDialogDivBackground");

    backgroundDiv.appendChild(formDiv);
    contentelement.appendChild(backgroundDiv);
    formParent.appendChild(contentelement);

    formDiv.setAttribute("id", "papErrorDialogDiv");
    formDiv.setAttribute("class", "papDialogDiv papErrorDialogDiv");

    var headingSpan = document.createElement("span");
    formDiv.appendChild(headingSpan);

    headingSpan.setAttribute("class", "headingSpan");
    headingSpan.innerHTML = title;

    var form = document.createElement("div");
    formDiv.appendChild(form);

    form.setAttribute("id", "papDialog");
    form.setAttribute("class", "form-style-1");
    form.setAttribute("method", "post");

    if (message) {
        var messageLI = document.createElement("li");
        messageLI.setAttribute("class", "dialogMessage");
        messageLI.innerHTML = message;
        form.appendChild(messageLI);
    }

    var inputLI = document.createElement("li");
    form.appendChild(inputLI);

    var cancelInput = document.createElement("input");
    cancelInput.setAttribute("class", "button ebBtn");
    cancelInput.setAttribute("type", "submit");
    cancelInput.setAttribute("value", "Close");
    cancelInput.onclick = newModelFormCancelPressed;
    form.appendChild(cancelInput);
}

/*
 * Create a Success dialog
 */
function papSuccessDialogActivate(formParent, message) {
    papTextDialogActivate(formParent, message, "Success");
}

/*
 * Create an Error dialog
 */
function papErrorDialogActivate(formParent, message) {
    papTextDialogActivate(formParent, message, "Error");
}

/*
 * Dialog cancel callback
 */
function newModelFormCancelPressed() {
    papUtilsRemoveElement("papDialogDivBackground");
}

/*
 * Dialog submit callback
 */
function papDialogFormSubmitPressed() {
    var url = $('#services_url_input').val();
    var userName = $('#services_username_input').val();
    var passWord = $('#services_password_input').val();
    if (url.length > 0 && userName.length > 0 && passWord.length > 0) {
        var engineConfig = {
            useHttps : url.split(":")[0] == "https"? "https": "http",
            hostname : url.split(":")[1].split("//")[1],
            port : url.split(":")[2],
            username : userName,
            password : passWord
        };
        localStorage.setItem("pap-monitor-services_old", JSON.stringify(engineConfig));
        localStorage.setItem("pap-monitor-services", JSON.stringify(engineConfig));
        papUtilsRemoveElement("papDialogDivBackground");
        getEngineURL();
    }
}

/*
 * Remove an element from the page
 */
function papUtilsRemoveElement(elementname) {
    var element = document.getElementById(elementname);
    if (element != null) {
        element.parentNode.removeChild(element);
    }
}

function getHomepageURL() {
    var homepageURL = location.protocol
            + "//"
            + window.location.hostname
            + (location.port ? ':' + location.port : '')
            + (location.pathname.endsWith("/monitoring/") ? location.pathname.substring(0, location.pathname
                    .indexOf("monitoring/")) : location.pathname);
    location.href = homepageURL;
}

function removeChildrenElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    elements[0].innerHTML = '';
}

/*
 * Clears and resets all content on the page
 */
function setUpPage(clearPdps) {
    // Hide all content
    $('#content').hide();

    // Clear each div
    $('#content > div').each(function () {
        $(this).empty();
    });

    // clear hashchange
    history.replaceState(null, null, ' ');

    //remove last search result of pdps.
    if (clearPdps) {
        removeChildrenElementsByClass('pdps__list');
    } else {
        localStorage.setItem("pap-monitor-services", localStorage.getItem("pap-monitor-services_old"));
    }

    // Reset trackers for tables
    window.engineStatusTables = [];

    // Set up content div's
    createEngineServiceTable();
    createEngineSummaryTable();
}

/*
 * Retrieves the engine URL from the cookie. If it has not been set yet, then a
 * dialog is shown asking for it
 */
function getEngineURL(message) {
    // The engine URL is stored in a cookie using the key
    // "pap-monitor-services"
    var services = localStorage.getItem("pap-monitor-services");

    // If an engine URL is stored in the cookie
    if (services) {
        // Parse the engine URL
        window.services = JSON.parse(services);

        // Send a request with that engine URL
        ajax_get(window.restRootURL, getPdpList,
            window.services.useHttps, window.services.hostname, window.services.port,
            window.services.username, window.services.password);
    } else {
        // Prompt for engine URL
        papDialogFormActivate(document.body, message);
    }
}

/*
 * Clears the cookie and reset the page
 */
function clearEngineURL(clearPdps) {

    if (typeof window.servicesCall !== "undefined") {
        window.servicesCall.abort();
    }

    // Remove engine URL from cookie
    localStorage.removeItem("pap-monitor-services");

    // Reset the page
    setUpPage(clearPdps);
}

function getPdpList(data) {
    const pdpArray = [];
    for (let group of data.groups) {
        var map = {};
        map.title = group.name;
        map.children = [];
        group.pdpSubgroups.forEach((pdpSubgroup, index) => {
            map.children[index] = {};
            map.children[index].title = pdpSubgroup.pdpType;
            const instanceId = [];
            pdpSubgroup.pdpInstances.forEach(pdpInstance => {
                var instanceIdMap = {};
                instanceIdMap.title = pdpInstance.instanceId;
                instanceId.push(instanceIdMap)
            });
            map.children[index].children = instanceId;
        });
        pdpArray.push(map);
    }
    RenderPdpList(pdpArray, 'pdps__list');
}

/*
 * Send a GET request
 */
function ajax_get(requestURL, callback, useHttps, hostname, port, username, password, params, errorCallback) {
    var data = {
        useHttps: useHttps,
        hostname: hostname,
        port: port,
        username: username,
        password: password
    };
    for (let p in params) {
        data[p] = params[p];
    }
    return $.ajax({
        type: 'GET',
        url: requestURL,
        dataType: "json",
        data: data,
        success: function (data2, textStatus, jqXHR) {
            if (callback) {
                callback(data2);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 500 || jqXHR.status == 404) {
                if (jqXHR.status == 404 || jqXHR.responseText.indexOf("Request failed.") !== -1) {
                    clearEngineURL(true);
                    getEngineURL("Cannot connect to PAP");
                } else {
                    papErrorDialogActivate(document.body, jqXHR.responseText);
                }
            }
            if (errorCallback) {
                errorCallback(jqXHR, textStatus, errorThrown);
            }
        }
    });
}

function ajax_get_statistics(requestURL, callback, useHttps, hostname, port, username, password, id, params, errorCallback) {
    var data = {
        useHttps: useHttps,
        hostname: hostname,
        port: port,
        username: username,
        password: password,
        id: id
    };
    for (var p in params) {
        data[p] = params[p];
    }
    return $.ajax({
        type: 'GET',
        url: requestURL,
        dataType: "json",
        data: data,
        success: function (data2, textStatus, jqXHR) {
            if (callback) {
                callback(data2);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 500 || jqXHR.status == 404) {
                clearEngineURL(false);
                papErrorDialogActivate(document.body, "Failed to get Statistics in DB.");
            }
            if (errorCallback) {
                errorCallback(jqXHR, textStatus, errorThrown);
            }
        }
    });
}

export {
    removeChildrenElementsByClass,
    papDialogFormActivate,
    papErrorDialogActivate,
    clearEngineURL,
    getEngineURL,
    setUpPage,
    ajax_get,
    ajax_get_statistics,
    papUtilsRemoveElement,
};
