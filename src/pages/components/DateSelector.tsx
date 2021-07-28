import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function DateSelector({ picker }: { picker?: "week" | "month" }) {
    return (
        <div>
            <RangePicker picker={picker} />
        </div>
    )
}
