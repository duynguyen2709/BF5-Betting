package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.entity.jpa.Player;
import bf5.betting.repository.PlayerRepository;
import bf5.betting.service.PlayerService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class PlayerServiceImpl implements PlayerService {
    private final PlayerRepository playerRepository;
    private Map<String, Player> playerCacheMap;

    @PostConstruct
    void init() {
        this.playerCacheMap = playerRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Player::getPlayerId, Function.identity()));

        log.info("Load PlayerCache Done");
    }

    @Override
    @TryCatchWrap
    public Map<String, Player> getAllPlayer() {
        return this.playerCacheMap;
    }

    @Override
    @TryCatchWrap
    public Player updatePlayerData(Player player) {
        Player newPlayer = this.playerRepository.save(player);
        this.playerCacheMap.put(player.getPlayerId(), newPlayer);
        return newPlayer;
    }

    @Override
    public List<Player> updatePlayerDataBatch(Collection<Player> players) {
        List<Player> newPlayers = this.playerRepository.saveAll(players);
        newPlayers.forEach(player -> this.playerCacheMap.put(player.getPlayerId(), player));
        return newPlayers;
    }
}
