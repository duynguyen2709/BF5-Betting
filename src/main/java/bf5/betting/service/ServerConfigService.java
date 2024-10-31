package bf5.betting.service;

/**
 * @author duynguyen
 **/
public interface ServerConfigService {

  String getLastActiveToken();

  void setLastActiveToken(String lastActiveToken);

  int getAutoUpdaterIntervalMinutes();

  String getBetHistoryApiUrl();
}
