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
 */

import { mount, shallow } from "enzyme";
import React from "react";
import toJson from "enzyme-to-json";
import { createMemoryHistory } from "history";
import { act } from "react-dom/test-utils";
import InstantiationManagementModal from "./ControlLoop/InstantiationManagementModal";

describe('Verify InstantiationManagementModal', () => {

  it("renders without crashing", () => {
    shallow(<InstantiationManagementModal />);
  });

  it("renders correctly", () => {
    const tree = shallow(<InstantiationManagementModal />);
    expect(toJson(tree)).toMatchSnapshot();
  });

  it('should have save button element', () => {
    const container = shallow(<InstantiationManagementModal/>)
    expect(container.find('[variant="primary"]').length).toEqual(1);
  });

  it('handleSave called when save button clicked', () => {
    const history = createMemoryHistory();
    const component = mount(<InstantiationManagementModal history={ history }/>)
    const logSpy = jest.spyOn(console, 'log');

    act(() => {
      component.find('[variant="primary"]').simulate('click');
      expect(logSpy).toHaveBeenCalledWith('handleSave called');
    });
  });

  it('should have close button element', () => {
    const container = shallow(<InstantiationManagementModal/>)
    expect(container.find('[variant="secondary"]').length).toEqual(1);
  });

  it('handleClose called when close button clicked', () => {
    const history = createMemoryHistory();
    const component = mount(<InstantiationManagementModal history={ history }/>)
    const logSpy = jest.spyOn(console, 'log');

    act(() => {
      component.find('[variant="secondary"]').simulate('click');
      expect(logSpy).toHaveBeenCalledWith('handleClose called');
    });
  });
});
