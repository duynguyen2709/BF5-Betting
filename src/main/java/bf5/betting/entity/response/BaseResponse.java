package bf5.betting.entity.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author duynguyen
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse<T> implements Serializable {
    public static final BaseResponse SUCCESS;

    static {
        SUCCESS = BaseResponse.builder().status("success").build();
    }

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

    public static BaseResponse failed(int statusCode, String message) {
        return BaseResponse.builder()
                .status("failed")
                .code(statusCode)
                .message(message)
                .build();
    }
}
