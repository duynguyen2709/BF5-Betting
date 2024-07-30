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
public class AddPlayerAssetHistoryRequest implements Serializable {
    private String playerId;
    private String action;
    private String paymentMethod;
    private long amount;
}
