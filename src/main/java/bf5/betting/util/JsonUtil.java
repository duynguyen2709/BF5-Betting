package bf5.betting.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.log4j.Log4j2;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author duynguyen
 */
@Log4j2
public class JsonUtil {

  private static final ObjectMapper mapper = new ObjectMapper();

  static {
    mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    mapper.registerModule(new JavaTimeModule());
  }

  public static String toJsonString(Object obj) {
    try {
      if (obj == null) {
        return null;
      }
      if (obj instanceof String) {
        return String.valueOf(obj);
      }
      return mapper.writeValueAsString(obj);
    } catch (Exception e) {
      log.error(String.format("[toJsonString] obj=%s ex", obj), e);
      return null;
    }
  }

  public static <T> T fromJsonString(String raw, Class<T> clazz) {
    try {
      return mapper.readValue(raw, clazz);
    } catch (Exception e) {
      log.error(String.format("[fromJsonString] raw=%s, class=%s ex", raw, clazz.getSimpleName()),
          e);
      return null;
    }
  }

  public static <T> List<T> fromJsonStringToList(String raw, Class<T> clazz) {
    try {
      CollectionType listType = mapper.getTypeFactory()
          .constructCollectionType(ArrayList.class, clazz);

      return mapper.readValue(raw, listType);
    } catch (Exception e) {
      log.error(
          String.format("[fromJsonStringToList] raw=%s, class=%s ex", raw, clazz.getSimpleName()),
          e);
      return null;
    }
  }

  public static <K, V> Map<K, V> fromJsonStringToMap(String raw, Class<K> key, Class<V> value) {
    try {
      return mapper.readValue(raw, new TypeReference<>() {
        @Override
        public Type getType() {
          return super.getType();
        }
      });
    } catch (JsonProcessingException e) {
      log.error(String.format("[fromJsonStringToMap] raw=%s, class=(%s;%s) ex",
          raw, key.getSimpleName(), value.getSimpleName()), e);
      return null;
    }
  }
}
