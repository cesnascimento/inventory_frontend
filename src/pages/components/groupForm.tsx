import { Button, Form, Input, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { store } from '../../store';
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions';
import Axios from "axios"
import { GROUP_URL } from '../../utils/myPaths';

const { Option } = Select;

export default function GroupForm({
    onAddComplete, belongsToList,
    activeItem
}: { onAddComplete: () => void, belongsToList: any, activeItem: any; }) {
    const [isLoading, setIsLoading] = useState(false)
    const { state: { userToken } } = useContext(store)
    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        setIsLoading(true)
        let url = GROUP_URL
        if (activeItem) {
            url = GROUP_URL + `/${activeItem.id}`
        }
        const result = await Axios[activeItem ? "patch" : "post"](url, values, { headers: { Authorization: userToken } }).catch(
            e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        )
        if (result) {
            openNotificationWithIcon(NotificationTypes.SUCCESS, `Group ${activeItem ? 'Added' : 'Updated'} Successfully`)
            onAddComplete()
            form.resetFields()
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (activeItem) {
            form.setFieldsValue({ ...activeItem, belongs_to_id: activeItem.belongs_to?.id })
        }
    }, [activeItem])

    return (
        <div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Group Name"
                    name="name"
                    rules={[{ required: true, message: "Please input group name" }]}
                >
                    <Input placeholder="Enter group name" />
                </Form.Item>
                <Form.Item
                    label="Belongs To (Optional)"
                    name="belongs_to_id"
                >
                    <Select
                        placeholder="Select item category"
                        allowClear
                    >
                        {
                            belongsToList ?
                                belongsToList.map((item: any, i: number) =>
                                    <Option key={i} value={item.id}>{item.name}</Option>) :
                                <Option value="">Loading...</Option>
                        }
                    </Select>
                </Form.Item>
                <Button block type="primary" htmlType="submit" loading={isLoading}>
                    {activeItem ? "Update" : "Submit"}
                </Button>
            </Form>
        </div>
    )
}
