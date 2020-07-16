/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2016-2018 Ericsson. All rights reserved.
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

package org.onap.policy.gui.editors.apex.rest;

/**
 * A run time exception used to report parsing and parameter input errors.
 *
 * @author Liam Fallon (liam.fallon@ericsson.com)
 */
public class ApexEditorParameterException extends IllegalArgumentException {
    private static final long serialVersionUID = 6520231162404452427L;

    /**
     * Create an ApexEditorParameterException with a message.
     *
     * @param message the message
     */
    public ApexEditorParameterException(final String message) {
        super(message);
    }

    /**
     * Create an ApexEditorParameterException with a message and an exception.
     *
     * @param message the message
     * @param th      the Throwable instance
     */
    public ApexEditorParameterException(final String message, final Throwable th) {
        super(message, th);
    }
}
