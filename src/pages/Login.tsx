import { Button, Form, Input } from 'antd'
import { Link, useHistory } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout'
import Axios from "axios"
import { LOGIN_URL } from '../utils/myPaths';
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../utils/functions';
import { useState } from 'react';

import { USERTOKEN } from "../layout/MainLayout"

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()

    const onFinish = async (values: any) => {
        setIsLoading(true)
        const result: any = await Axios.post(LOGIN_URL, values).catch(e => {
            openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        })

        if (result) {
            localStorage.setItem(USERTOKEN, result?.data?.access)
            history.push("/")
        }

        setIsLoading(false)
    };
    return (
      <AuthLayout>
        <br />
        <Form
          layout="vertical"
          onFinish={onFinish}
          name="basic"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email" }]}
          >
            <Input placeholder="Entre com email" type="email" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input placeholder="Entre com a senha" type="password" />
          </Form.Item>
          <Button type="primary" block htmlType="submit" loading={isLoading}>
            Login
          </Button>
        </Form>
        <div className="spacer-10v"></div>
        <Link to="/check-user">Novo Usuário?</Link>
        <br />
        <br />
        <div style={{ textAlign: "center" }}>
          <Link to="/inventory-list">VEJA A LISTA DO INVENTÁRIO</Link>
        </div>
      </AuthLayout>
    );
}
