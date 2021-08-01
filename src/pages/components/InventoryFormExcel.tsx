import { useContext, useState } from 'react'
import { Button, Form, Input } from 'antd';
import Axios from "axios"
import { store } from '../../store';
import { INVENTORY_CSV_URL } from '../../utils/myPaths';
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions';

export default function InventoryFormExcel({
    onAddComplete
}: { onAddComplete: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const { state: { userToken } } = useContext(store)
    const [selectedFile, setSelectedFile]: any = useState(null)
    const [form] = Form.useForm()

    const handleFileSelect = (e: any) => {
        setSelectedFile(e.target?.files[0])
    }

    const onFinish = async (values: any) => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("data", selectedFile)

        const result = await Axios.post(INVENTORY_CSV_URL, formData, { headers: { Authorization: userToken } }).catch(
            e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        )
        if (result) {
            openNotificationWithIcon(NotificationTypes.SUCCESS, "Item Added Successfully")
            form.resetFields()
            onAddComplete()
        }
        setIsLoading(false)
    }

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="File (CSV)"
                    name="file"
                    rules={[{ required: true, message: "Please upload your csv file" }]}
                >
                    <Input placeholder="Choose File" type="file" accept=".csv" onChange={handleFileSelect} />
                </Form.Item>
                <a href={window.location.origin + "/inventory_sample.csv"} download="inventory_sample">
                    Click here to download sample file.
                </a><br />
                <strong style={{ color: "red" }}>(NB: Do not include the labels in your data, they are just for description)</strong>
                <div className="spacer-10v" />
                <Button block type="primary" htmlType="submit" loading={isLoading}>Submit</Button>
            </Form>
        </div>
    )
}
