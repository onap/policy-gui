/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2020 Nordix Foundation.
 *  Modifications Copyright (C) 2020 AT&T Inc.
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

package org.onap.policy.gui.pdp.monitoring;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.onap.policy.common.utils.test.ExceptionsTester;

/**
 * Test the Pdp monitoring exception.
 *
 */
public class MonitoringExceptionTest {

    @Test
    public void test() {
        assertEquals(2, new ExceptionsTester().test(PdpMonitoringServerParameterException.class));
    }
}
