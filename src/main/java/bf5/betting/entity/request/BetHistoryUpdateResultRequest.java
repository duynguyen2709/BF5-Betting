package bf5.betting.entity.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author duynguyen
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BetHistoryUpdateResultRequest implements Serializable {
    private long betId;
    private String result;
}
