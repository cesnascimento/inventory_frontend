import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function DateSelector({
  picker,
  handleChange,
}: {
  picker?: "week" | "month";
  handleChange?: (val: any) => void;
}) {
  return (
    <div>
      <RangePicker size='small' picker={picker} format="DD/MM/YYYY" onChange={handleChange} />
    </div>
  );
}
