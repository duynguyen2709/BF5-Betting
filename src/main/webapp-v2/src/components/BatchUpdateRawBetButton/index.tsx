import { RAW_BET_STATUS } from '@/constants';
import { useBatchUpdateRawBetResultsMutation } from '@/hooks/useRawBetQuery';
import type { BetHistory } from '@/types/bet';
import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useMemo } from 'react';

interface BatchUpdateRawBetButtonProps {
  data: BetHistory[];
  onSuccess?: () => void;
}

export function BatchUpdateRawBetButton({ data, onSuccess }: BatchUpdateRawBetButtonProps) {
  const { mutate: updateBatchRawBets, isPending } = useBatchUpdateRawBetResultsMutation();
  const betListToBeUpdated = useMemo(
    () => data.filter((bet) => bet.rawStatus === RAW_BET_STATUS.ResultReadyToBeUpdated),
    [data]
  );

  const handleUpdateRawBet = () => {
    updateBatchRawBets(betListToBeUpdated, {
      onSuccess,
    });
  };

  return (
    <Button
      type="primary"
      icon={<SyncOutlined />}
      onClick={handleUpdateRawBet}
      loading={isPending}
      style={{ marginRight: 8 }}
      disabled={betListToBeUpdated.length === 0}
    >
      Cập Nhật Nhanh
    </Button>
  );
}
