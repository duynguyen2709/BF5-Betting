package bf5.betting.service;

import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.TeamData;

import java.util.Collection;
import java.util.List;

/**
 * @author duynguyen
 **/
public interface TeamDataService {

  String getTeamLogoUrl(String teamName);

  String getTeamVnName(String teamName);

  List<TeamData> insertBatch(Collection<TeamData> teams);

  void insertTeamDataIfNotAvailable(BetHistory betHistory);

  void insertTeamDataIfNotAvailable(List<BetHistory> betHistories);
}
