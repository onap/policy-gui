/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2016-2018 Ericsson. All rights reserved.
 *  Modifications Copyright (C) 2019-2021 Nordix Foundation.
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

package org.onap.policy.gui.editors.apex.rest;

import java.io.PrintStream;
import java.util.concurrent.atomic.AtomicReference;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

/**
 * This class is the main class that is used to launch the Apex editor from the command line.
 */
public class ApexEditorMain {
    // Logger for this class
    private static final XLogger LOGGER = XLoggerFactory.getXLogger(ApexEditorMain.class);

    // Recurring string constants
    private static final String REST_ENDPOINT_PREFIX = "Apex Editor REST endpoint (";

    /**
     * The Enum EditorState holds the current state of the editor.
     */
    // Editor state
    public enum EditorState {
        /**
         * The editor is stopped.
         */
        STOPPED,
        /**
         * The editor is ready to run.
         */
        READY,
        /**
         * The editor is getting ready to run.
         */
        INITIALIZING,
        /**
         * The editor is running.
         */
        RUNNING
    }

    private static final int EDITOR_RNNING_CHECK_TIMEOUT = 1000;

    private EditorState state;

    // The Apex editor this class is running
    private ApexEditor apexEditor = null;

    // The parameters for the editor
    private static final AtomicReference<ApexEditorParameters> parameters = new AtomicReference<>();

    // Output and error streams for messages
    private final PrintStream outStream;

    /**
     * Constructor, kicks off the editor.
     *
     * @param args      The command line arguments for the editor
     * @param outStream The stream for output messages
     */
    public ApexEditorMain(final String[] args, final PrintStream outStream) {
        // Save the streams for output and error
        this.outStream = outStream;

        // Editor parameter parsing
        final ApexEditorParameterParser parser = new ApexEditorParameterParser();

        try {
            // Get and check the parameters
            parameters.set(parser.parse(args));
        } catch (final ApexEditorParameterException e) {
            throw new ApexEditorParameterException(REST_ENDPOINT_PREFIX + this + ") parameter error, "
                + e.getMessage() + '\n' + parser.getHelp(ApexEditorMain.class.getName()), e);
        }
        if (parameters.get().isHelp()) {
            throw new ApexEditorParameterException(parser.getHelp(ApexEditorMain.class.getName()));
        }

        // Validate the parameters
        final String validationMessage = parameters.get().validate();
        if (validationMessage.length() > 0) {
            throw new ApexEditorParameterException(REST_ENDPOINT_PREFIX + this + ") parameters invalid, "
                + validationMessage + '\n' + parser.getHelp(ApexEditorMain.class.getName()));
        }

        state = EditorState.READY;
    }

    /**
     * Initialize the Apex editor.
     */
    public void init() {
        outStream.println(REST_ENDPOINT_PREFIX + this + ") starting at "
            + parameters.get().getBaseUri().toString() + " . . .");

        try {
            state = EditorState.INITIALIZING;

            // Start the editor
            apexEditor = new ApexEditor(parameters.get());

            // Add a shutdown hook to shut down the editor when the process is exiting
            Runtime.getRuntime().addShutdownHook(new Thread(new ApexEditorShutdownHook()));

            state = EditorState.RUNNING;

            if (parameters.get().getTimeToLive() == ApexEditorParameters.INFINITY_TIME_TO_LIVE) {
                outStream.println(REST_ENDPOINT_PREFIX + this + ") started at "
                    + parameters.get().getBaseUri().toString());
            } else {
                outStream.println(REST_ENDPOINT_PREFIX + this + ") started");
            }

            // Find out how long is left to wait
            long timeRemaining = parameters.get().getTimeToLive();
            while (timeRemaining == ApexEditorParameters.INFINITY_TIME_TO_LIVE || timeRemaining > 0) {
                // decrement the time to live in the non-infinity case
                if (timeRemaining > 0) {
                    timeRemaining--;
                }

                // Wait for a second
                Thread.sleep(EDITOR_RNNING_CHECK_TIMEOUT);
            }
        } catch (final Exception e) {
            String message = REST_ENDPOINT_PREFIX + this + ") failed at with error: " + e.getMessage();
            outStream.println(message);
            LOGGER.warn(message, e);
        } finally {
            if (apexEditor != null) {
                apexEditor.shutdown();
                apexEditor = null;
            }
            state = EditorState.STOPPED;
        }
    }

    /**
     * Get the editor state.
     *
     * @return the state
     */
    public EditorState getState() {
        return state;
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    public String toString() {
        return this.getClass().getSimpleName() + ": Config=[" + parameters + "], State=" + this.getState();
    }

    /**
     * Explicitly shut down the editor.
     */
    public void shutdown() {
        if (apexEditor != null) {
            outStream.println(REST_ENDPOINT_PREFIX + this + ") shutting down");
            apexEditor.shutdown();
        }
        state = EditorState.STOPPED;
        outStream.println(REST_ENDPOINT_PREFIX + this + ") shut down");
    }

    /**
     * Get the editor parameters.
     *
     * @return the parameters
     */
    public static ApexEditorParameters getParameters() {
        return parameters.get();
    }

    /**
     * This class is a shutdown hook for the Apex editor command.
     */
    private class ApexEditorShutdownHook implements Runnable {
        /**
         * {@inheritDoc}.
         */
        @Override
        public void run() {
            if (apexEditor != null) {
                apexEditor.shutdown();
            }
        }
    }

    /**
     * Main method, main entry point for command.
     *
     * @param args The command line arguments for the editor
     */
    public static void main(final String[] args) {
        try {
            final ApexEditorMain editorMain = new ApexEditorMain(args, System.out);
            editorMain.init();
        } catch (final Exception e) {
            LOGGER.error("start failed", e);
        }
    }
}
