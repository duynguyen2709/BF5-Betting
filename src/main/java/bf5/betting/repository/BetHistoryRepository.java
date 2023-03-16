package bf5.betting.repository;

import bf5.betting.entity.jpa.BetHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

/**
 * @author duynguyen
 */
@Repository
public interface BetHistoryRepository extends JpaRepository<BetHistory, Integer> {

    List<BetHistory> findByPlayerId(String playerId);

    @Query("select a from BetHistory a where a.playerId = :playerId AND DATE(a.betTime) = :betTime")
    List<BetHistory> findByPlayerIdAndBetTime(@Param("playerId") String playerId, @Param("betTime") Date betTime);
}
