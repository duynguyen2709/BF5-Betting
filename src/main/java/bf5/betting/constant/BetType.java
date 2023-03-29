package bf5.betting.constant;

import bf5.betting.exception.EntityNotFoundException;

import java.util.stream.Stream;

/**
 * @author duynguyen
 **/
public enum BetType {
    ACCUMULATOR,
    SINGLE
    ;

    public static BetType fromValue(String type) {
        return Stream.of(BetType.values())
                .filter(c -> c.name().equalsIgnoreCase(type))
                .findFirst()
                .orElseThrow(() -> EntityNotFoundException.builder()
                        .clazz(BetType.class)
                        .id(type)
                        .build());
    }
}
