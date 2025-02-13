import { BetResult, BetType } from '@/constants';
import type { BetHistory } from '@/types/bet';
import type { TableProps } from 'antd';
import { Button, Table } from 'antd';
import { useState } from 'react';

import { buildCommonTableColumn } from '../shared/BetHistoryTableColumn';
import { UpdateBetResultModal } from '../UpdateBetResultModal';
import styles from './styles.module.css';
import { usePlayerQuery } from '@/hooks';

interface AdminBetHistoryTableProps {
  data: BetHistory[];
  onUpdateSuccess: () => void;
}

const convertBetHistoryRowData = (data: BetHistory[]) => {
  return data?.map((ele) => {
    if (ele.betType === BetType.SINGLE) {
      return {
        ...ele,
        ...ele.events[0],
      };
    }
    return ele;
  });
};

export function AdminBetHistoryTable({ data, onUpdateSuccess }: AdminBetHistoryTableProps) {
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [currentUpdateBet, setCurrentUpdateBet] = useState<BetHistory>();
  const { players } = usePlayerQuery();

  const rowData = convertBetHistoryRowData(data);

  const handleCloseModal = () => {
    setCurrentUpdateBet(undefined);
    setModalUpdateOpen(false);
  };

  const handleClickUpdateBetResult = (bet: BetHistory) => {
    setCurrentUpdateBet(bet);
    setModalUpdateOpen(true);
  };

  const handleUpdateSuccess = () => {
    setCurrentUpdateBet(undefined);
    setModalUpdateOpen(false);
    onUpdateSuccess();
  };

  const columns = [
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      render: (_: any, record: BetHistory) => {
        const isNotFinished = record.result === BetResult.NOT_FINISHED;
        return (
          <>
            {isNotFinished && (
              <Button type="primary" onClick={() => handleClickUpdateBetResult(record)}>
                Cập Nhật
              </Button>
            )}
          </>
        );
      },
    },
    ...buildCommonTableColumn(players)!,
  ];

  const tableProps: TableProps<BetHistory> = {
    size: 'middle',
    className: styles['tableBetHistory'],
    rowKey: 'betId',
    bordered: true,
    columns,
    dataSource: rowData,
    pagination: {
      defaultPageSize: 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng: ${total} cược`,
    },
    scroll: {
      x: 2000,
    },
  };

  return (
    <>
      {modalUpdateOpen && currentUpdateBet && (
        <UpdateBetResultModal
          data={currentUpdateBet}
          isOpen={modalUpdateOpen}
          onUpdateSuccess={handleUpdateSuccess}
          onClose={handleCloseModal}
        />
      )}
      <Table {...tableProps} />
    </>
  );
}
