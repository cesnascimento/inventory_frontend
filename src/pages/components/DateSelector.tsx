import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function DateSelector({
  picker,
  handleChange,
}: {
  picker?: "week" | "month";
  handleChange?: (val: any) => void;
}) {
  return null;
  return (
    <div>
      <RangePicker picker={picker} onChange={handleChange} />
    </div>
  );
}
