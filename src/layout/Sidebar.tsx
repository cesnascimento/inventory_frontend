import React, { useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  DatabaseOutlined,
  NumberOutlined,
  ClusterOutlined,
  FileDoneOutlined,
  UsergroupDeleteOutlined,
  UsergroupAddOutlined,
  DesktopOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
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

  const isSuperAdmin = userData.is_superuser === true;
  console.log(isSuperAdmin)

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
        title="Inventário Desktop"
        icon={<DesktopOutlined />}
        linkTo="/inventory"
        isActive={activePage === "/inventory"}
      />
      <MenuItemCustom
        title="Inventário Notebook"
        icon={<DesktopOutlined />}
        linkTo="/inventory-notebook"
        isActive={activePage === "/inventory-notebook"}
      />
      <MenuItemCustom
        title="Inventário Mobile"
        icon={<DesktopOutlined />}
        linkTo="/inventory-mobile"
        isActive={activePage === "/inventory-mobile"}
      />
      <MenuItemCustom
        title="Inventário DataCenter"
        icon={<DesktopOutlined />}
        linkTo="/inventory-datacenter"
        isActive={activePage === "/inventory-datacenter"}
      />
      <MenuItemCustom
        title="Local"
        icon={<ShopOutlined />}
        linkTo="/group"
        isActive={activePage === "/group"}
      />
      {isSuperAdmin && (
        <MenuItemCustom
          title="Colaborador"
          icon={<UsergroupAddOutlined />}
          linkTo="/colab"
          isActive={activePage === "/colab"}
        />
      )}
      {isSuperAdmin && (
        <MenuItemCustom
          title="Usuário"
          icon={<UserOutlined />}
          linkTo="/user"
          isActive={activePage === "/user"}
        />
      )}
      {/* {isSuperAdmin && (
        <MenuItemCustom
          title="Lojas"
          icon={<ShopOutlined />}
          linkTo="/shop"
          isActive={activePage === "/shop"}
        />
      )} */}
      {isSuperAdmin && (
        <MenuItemCustom
          title="Atividades de Usuários"
          icon={<NumberOutlined />}
          linkTo="/user-activities"
          isActive={activePage === "/user-activities"}
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