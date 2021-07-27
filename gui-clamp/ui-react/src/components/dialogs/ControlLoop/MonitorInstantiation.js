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

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InstantiationItem from "./InstantiationItem";
import ControlLoopService from "../../../api/ControlLoopService";
import InstantiationElements from "./InstantiationElements";

const ModalStyled = styled(Modal)`
  background-color: transparent;
`

const MonitorInstantiation = (props) => {
  const [show, setShow] = useState(true);
  const [controlLoopList, setControlLoopList] = useState([]);
  const [windowLocationPathname, setWindowLocationPathname] = useState('');

  useEffect(() => {
    setWindowLocationPathname(window.location.pathname);

    ControlLoopService.getControlLoopInstantiation(windowLocationPathname).then(controlLoopList => {
      setControlLoopList(controlLoopList['controlLoopList']);
    });
  }, [])

  const handleClose = () => {
    console.log('handleClose called');
    setShow(false);
    props.history.push('/');
  }

  return (
    <ModalStyled size="xl" show={ show } onHide={ handleClose } backdrop="static" keyboard={ false }>
      <Modal.Header closeButton>
        <Modal.Title>Tosca Instantiation - Monitoring</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          controlLoopList.map((clList, index) => (
            <InstantiationItem title={ clList["name"] } orderedState={ clList["orderedState"] } index={ index } key={ index }>
              <InstantiationElements elements={ clList["elements"] } />
            </InstantiationItem>
          ))
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="null" onClick={ handleClose }>Close</Button>
      </Modal.Footer>
    </ModalStyled>
  )
}

export default MonitorInstantiation;
