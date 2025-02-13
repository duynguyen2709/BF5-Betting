import { useStatisticMutation } from '@/hooks/useStatisticMutation';
import type { StatisticRequest } from '@/types/statistic';
import { Button, DatePicker, Form, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface AssetHistoryStatisticFormProps {
  onSuccess: () => void;
}

export function AssetHistoryStatisticForm({ onSuccess }: AssetHistoryStatisticFormProps) {
  const [form] = Form.useForm<StatisticRequest>();
  const { mutate: doStatistic, isPending } = useStatisticMutation();

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const handleFinish = (values: StatisticRequest) => {
    doStatistic(values, {
      onSuccess,
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="inline"
      initialValues={{
        dateRange: [dayjs(), dayjs()],
      }}
    >
      <Form.Item
        name="dateRange"
        rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
      >
        <RangePicker format="DD/MM/YYYY" disabledDate={disabledDate} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button ghost type="primary" htmlType="submit" loading={isPending}>
            Chạy Thống Kê
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
