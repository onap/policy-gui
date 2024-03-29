/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2021-2022 Nordix Foundation.
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

import static org.assertj.core.api.Assertions.assertThat;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.Test;
import org.onap.policy.gui.editors.apex.rest.handling.bean.BeanModel;

class RestUtilsTest {

    @Test
    void getJsonParameters() {
        final var name = RandomStringUtils.randomAlphabetic(3);
        final var uuid = RandomStringUtils.randomAlphabetic(4);
        final var desc = RandomStringUtils.randomAlphabetic(5);
        final var jsonString =
            "{name: \"" + name + "\", version: \"\", uuid: \"" + uuid + "\", description: \"" + desc
                + "\"}";
        final var actual = RestUtils.getJsonParameters(jsonString, BeanModel.class);

        assertThat(actual.getName()).isEqualTo(name);
        assertThat(actual.getVersion()).isNull();
        assertThat(actual.getUuid()).isEqualTo(uuid);
        assertThat(actual.getDescription()).isEqualTo(desc);
    }
}
