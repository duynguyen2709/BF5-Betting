package bf5.betting.constant;

import bf5.betting.exception.EntityNotFoundException;

import java.util.Objects;
import java.util.stream.Stream;

/**
 * @author duynguyen
 **/
public enum BetResult {
  NOT_FINISHED,
  WIN,
  HALF_WIN,
  DRAW,
  LOST,
  HALF_LOST;

  public String getVnDescriptionText() {
    switch (this) {
      case NOT_FINISHED:
        return "Chưa Hoàn Tất";
      case WIN:
        return "Thắng";
      case HALF_WIN:
        return "Thắng Nửa Tiền";
      case DRAW:
        return "Hoà";
      case LOST:
        return "Thua";
      case HALF_LOST:
        return "Thua Nửa Tiền";
    }
    return null;
  }


  public static BetResult fromValue(String value) {
    return Stream.of(BetResult.values())
        .filter(c -> c.name().equalsIgnoreCase(value))
        .findFirst()
        .orElseThrow(() -> EntityNotFoundException.builder()
            .clazz(BetResult.class)
            .id(value)
            .build());
  }

  public static BetResult fromRawBetResult(Integer result) {
    if (Objects.isNull(result)) {
      return NOT_FINISHED;
    }
    switch (result) {
      case 0:
        return LOST;
      case 1:
        return WIN;
      case 2:
        return DRAW;
      case 4:
        return HALF_WIN;
      case 5:
        return HALF_LOST;
      default:
        return NOT_FINISHED;
    }
  }
}
