package com.example.javaproject.validator;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class ValidatorUtils {
    public static void assertNoNull(Object object, String objectName) {
        List<String> missingFields = collectNullFields(object);
        if (!missingFields.isEmpty()) {
            fail(HttpStatus.BAD_REQUEST, "missing " + missingFields + " in " + objectName);
        }
    }

    public static void assertNoNull(String objectName, Object object) {
        assertNoNull(object, objectName);
    }

    public static List<String> collectNullFields(Object object) {
        List<String> missingFields = new ArrayList<>();
        for (Field field : object.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            Object value = null;
            try {
                value = field.get(object);
            } catch (IllegalAccessException e) {
                // this should not happen
                throw new RuntimeException(e);
            }
            if (value == null) {
                missingFields.add(field.getName());
                continue;
            }
            if (value.getClass().isEnum() ) {
                continue;
            }
            if (!value.getClass().getName().startsWith("java.")) {
                for (String subFieldName : collectNullFields(value)) {
                    missingFields.add(field.getName() + "." + subFieldName);
                }
            }
        }
        return missingFields;
    }

    public static void fail(HttpStatus httpStatus, String message) {
        throw new ResponseStatusException(httpStatus, message);
    }
}
