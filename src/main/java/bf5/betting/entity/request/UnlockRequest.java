package bf5.betting.entity.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author duynguyen
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnlockRequest {

  private String key;
}
