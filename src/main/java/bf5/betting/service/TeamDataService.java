package bf5.betting.service;

import bf5.betting.entity.jpa.TeamData;

import java.util.Collection;
import java.util.List;

/**
 * @author duynguyen
 **/
public interface TeamDataService {
    String getTeamLogoUrl(String teamName);

    TeamData insert(TeamData teamData);

    List<TeamData> insertBatch(Collection<TeamData> teams);
}
