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
public class StatisticByDateRangeRequest {

  private String startDate;
  private String endDate;
  private String action;
}
