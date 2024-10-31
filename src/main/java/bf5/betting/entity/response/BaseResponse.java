package bf5.betting.entity.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author duynguyen
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse<T> implements Serializable {

  public static BaseResponse SUCCESS = BaseResponse.builder()
                                                   .status("success")
                                                   .code(200)
                                                   .build();
  private String status;
  private Integer code;
  private T data;
  private String message;

  public static <T> BaseResponse<T> success(T data) {
    return (BaseResponse<T>) BaseResponse.builder()
                                         .status("success")
                                         .code(200)
                                         .data(data)
                                         .build();
  }

  public static BaseResponse<Object> failed(int statusCode, String message) {
    return BaseResponse.builder()
                       .status("failed")
                       .code(statusCode)
                       .message(message)
                       .build();
  }
}
