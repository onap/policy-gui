/*-
 * ============LICENSE_START=======================================================
 *  Copyright (C) 2016-2018 Ericsson. All rights reserved.
 *  Modifications Copyright (C) 2020,2023 Nordix Foundation.
 *  Modifications Copyright (C) 2021 AT&T Intellectual Property. All rights reserved.
 *  Modifications Copyright (C) 2021 Bell Canada. All rights reserved.
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

import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import jakarta.ws.rs.core.MediaType;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBElement;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Unmarshaller;
import java.io.StringReader;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;
import javax.xml.transform.stream.StreamSource;
import org.onap.policy.apex.model.basicmodel.concepts.AxConcept;
import org.onap.policy.gui.editors.apex.rest.handling.bean.BeanBase;

/**
 * Utilities for handling RESTful communication for Apex.
 *
 * @author Liam Fallon (liam.fallon@ericsson.com)
 */
public abstract class RestUtils {
    // Regular expressions for checking input types
    private static final String XML_INPUT_TYPE_REGEXP = "^\\s*<\\?xml.*>\\s*"; // starts with <?xml...>
    /**
     * starts with some kind of bracket [ or ( or {, then has something, then has
     * bracket.
     */
    private static final String JSON_INPUT_TYPE_REGEXP = "^\\s*[\\(\\{\\[][\\s\\S]*[\\)\\}\\]]";

    /**
     * Constructor, block inheritance.
     */
    private RestUtils() {
        // Private constructor to block subclassing
    }

    /**
     * HTTP POST requests can't send nulls so we interpret blanks as nulls.
     *
     * @param parameter the parameter to convert from blank to null
     * @return null if the parameter us blank, otherwise the original parameter
     */
    private static String blank2null(final String parameter) {
        return (parameter.length() == 0 ? null : parameter);
    }

    /**
     * HTTP POST requests can't send nulls so we interpret blanks as nulls.
     *
     * @param val the val
     * @return null if the parameter us blank, otherwise the original parameter
     */
    private static JsonElement blank2null(final JsonElement val) {
        if (val == null) {
            return JsonNull.INSTANCE;
        }
        if (val.isJsonPrimitive() && ((JsonPrimitive) val).isString()) {
            final var v = ((JsonPrimitive) val).getAsString();
            if (v == null || "".equals(v)) {
                return JsonNull.INSTANCE;
            }
        }
        if (val.isJsonArray()) {
            final var arr = val.getAsJsonArray();
            for (var i = 0; i < arr.size(); i++) {
                arr.set(i, blank2null(arr.get(i)));
            }
        }
        if (val.isJsonObject()) {
            final var o = val.getAsJsonObject();
            for (final Entry<String, JsonElement> e : o.entrySet()) {
                e.setValue(blank2null(e.getValue()));
            }
        }
        return val;
    }

    /**
     * Apex HTTP PUT requests send simple single level JSON strings, this method
     * reads those strings into a map.
     *
     * @param jsonString the incoming JSON string
     * @return a map of the JSON strings
     */
    public static Map<String, String> getJsonParameters(final String jsonString) {
        final var gb = new GsonBuilder();
        gb.serializeNulls().enableComplexMapKeySerialization();
        final var jsonObject = gb.create().fromJson(jsonString, JsonObject.class);

        final Map<String, String> jsonMap = new TreeMap<>();
        for (final Entry<String, JsonElement> jsonEntry : jsonObject.entrySet()) {
            jsonMap.put(jsonEntry.getKey(),
                (jsonEntry.getValue() == JsonNull.INSTANCE ? null : blank2null(jsonEntry.getValue().getAsString())));
        }
        return jsonMap;
    }

    /**
     * Apex HTTP PUT requests send simple single level JSON strings, this method
     * reads those strings into a map.
     *
     * @param <C>        the generic type
     * @param jsonString the incoming JSON string
     * @param clz        the clz
     * @return a map of the JSON strings
     */
    public static <C extends BeanBase> C getJsonParameters(final String jsonString, final Class<C> clz) {
        final var gb = new GsonBuilder();
        gb.serializeNulls().enableComplexMapKeySerialization();
        final var jsonObject = gb.create().fromJson(jsonString, JsonObject.class);

        for (final Entry<String, JsonElement> jsonEntry : jsonObject.entrySet()) {
            final JsonElement val = jsonEntry.getValue();
            jsonEntry.setValue(blank2null(val));
        }
        return gb.create().fromJson(jsonObject, clz);
    }

    /**
     * Gets the concept from JSON.
     *
     * @param <C>        the generic type
     * @param jsonString the json string
     * @param clz        the clz
     * @return the concept from JSON
     * @throws JAXBException the JAXB exception
     */
    public static <C extends AxConcept> C getConceptFromJson(final String jsonString, final Class<C> clz)
        throws JAXBException {
        Unmarshaller unmarshaller = null;
        final var jaxbContext = JAXBContext.newInstance(clz);
        unmarshaller = jaxbContext.createUnmarshaller();
        if (jsonString.matches(JSON_INPUT_TYPE_REGEXP)) {
            unmarshaller.setProperty("media-type", MediaType.APPLICATION_JSON);
        } else if (jsonString.matches(XML_INPUT_TYPE_REGEXP)) {
            unmarshaller.setProperty("media-type", MediaType.APPLICATION_XML);
        } else {
            return null;
        }
        final var source = new StreamSource(new StringReader(jsonString));
        final JAXBElement<C> rootElement = unmarshaller.unmarshal(source, clz);
        return rootElement.getValue();
    }

    /**
     * Gets the JSON from concept.
     *
     * @param object the object
     * @return the JSON from concept
     */
    public static String getJsonFromConcept(final Object object) {
        final var gb = new GsonBuilder();
        gb.serializeNulls().enableComplexMapKeySerialization();
        return gb.create().toJson(object);
    }
}
