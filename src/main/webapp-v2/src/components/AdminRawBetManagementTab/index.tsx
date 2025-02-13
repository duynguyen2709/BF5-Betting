import { Form } from 'antd';
import type { QueryRawBetFormValues } from '@/types/rawBet';
import { AddBetHistoryModal } from '../AddBetHistoryModal';
import { CenterLoadingSpinner } from '../CenterLoadingSpinner';
import { RawBetTable } from './RawBetTable';
import { ActionBar } from './ActionBar';
import { useRawBetManagement } from './hooks';
import type { AdminRawBetManagementTabProps } from './types';

export function AdminRawBetManagementTab({
  onSuccessAction,
}: AdminRawBetManagementTabProps): JSX.Element {
  const [form] = Form.useForm<QueryRawBetFormValues>();

  const {
    modalAddSingleOpen,
    modalAddBatchOpen,
    currentAddBet,
    currentBatchAddBet,
    rawBetList,
    isLoading,
    handleProcessRawBetSuccess,
    handleFetchRawBetList,
    handleQuickFetchRawBetList,
    handleClickAddSingleBet,
    handleClickAddBatchBet,
    handleCloseSingleModal,
    handleCloseBatchModal,
  } = useRawBetManagement(form, onSuccessAction);

  return (
    <>
      <ActionBar
        form={form}
        loading={isLoading}
        onFetchRawBetList={handleFetchRawBetList}
        onQuickFetch={handleQuickFetchRawBetList}
        tableData={rawBetList}
        currentBatchAddBet={currentBatchAddBet}
        onClickAddBatch={handleClickAddBatchBet}
        onProcessSuccess={handleProcessRawBetSuccess}
      />

      {isLoading ? (
        <CenterLoadingSpinner />
      ) : (
        <RawBetTable
          data={rawBetList}
          onClickAdd={handleClickAddSingleBet}
          onSelectBatchBets={handleClickAddBatchBet}
          onUpdateSuccess={handleProcessRawBetSuccess}
        />
      )}

      {modalAddSingleOpen && currentAddBet && (
        <AddBetHistoryModal
          data={currentAddBet}
          isOpen={modalAddSingleOpen}
          onClose={handleCloseSingleModal}
          onUpdateSuccess={handleProcessRawBetSuccess}
        />
      )}
      {modalAddBatchOpen && currentBatchAddBet.length > 0 && (
        <AddBetHistoryModal
          data={currentBatchAddBet}
          isOpen={modalAddBatchOpen}
          onClose={handleCloseBatchModal}
          onUpdateSuccess={handleProcessRawBetSuccess}
        />
      )}
    </>
  );
}
