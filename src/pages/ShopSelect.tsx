import { Button, Form, Select } from 'antd'
import { Link } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout'

const { Option } = Select;

export default function ShopSelect() {
    const [form] = Form.useForm();
    return (
        <AuthLayout title="Select Shop">
            <br />
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="Shop"
                    rules={[{ required: true, message: "Choose shop" }]}
                >
                    <Select placeholder="Choose shop to sell from">
                        <Option value="electronics">Electronics</Option>
                        <Option value="electronics">Phone</Option>
                        <Option value="electronics">Fashion</Option>
                    </Select>
                </Form.Item>

                <Button type="primary" block>Select</Button>

            </Form>
            <div className="spacer-10v"></div>
            <Link to="/login">
                Cancel
            </Link>
        </AuthLayout>
    )
}
