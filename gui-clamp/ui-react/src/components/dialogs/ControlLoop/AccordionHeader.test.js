/*
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2021 Nordix Foundation.
 *  ================================================================================
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  SPDX-License-Identifier: Apache-2.0
 *  ============LICENSE_END=========================================================
 *
 *
 */

import { shallow } from "enzyme";
import React from "react";
import AccordionHeader from "./AccordionHeader";
import toJson from "enzyme-to-json";

describe('Verify AccordionHeader', () => {

  const index = 0;

  it("renders correctly", () => {
    const container = shallow(<AccordionHeader index={ index }/>);
    expect(toJson(container)).toMatchSnapshot();
  });

  it("renders correctly when orderState is uninitialized", () => {
    const container = shallow(<AccordionHeader title={ "UNINITIALISED_TEST" } orderState={ "UNINITIALISED" } index={ index } key={ index }/>);
    expect(toJson(container)).toMatchSnapshot();
  });

  it("renders correctly when orderState is passive", () => {
    const container = shallow(<AccordionHeader title={ "PASSIVE_TEST" } orderState={ "PASSIVE" } index={ index } key={ index }/>);
    expect(toJson(container)).toMatchSnapshot();
  });

  it("renders correctly when orderState is running", () => {
    const container = shallow(<AccordionHeader title={ "RUNNING_TEST" } orderState={ "RUNNING" } index={ index } key={ index }/>);
    expect(toJson(container)).toMatchSnapshot();
  });
});