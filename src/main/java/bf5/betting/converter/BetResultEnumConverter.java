package bf5.betting.converter;

import bf5.betting.constant.BetResult;
import bf5.betting.exception.EntityNotFoundException;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * @author duynguyen
 */
@Converter(autoApply = true)
public class BetResultEnumConverter implements AttributeConverter<BetResult, String> {

  @Override
  public String convertToDatabaseColumn(BetResult result) {
    return Optional.ofNullable(result)
        .map(e -> e.name().toUpperCase())
        .orElse(null);
  }

  @Override
  public BetResult convertToEntityAttribute(String result) {
    return Stream.of(BetResult.values())
        .filter(c -> c.name().equalsIgnoreCase(result))
        .findFirst()
        .orElseThrow(() -> EntityNotFoundException.builder()
            .clazz(BetResult.class)
            .id(result)
            .build());
  }
}
