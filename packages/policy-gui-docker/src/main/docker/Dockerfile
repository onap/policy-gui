#-------------------------------------------------------------------------------
# ============LICENSE_START=======================================================
#  Copyright (C) 2021-2023 Nordix Foundation.
# ================================================================================
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
# ============LICENSE_END=========================================================
#-------------------------------------------------------------------------------

FROM onap/policy-jre-alpine:4.0.1-SNAPSHOT

LABEL maintainer="Policy Team"
LABEL org.opencontainers.image.title="Policy GUI"
LABEL org.opencontainers.image.description="Policy GUI image based on Alpine"
LABEL org.opencontainers.image.url="https://github.com/onap/policy-gui"
LABEL org.opencontainers.image.vendor="ONAP Policy Team"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.created="${git.build.time}"
LABEL org.opencontainers.image.version="${git.build.version}"
LABEL org.opencontainers.image.revision="${git.commit.id.abbrev}"

ARG POLICY_LOGS=/var/log/onap/policy/gui

ENV POLICY_LOGS=$POLICY_LOGS
ENV POLICY_HOME=$POLICY_HOME/gui

USER root
RUN mkdir -p $POLICY_HOME $POLICY_LOGS $POLICY_HOME/bin $POLICY_HOME/etc/ssl && \
    chown -R policy:policy $POLICY_HOME $POLICY_LOGS

COPY --chown=policy:policy /maven/app.jar /app/
COPY --chown=policy:policy policy-gui.sh $POLICY_HOME/bin/
COPY --chown=policy:policy config/application.yml $POLICY_HOME/etc/
COPY --chown=policy:policy config/logback.xml $POLICY_HOME/etc/
RUN chmod 755 $POLICY_HOME/bin/*.sh

USER policy
WORKDIR $POLICY_HOME/bin
ENTRYPOINT [ "./policy-gui.sh" ]
EXPOSE 2443
