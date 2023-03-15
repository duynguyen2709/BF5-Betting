package bf5.betting.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import lombok.extern.log4j.Log4j2;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * @author duynguyen
 */
@Log4j2
public class JsonUtil {
    private static final Gson mapper;

    static {
        mapper = new GsonBuilder().disableHtmlEscaping().setLenient().create();
    }

    public static String toJsonString(Object obj) {
        try {
            if (obj == null) return null;
            if (obj instanceof String) return String.valueOf(obj);
            return mapper.toJson(obj);
        } catch (Exception e) {
            log.error(String.format("[toJsonString] obj=%s ex", obj), e);
            return null;
        }
    }

    public static <T> T fromJsonString(String raw, Class<T> clazz) {
        try {
            return mapper.fromJson(raw, clazz);
        } catch (Exception e) {
            log.error(String.format("[fromJsonString] raw=%s, class=%s ex", raw, clazz.getSimpleName()), e);
            return null;
        }
    }

    public static <T> List<T> fromJsonStringToList(String raw, Class<T> clazz) {
        try {
            Type listType = new TypeToken<ArrayList<T>>() {
            }.getType();
            return mapper.fromJson(raw, listType);
        } catch (Exception e) {
            log.error(String.format("[fromJsonStringToList] raw=%s, class=%s ex", raw, clazz.getSimpleName()), e);
            return null;
        }
    }
}
