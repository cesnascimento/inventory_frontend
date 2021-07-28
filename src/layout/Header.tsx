import { Input, Dropdown, Menu } from "antd"
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { useContext } from "react";
import { store } from "../store";
import { logout } from "../utils/functions";
import { useHistory } from "react-router-dom";

export default function Header() {
    return (
        <div className="headerMain">
            <div className="brand">
                INVENTORY
            </div>
            <div className="rightNav">
                <div />
                <UserAvatar />
            </div>
        </div>
    )
}

function UserAvatar() {
    const { state: { userData } } = useContext(store)
    const history = useHistory()
    return <div className="userAvatar">
        <Dropdown overlay={userDropMenu(history)} trigger={['click']}>
            <span className="dropdownLink" onClick={e => e.preventDefault()}>
                {userData.fullname} <DownOutlined />
            </span>
        </Dropdown>
    </div>
}

const userDropMenu = (history: any) => (
    <Menu>
        <Menu.Item key="0">
            <span onClick={() => logout(history)}>Logout</span>
        </Menu.Item>
    </Menu>
)