package bf5.betting.service.impl;

import bf5.betting.entity.jpa.TeamData;
import bf5.betting.repository.TeamDataRepository;
import bf5.betting.service.TeamDataService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class TeamDataServiceImpl implements TeamDataService {

    private final TeamDataRepository teamDataRepository;

    private Map<String, TeamData> teamDataCacheMap;

    @PostConstruct
    void init() {
        this.teamDataCacheMap = teamDataRepository.findAll()
                .stream()
                .collect(Collectors.toMap(TeamData::getTeamName, Function.identity()));

        log.info("Load TeamDataCache Done");
    }

    @Override
    public String getTeamLogoUrl(String teamName) {
        TeamData team = this.teamDataCacheMap.get(teamName);
        return Objects.isNull(team) ? null : team.getLogoUrl();
    }

    @Override
    public TeamData insert(TeamData teamData) {
        TeamData result = this.teamDataRepository.save(teamData);
        this.teamDataCacheMap.put(result.getTeamName(), result);
        return teamData;
    }
}
