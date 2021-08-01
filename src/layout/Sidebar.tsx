import React, { useEffect, useState } from 'react'
import { AppstoreOutlined, DatabaseOutlined, ClusterOutlined, FileDoneOutlined, UserOutlined, ShopOutlined } from "@ant-design/icons"
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { useContext } from "react";
import { store } from "../store";

export default function Sidebar() {
  const [activePage, setActivePage] = useState<string>("");
  const location = useLocation();
  const {
    state: { userData },
  } = useContext(store);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  const isSuperAdmin = userData.role === "admin";

  return (
    <div className="sidebarMain">
      {isSuperAdmin && (
        <MenuItemCustom
          title="Dashboard"
          icon={<AppstoreOutlined />}
          linkTo="/"
          isActive={["", "/"].includes(activePage)}
        />
      )}
      <MenuItemCustom
        title="Inventory"
        icon={<DatabaseOutlined />}
        linkTo="/inventory"
        isActive={activePage === "/inventory"}
      />
      <MenuItemCustom
        title="Group"
        icon={<ClusterOutlined />}
        linkTo="/group"
        isActive={activePage === "/group"}
      />
      {isSuperAdmin && (
        <MenuItemCustom
          title="Invoice"
          icon={<FileDoneOutlined />}
          linkTo="/invoice"
          isActive={activePage === "/invoice"}
        />
      )}
      {isSuperAdmin && (
        <MenuItemCustom
          title="User"
          icon={<UserOutlined />}
          linkTo="/user"
          isActive={activePage === "/user"}
        />
      )}
      {isSuperAdmin && (
        <MenuItemCustom
          title="Shop"
          icon={<ShopOutlined />}
          linkTo="/shop"
          isActive={activePage === "/shop"}
        />
      )}
    </div>
  );
}

const MenuItemCustom = ({ icon, title, isActive, linkTo }: {
    icon: React.ReactElement
    title: string,
    isActive: boolean,
    linkTo: string
}) => {
    return (
        <Link to={linkTo}>
            <div className={`meniItem ${isActive ? 'active' : ""}`}>
                {icon} <span className="title">
                    {title}
                </span>
            </div>
        </Link>
    )
}