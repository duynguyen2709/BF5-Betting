package bf5.betting.service;

import bf5.betting.entity.jpa.Player;

import java.util.List;

/**
 * @author duynguyen
 **/
public interface PlayerService {

    List<Player> getAllPlayer();
}
