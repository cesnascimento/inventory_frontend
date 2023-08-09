import {
  DatabaseOutlined,
  DesktopOutlined,
  NumberOutlined,
  ShopOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  LaptopOutlined,
  MobileOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from 'react'

import { Link } from "react-router-dom";
import { store } from "../store";
import { useContext } from "react";
import { useLocation } from "react-router";

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

  return (
    <div className="sidebarMain">
      <MenuItemCustom
        title="Dashboard"
        icon={<BarChartOutlined />}
        linkTo="/"
        isActive={["", "/"].includes(activePage)}
      />
      <MenuItemCustom
        title="Inventário Desktop"
        icon={<DesktopOutlined />}
        linkTo="/inventory"
        isActive={activePage === "/inventory"}
      />
      <MenuItemCustom
        title="Inventário Notebook"
        icon={<LaptopOutlined />}
        linkTo="/inventory-notebook"
        isActive={activePage === "/inventory-notebook"}
      />
      <MenuItemCustom
        title="Inventário Mobile"
        icon={<MobileOutlined />}
        linkTo="/inventory-mobile"
        isActive={activePage === "/inventory-mobile"}
      />
      <MenuItemCustom
        title="Inventário DataCenter"
        icon={<DatabaseOutlined />}
        linkTo="/inventory-datacenter"
        isActive={activePage === "/inventory-datacenter"}
      />
      {/* <MenuItemCustom
        title="Inventário Depreciado"
        icon={<ToolOutlined />}
        linkTo="/inventory-notebook"
        isActive={activePage === "/inventory-notebook"}
      /> */}
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
      {isSuperAdmin && (
        <MenuItemCustom
          title="Atividades de Inventarios"
          icon={<NumberOutlined />}
          linkTo="/inventory-activities"
          isActive={activePage === "/inventory-activities"}
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