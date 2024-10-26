package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.entity.jpa.BetHistory;
import bf5.betting.entity.jpa.TeamData;
import bf5.betting.repository.TeamDataRepository;
import bf5.betting.service.TeamDataService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.*;
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
  public String getTeamVnName(String teamName) {
    if (StringUtils.isBlank(teamName)) {
      return null;
    }
    TeamData team = this.teamDataCacheMap.get(teamName);
    return Objects.isNull(team) ? null : team.getVnTeamName();
  }

  @Override
  @TryCatchWrap
  @Transactional
  public List<TeamData> insertBatch(Collection<TeamData> teams) {
    List<TeamData> result = this.teamDataRepository.saveAll(teams);
    result.forEach(data -> this.teamDataCacheMap.put(data.getTeamName(), data));
    return result;
  }

  @Override
  @TryCatchWrap
  @Transactional
  public void insertTeamDataIfNotAvailable(BetHistory betHistory) {
    Map<String, TeamData> newTeamData = new HashMap<>();
    addTeamDataIfNotAvailable(newTeamData, betHistory);
    if (!newTeamData.isEmpty()) {
      this.insertBatch(newTeamData.values());
    }
  }

  @Override
  @TryCatchWrap
  @Transactional
  public void insertTeamDataIfNotAvailable(List<BetHistory> betHistories) {
    Map<String, TeamData> newTeamData = new HashMap<>();
    betHistories.forEach(bet -> addTeamDataIfNotAvailable(newTeamData, bet));
    if (!newTeamData.isEmpty()) {
      this.insertBatch(newTeamData.values());
    }
  }

  private void addTeamDataIfNotAvailable(Map<String, TeamData> newTeamData, BetHistory bet) {
    final String defaultLogo = "https://v2l.cdnsfree.com/sfiles/logo_teams/teamdefault.png";
    bet.getEvents().forEach(event -> {
      if (Objects.isNull(this.getTeamLogoUrl(event.getFirstTeam()))) {
        String url = StringUtils.isBlank(event.getFirstTeamLogoUrl()) ? defaultLogo
            : event.getFirstTeamLogoUrl();
        newTeamData.put(event.getFirstTeam(), new TeamData(event.getFirstTeam(), url, ""));
      }
      if (Objects.isNull(this.getTeamLogoUrl(event.getSecondTeam()))) {
        String url = StringUtils.isBlank(event.getSecondTeamLogoUrl()) ? defaultLogo
            : event.getSecondTeamLogoUrl();
        newTeamData.put(event.getSecondTeam(), new TeamData(event.getSecondTeam(), url, ""));
      }
    });
  }

}
