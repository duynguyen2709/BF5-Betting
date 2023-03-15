package bf5.betting.entity.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author duyna5
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse implements Serializable {
    public static final BaseResponse SUCCESS;

    static {
        SUCCESS = BaseResponse.builder().status("success").build();
    }

    private String status;
    private Integer code;
    private String message;

    public static BaseResponse failed(int statusCode, String message) {
        return BaseResponse.builder().status("failed")
                .code(statusCode)
                .message(message)
                .build();
    }
}
