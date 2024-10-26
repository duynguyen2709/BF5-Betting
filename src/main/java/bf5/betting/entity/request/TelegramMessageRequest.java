package bf5.betting.entity.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

/**
 * @author duynguyen
 **/
@Data
public class TelegramMessageRequest implements Serializable {

  @JsonProperty("chat_id")
  private String chatId;
  @JsonProperty("text")
  private String text;
  @JsonProperty("parse_mode")
  private String parseMode;

  public static TelegramMessageRequest build(String chatId, String text) {
    TelegramMessageRequest request = new TelegramMessageRequest();
    request.setChatId(chatId);
    request.setText(text);
    request.setParseMode("Markdown");
    return request;
  }
}
