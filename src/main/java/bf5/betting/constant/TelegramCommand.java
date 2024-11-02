package bf5.betting.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author duynguyen
 **/
@Getter
@AllArgsConstructor
public enum TelegramCommand {
  QUICK_ADD("/qadd"),
  QUICK_UPDATE("/qupd"),
  TOKEN("/token"),
  SET_TOKEN("/setup");

  private final String command;
}
