/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2018 Ericsson. All rights reserved.
 *  Modifications Copyright (C) 2020 Nordix Foundation.
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

package org.onap.policy.gui.editors.apex.rest.handling;

/**
 * This enum maps REST calls to the handlers that process them.
 *
 */
public enum RestCommand {
    /**
     * Create the target.
     */
    CREATE,
    /**
     * Update the target.
     */
    UPDATE,
    /**
     * List the target.
     */
    LIST,
    /**
     * Delete the target.
     */
    DELETE,
    /**
     * Validate the target.
     */
    VALIDATE,
    /**
     * Load the target.
     */
    LOAD,
    /**
     * Analyse the target.
     */
    ANALYSE,
    /**
     * Get the key of the currently loaded apex model.
     */
    GET_KEY,
    /**
     * Download the currently loaded apex model.
     */
    DOWNLOAD,
    /**
     * Upload the currently loaded apex model.
     */
    UPLOAD
}
