/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2016-2018 Ericsson. All rights reserved.
 *  Modifications Copyright (C) 2020-2021 Nordix Foundation.
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

package org.onap.policy.gui.editors.apex.rest.handling.bean;

import java.lang.reflect.Method;

/**
 * The base class for Beans.
 */
public abstract class BeanBase {
    // Recurring string constants
    private static final String PROBLEM_RETRIEVING_FIELD_PREFIX = "Problem retrieving field called ('";
    private static final String JSON_BEAN_SUFFIX = "') from JSON bean ";

    // Magic numbers
    private static final int GET_LENGTH = 3;

    /**
     * Gets a named field from the bean.
     *
     * @param field the field name
     * @return the value for the field
     */
    public String get(final String field) {
        // use getter preferably
        for (final Method method : this.getClass().getMethods()) {
            if (method.getName().startsWith("get") && method.getName().length() == (field.length() + GET_LENGTH)
                && method.getName().toLowerCase().endsWith(field.toLowerCase())) {
                return invokeGetterMethod(field, method);
            }
        }

        // Use field approach
        if (field != null) {
            try {
                final var f = this.getClass().getDeclaredField(field);
                f.trySetAccessible();
                return (String) (f.get(this));
            } catch (final Exception e) {
                throw new IllegalArgumentException(PROBLEM_RETRIEVING_FIELD_PREFIX + field + JSON_BEAN_SUFFIX + this,
                    e);
            }
        }
        throw new IllegalArgumentException(PROBLEM_RETRIEVING_FIELD_PREFIX + field + JSON_BEAN_SUFFIX + this);
    }

    /**
     * Invoke a getter method on a bean.
     *
     * @param field  the field that the getter gets a value for
     * @param method the method to invoke
     */
    private String invokeGetterMethod(final String field, final Method method) {
        try {
            return (String) method.invoke(this);
        } catch (final Exception e) {
            throw new IllegalArgumentException(PROBLEM_RETRIEVING_FIELD_PREFIX + field + JSON_BEAN_SUFFIX + this, e);
        }
    }
}
