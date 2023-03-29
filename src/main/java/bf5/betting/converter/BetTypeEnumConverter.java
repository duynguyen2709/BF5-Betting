package bf5.betting.converter;

import bf5.betting.constant.BetType;
import bf5.betting.exception.EntityNotFoundException;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * @author duynguyen
 */
@Converter(autoApply = true)
public class BetTypeEnumConverter implements AttributeConverter<BetType, String> {

    @Override
    public String convertToDatabaseColumn(BetType type) {
        return Optional.ofNullable(type)
                .map(e -> e.name().toUpperCase())
                .orElse(null);
    }

    @Override
    public BetType convertToEntityAttribute(String type) {
        return Stream.of(BetType.values())
                .filter(c -> c.name().equalsIgnoreCase(type))
                .findFirst()
                .orElseThrow(() -> EntityNotFoundException.builder()
                        .clazz(BetType.class)
                        .id(type)
                        .build());
    }
}
