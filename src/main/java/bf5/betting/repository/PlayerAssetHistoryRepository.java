package bf5.betting.repository;

import bf5.betting.entity.jpa.PlayerAssetHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * @author duynguyen
 */
@Repository
public interface PlayerAssetHistoryRepository extends JpaRepository<PlayerAssetHistory, Integer> {

    @Query("select a from PlayerAssetHistory a where a.playerId = :playerId AND (a.paymentTime >= :startDate AND a.paymentTime < :endDate)")
    List<PlayerAssetHistory> findByPlayerIdAndDateRange(@Param("playerId") String playerId,
                                                        @Param("startDate") Date startDate,
                                                        @Param("endDate") Date endDate);
}
