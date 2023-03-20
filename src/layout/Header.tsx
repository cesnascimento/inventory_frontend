import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { store } from "../store";
import { logout } from "../utils/functions";
import { Link, useHistory } from "react-router-dom";

export default function Header() {
  const {
    state: { userData },
  } = useContext(store);
  return (
    <div className="headerMain">
      <div className="brand">INVENTÁRIO</div>
      <div className="rightNav">
        <div />
        <div className="flex align-center">
          {userData.role !== "sale" && (
            <Link to="/invoice-section">
              <Button type="primary">Nova Fatura</Button>
            </Link>
          )}
          <div className="spacer-10"></div>
          <UserAvatar />
        </div>
      </div>
    </div>
  );
}

function UserAvatar() {
  const {
    state: { userData },
  } = useContext(store);
  const history = useHistory();
  return (
    <div className="userAvatar">
      <Dropdown overlay={userDropMenu(history)} trigger={["click"]}>
        <span className="dropdownLink" onClick={(e) => e.preventDefault()}>
          {userData.fullname} <DownOutlined />
        </span>
      </Dropdown>
    </div>
  );
}

const userDropMenu = (history: any) => (
  <Menu>
    <Menu.Item key="0">
      <span onClick={() => logout(history)}>Logout</span>
    </Menu.Item>
  </Menu>
);
