package bf5.betting.service.impl;

import bf5.betting.annotation.TryCatchWrap;
import bf5.betting.entity.jpa.PlayerAssetHistory;
import bf5.betting.repository.PlayerAssetHistoryRepository;
import bf5.betting.service.PlayerAssetHistoryService;
import bf5.betting.util.DateTimeUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * @author duynguyen
 **/
@Service
@AllArgsConstructor
@Log4j2
public class PlayerAssetHistoryServiceImpl implements PlayerAssetHistoryService {
    private final PlayerAssetHistoryRepository repository;

    @Override
    @TryCatchWrap
    @Transactional
    public PlayerAssetHistory insert(PlayerAssetHistory data) {
        return this.repository.save(data);
    }

    @Override
    @TryCatchWrap
    @Transactional
    public List<PlayerAssetHistory> insertBatch(Collection<PlayerAssetHistory> list) {
        return this.repository.saveAll(list);
    }

    @Override
    public List<PlayerAssetHistory> getAll() {
        return this.repository.findAll();
    }

    @Override
    public List<PlayerAssetHistory> getByPlayerIdAndDateRange(String playerId, String startDateStr, String endDateStr) {
        Date startDate = DateTimeUtil.stringToDate(startDateStr, DateTimeUtil.SYSTEM_DATE_ONLY_FORMAT);
        Date afterEndDate = DateTimeUtil.getNextDate(endDateStr);
        return this.repository.findByPlayerIdAndDateRange(playerId, startDate, afterEndDate);
    }
}
