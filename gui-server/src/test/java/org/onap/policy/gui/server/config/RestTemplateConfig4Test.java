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

package org.onap.policy.gui.server.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.onap.policy.gui.server.test.util.hello.HelloWorldRestController.HELLO_WORLD_STRING;

import org.junit.jupiter.api.Test;
import org.onap.policy.gui.server.test.util.hello.HelloWorldApplication;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * In this test, SSL validation is disabled but hostname check is explicitly
 * enabled. The expected behaviour is to disable the hostname check if SSL
 * validation is disabled. We expect the request to succeed even though the
 * SSL cert name does not match 'localhost', as SSL hostname verification is
 * implicitly disabled.
 */
@SpringBootTest(
    classes = {
        HelloWorldApplication.class,
        AcmRuntimeRestTemplateConfig.class,
        PolicyApiRestTemplateConfig.class,
        PolicyPapRestTemplateConfig.class
    },
    properties = {
        "server.ssl.enabled=true",
        "server.ssl.key-store=file:src/test/resources/helloworld-keystore.jks",
        "server.ssl.key-store-password=changeit",
        "server.ssl.trust-store=file:src/test/resources/helloworld-truststore.jks",
        "server.ssl.trust-store-password=changeit",
        "runtime-ui.acm.disable-ssl-validation=true",
        "runtime-ui.acm.disable-ssl-hostname-check=false",
        "runtime-ui.policy-api.disable-ssl-validation=true",
        "runtime-ui.policy-api.disable-ssl-hostname-check=false",
        "runtime-ui.policy-pap.disable-ssl-validation=true",
        "runtime-ui.policy-pap.disable-ssl-hostname-check=false"
    },
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RestTemplateConfig4Test {
    @Test
    void testHostnameCheckIsDisabledWhenSslValidationIsDisabled() {
        RestTemplateConfig rtConfig = new RestTemplateConfig();

        rtConfig.getRestTemplateList().forEach(restTemplate -> {
            var helloUrl = "https://localhost:" + rtConfig.getPort() + "/";
            String response = restTemplate.getForObject(helloUrl, String.class);
            assertEquals(HELLO_WORLD_STRING, response);
        });
    }
}
