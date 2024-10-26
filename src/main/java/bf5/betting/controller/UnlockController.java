package bf5.betting.controller;

import bf5.betting.entity.request.UnlockRequest;
import bf5.betting.entity.response.BaseResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/unlock")
@AllArgsConstructor
public class UnlockController {

  private static final Map<String, String> allowedKeys = new HashMap<>();

  static {
    allowedKeys.put("27091998", "100002362515754");
    allowedKeys.put("12011998", "100004056801368");
    allowedKeys.put("30081998", "100004533095969");
    allowedKeys.put("13121998", "100004614064009");
    allowedKeys.put("08101998", "100010972726703");
  }

  @PostMapping("")
  public BaseResponse unlock(@RequestBody UnlockRequest request) {
    if (!allowedKeys.containsKey(request.getKey())) {
      return BaseResponse.failed(401, "Mật khẩu không hợp lệ. Vui lòng thử lại");
    }
    return BaseResponse.success(allowedKeys.get(request.getKey()));
  }
}
