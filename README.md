# Summary

Copyright 2017-2018 AT&T Intellectual Property. All rights reserved.
Copyright (C) 2021 Nordix Foundation.
This file is licensed under the CREATIVE COMMONS ATTRIBUTION 4.0 INTERNATIONAL LICENSE
Full license text at https://creativecommons.org/licenses/by/4.0/legalcode

This source repository contains the ONAP Policy GUI code.

To build it using Maven 3, run: mvn clean install -P docker


# Docker image

Maven produces a single docker image containing the policy GUIs. These are exposed on
the same port (2443) using different URLs:
- Apex Policy Editor: http://localhost:2443/apex-editor
- PDP Monitoring UI: http://localhost:2443/pdp-monitoring
- CLAMP Designer UI: http://localhost:2443/clamp

## Building
You can use the following command to build the policy-gui docker image:
```
mvn clean install -P docker
```

## Deployment
Currently, the policy-gui docker image can be deployed with minimal configuration. As
the clamp backend is required to use the clamp GUI, you can use the CLAMP_REST_URL
environment variable to set its location.

By default, CLAMP_REST_URL is set to an invalid address (0.0.0.0), meaning the CLAMP GUI
will not work without specifying CLAMP_REST_URL.

If running clamp as part of a docker network, where `policy-clamp-backend` is the CLAMP
backend, then CLAMP_REST_URL should be set to `https://policy-clamp-backend:8443`.

If running clamp backend on localhost port 8443, the policy-gui docker image would be
started like this:
```
docker run -p 2443:2443 \
    --add-host host.docker.internal:host-gateway \
    --env CLAMP_REST_URL=https://host.docker.internal:8443 \
    onap/policy-gui
```

## Client Credentials
A certificate must be added in the browser and is required to log in properly:

[org.onap.clamp.p12 (from clamp master)](URL "https://gerrit.onap.org/r/gitweb?p=clamp.git;a=blob_plain;f=src/main/resources/clds/aaf/org.onap.clamp.p12;hb=refs/heads/master")
(Password: "China in the Spring")

See onap/clamp repo README for details.
