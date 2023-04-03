package bf5.betting.service.impl;

import bf5.betting.entity.jpa.TeamData;
import bf5.betting.repository.TeamDataRepository;
import bf5.betting.service.TeamDataService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;
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
        if (StringUtils.isBlank(teamName)) {
            return null;
        }
        TeamData team = this.teamDataCacheMap.get(teamName);
        return Objects.isNull(team) ? null : team.getLogoUrl();
    }

    @Override
    @Transactional
    public TeamData insert(TeamData teamData) {
        TeamData result = this.teamDataRepository.save(teamData);
        this.teamDataCacheMap.put(result.getTeamName(), result);
        return teamData;
    }

    @Override
    @Transactional
    public List<TeamData> insertBatch(Collection<TeamData> teams) {
        List<TeamData> result = this.teamDataRepository.saveAll(teams);
        result.forEach(data -> this.teamDataCacheMap.put(data.getTeamName(), data));
        return result;
    }
}
