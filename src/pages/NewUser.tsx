import { Button, Form, Input } from 'antd'
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout'
import Axios from "axios"
import { LOGIN_URL } from '../utils/myPaths';
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../utils/functions';
import { USERIDUPDATE } from '../layout/MainLayout';

export default function NewUser() {
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()

    const onFinish = async (values: any) => {
        setIsLoading(true)
        const result = await Axios.post(LOGIN_URL, { ...values, is_new_user: true }).catch(
            e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        )
        if (result) {
            localStorage.setItem(USERIDUPDATE, result.data.user_id)
            history.push("/update-password")
        }
        setIsLoading(false)
    }

    return (
        <AuthLayout title="Verify Yourself!">
            <br />
            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please input your email" }]}
                >
                    <Input placeholder="Enter email" type="email" />
                </Form.Item>

                <Button type="primary" block htmlType="submit" loading={isLoading}>Submit</Button>

            </Form>
            <div className="spacer-10v"></div>
            <Link to="/login">
                Go Back
            </Link>
        </AuthLayout>
    )
}
