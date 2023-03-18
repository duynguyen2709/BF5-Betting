package bf5.betting.service;

import bf5.betting.entity.jpa.TeamData;

/**
 * @author duynguyen
 **/
public interface TeamDataService {

    String getTeamLogoUrl(String teamName);
    TeamData insert(TeamData teamData);
}
