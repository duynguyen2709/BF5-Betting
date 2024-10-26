package bf5.betting.constant;

import bf5.betting.exception.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.stream.Stream;

/**
 * @author duynguyen
 **/
@Getter
@AllArgsConstructor
public enum BetType {
  LUCKY("Lucky Bet"),
  SYSTEM("System"),
  ACCUMULATOR("Accumulator"),
  SINGLE("Single");

  private final String typeTitle;

  public static BetType fromRawValue(String type) {
    return Stream.of(BetType.values())
        .filter(c -> c.typeTitle.equals(type))
        .findFirst()
        .orElseThrow(() -> EntityNotFoundException.builder()
            .clazz(BetType.class)
            .id(type)
            .build());
  }
}
