package bf5.betting.entity.request;

import bf5.betting.constant.BetResult;
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
    private String score;
    private BetResult result;
    private Long actualProfit;
}
