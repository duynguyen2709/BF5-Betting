package bf5.betting.service;

import bf5.betting.entity.jpa.Player;

import java.util.Map;

/**
 * @author duynguyen
 **/
public interface PlayerService {

    Map<String, Player> getAllPlayer();
    Player updatePlayerData(Player player);
}
