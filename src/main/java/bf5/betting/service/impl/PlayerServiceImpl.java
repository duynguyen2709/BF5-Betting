package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.entity.jpa.Player;
import bf5.betting.repository.PlayerRepository;
import bf5.betting.service.PlayerService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;

    @Override
    @TryCatchWrap
    public List<Player> getAllPlayer() {
        return playerRepository.findAll();
    }
}
