/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2022 Nordix Foundation.
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

package org.onap.policy.gui.server.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(
    properties = {
        "runtime-ui.policy-api.disable-ssl-validation=true",
        "runtime-ui.policy-api.mapping-path=policy-api",
        "runtime-ui.policy-api.url=http://policyapi:9876/",
        "runtime-ui.policy-pap.disable-ssl-validation=true",
        "runtime-ui.policy-pap.mapping-path=policy-pap",
        "runtime-ui.policy-pap.url=http://policypap:9876/",
        "runtime-ui.acm.disable-ssl-validation=true",
        "runtime-ui.acm.mapping-path=acm-runtime",
        "runtime-ui.acm.url=http://acmruntime:9876/"
    })
@AutoConfigureMockMvc
class DesigntimeRestControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void testStaticContentUrls() throws Exception {
        mvc.perform(get("/designtime-ui/"))
            .andExpect(status().isOk())
            .andExpect(forwardedUrl("/designtime-ui/index.html"));

        mvc.perform(get("/designtime-ui"))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl("/designtime-ui/"));
    }
}
