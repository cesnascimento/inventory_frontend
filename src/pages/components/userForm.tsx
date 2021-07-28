import { Button, Form, Input, Select } from 'antd';
import { useContext, useState } from 'react';
import Axios from "axios"
import { CREATE_USER_URL } from '../../utils/myPaths';
import { store } from '../../store';
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions';

const { Option } = Select;

export default function UserForm({
    onAddComplete
}: { onAddComplete: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const { state: { userToken } } = useContext(store)
    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        setIsLoading(true)
        const result = await Axios.post(CREATE_USER_URL, values, { headers: { Authorization: userToken } }).catch(
            e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        )
        if (result) {
            openNotificationWithIcon(NotificationTypes.SUCCESS, "User Added Successfully")
            form.resetFields()
            onAddComplete()
        }
        setIsLoading(false)
    }

    return (
        <div>

            <Form
                layout="vertical"
                onFinish={onFinish}
                name="basic"
                initialValues={{ remember: true }}
                form={form}
            >
                <Form.Item
                    label="User Fullname"
                    name="fullname"
                    rules={[{ required: true, message: "Please input user fullname" }]}
                >
                    <Input placeholder="Enter user fullname" />
                </Form.Item>
                <Form.Item
                    label="User Email"
                    name="email"
                    rules={[{ required: true, message: "Please input user email" }]}
                >
                    <Input placeholder="Enter user email" type="email" />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Please select an option" }]}
                >
                    <Select placeholder="Select item category">
                        <Option value="admin">Admin</Option>
                        <Option value="creator">Creator</Option>
                        <Option value="sale">Sale</Option>
                    </Select>
                </Form.Item>
                <Button block type="primary" htmlType="submit" loading={isLoading}>Submit</Button>
            </Form>
        </div>
    )
}
