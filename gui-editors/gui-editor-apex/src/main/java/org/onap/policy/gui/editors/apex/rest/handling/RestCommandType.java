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
public enum RestCommandType {
    /**
     * Model commands.
     */
    MODEL,
    /**
     * Key Information commands.
     */
    KEY_INFO,
    /**
     * Context schema commands.
     */
    CONTEXT_SCHEMA,
    /**
     * Context album commands.
     */
    CONTEXT_ALBUM,
    /**
     * Event Commands.
     */
    EVENT,
    /**
     * Task commands.
     */
    TASK,
    /**
     * Policy commands.
     */
    POLICY
}
