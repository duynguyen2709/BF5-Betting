package bf5.betting.repository;

import bf5.betting.constant.BetResult;
import bf5.betting.entity.jpa.BetHistory;
import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * @author duynguyen
 */
@Repository
public interface BetHistoryRepository extends JpaRepository<BetHistory, Long> {

  @Query("select a from BetHistory a where a.playerId = :playerId AND (a.betTime >= :startDate AND a.betTime < :afterEndDate)")
  List<BetHistory> findByPlayerIdAndDateRange(@Param("playerId") String playerId,
      @Param("startDate") Date startDate,
      @Param("afterEndDate") Date afterEndDate);

  @Query("select a from BetHistory a where a.result = :result")
  List<BetHistory> findByResult(@Param("result") BetResult result);
}
