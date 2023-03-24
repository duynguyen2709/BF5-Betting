package bf5.betting.service;

import bf5.betting.entity.jpa.Player;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * @author duynguyen
 **/
public interface PlayerService {
    Map<String, Player> getAllPlayer();
    Player updatePlayerData(Player player);
    List<Player> updatePlayerDataBatch(Collection<Player> players);
}
