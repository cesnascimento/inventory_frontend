import { Button, Form, Input } from 'antd';
import { useContext, useState } from 'react';
import { store } from '../../store';
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions';
import Axios from "axios"
import { SHOP_URL } from '../../utils/myPaths';

export default function ShopForm({
    onAddComplete
}: { onAddComplete: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const { state: { userToken } } = useContext(store)
    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        setIsLoading(true)
        const result = await Axios.post(SHOP_URL, values, { headers: { Authorization: userToken } }).catch(
            e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        )
        if (result) {
            openNotificationWithIcon(NotificationTypes.SUCCESS, "Shop Added Successfully")
            form.resetFields()
            onAddComplete()
        }
        setIsLoading(false)
    }

    return (
        <div>

            <Form
                layout="vertical"
                requiredMark
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    label="Shop Name"
                    name="name"
                    rules={[{ required: true, message: "Please input shop name" }]}
                >
                    <Input placeholder="Enter shop name" />
                </Form.Item>

                <Button block type="primary" htmlType="submit" loading={isLoading}>Submit</Button>
            </Form>
        </div>
    )
}
