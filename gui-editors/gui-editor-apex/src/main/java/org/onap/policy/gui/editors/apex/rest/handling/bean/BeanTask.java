/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2016-2018 Ericsson. All rights reserved.
 *  Modifications Copyright (C) 2020-2023 Nordix Foundation.
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

import jakarta.xml.bind.annotation.XmlType;
import java.util.Arrays;
import java.util.Map;
import lombok.Getter;

/**
 * The Task Bean.
 */
@XmlType
@Getter
public class BeanTask extends BeanBase {
    private String name = null;
    private String version = null;
    private String uuid = null;
    private String description = null;
    private BeanLogic taskLogic = null;
    private Map<String, BeanTaskParameter> parameters = null;
    private BeanKeyRef[] contexts = null;

    /**
     * {@inheritDoc}.
     */
    @Override
    public String toString() {
        return "BeanTask [name=" + name + ", version=" + version + ", uuid=" + uuid + ", description=" + description
            + ", taskLogic=" + taskLogic + ", parameters=" + parameters + ", contexts=" + Arrays.toString(contexts)
            + "]";
    }
}
