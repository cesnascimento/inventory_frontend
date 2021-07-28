import { Button, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import AuthLayout from '../layout/AuthLayout'
import { USERIDUPDATE } from '../layout/MainLayout'
import { errorHandler, NotificationTypes, openNotificationWithIcon, redirectToLogin } from '../utils/functions'
import Axios from "axios"
import { UPDATE_PASSWORD_URL } from '../utils/myPaths'

export default function UpdatePassword() {
    const [userId, setUserId]: any = useState()
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()

    useEffect(() => {
        const userId = localStorage.getItem(USERIDUPDATE)
        if (!userId) {
            redirectToLogin(history)
            return
        }
        setUserId(userId)
    })

    const onFinish = async (values: any) => {
        if (values.password !== values.confirm_password) {
            openNotificationWithIcon(NotificationTypes.ERROR, "Passwords do not match");
            return
        }
        setIsLoading(true)
        const result = await Axios.post(UPDATE_PASSWORD_URL, { ...values, user_id: userId }).catch(
            e => {
                openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
            }
        )
        if (result) {
            openNotificationWithIcon(NotificationTypes.SUCCESS, "Password updated successfully")
            localStorage.removeItem(USERIDUPDATE)
            redirectToLogin(history)
        }

        setIsLoading(false)
    }

    return (
        <AuthLayout title="Update Password">
            <br />
            <Form
                layout="vertical"
                onFinish={onFinish}
            >

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password" }]}
                >
                    <Input placeholder="Enter password" type="password" />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                    rules={[{ required: true, message: "Please input your confirmation password" }]}
                >
                    <Input placeholder="Enter confirmation password" type="password" />
                </Form.Item>
                <Button type="primary" block htmlType="submit" loading={isLoading}>Submit</Button>

            </Form>
        </AuthLayout>
    )
}
