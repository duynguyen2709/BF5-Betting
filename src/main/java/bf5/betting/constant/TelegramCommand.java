package bf5.betting.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author duynguyen
 **/
@Getter
@AllArgsConstructor
public enum TelegramCommand {
    QUICK_ADD("/qadd");

    private final String command;
}
