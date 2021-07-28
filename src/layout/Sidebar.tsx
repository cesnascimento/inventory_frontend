import React, { useEffect, useState } from 'react'
import { AppstoreOutlined, DatabaseOutlined, ClusterOutlined, FileDoneOutlined, UserOutlined, ShopOutlined } from "@ant-design/icons"
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

export default function Sidebar() {

    const [activePage, setActivePage] = useState<string>("")
    const location = useLocation()

    useEffect(() => {
        setActivePage(location.pathname)
    }, [location])

    return (
        <div className="sidebarMain">
            <MenuItemCustom
                title="Dashboard"
                icon={<AppstoreOutlined />}
                linkTo="/"
                isActive={["", "/"].includes(activePage)} />
            <MenuItemCustom
                title="Inventory"
                icon={<DatabaseOutlined />}
                linkTo="/inventory"
                isActive={activePage === "/inventory"} />
            <MenuItemCustom
                title="Group"
                icon={<ClusterOutlined />}
                linkTo="/group"
                isActive={activePage === "/group"} />
            <MenuItemCustom
                title="Invoice"
                icon={<FileDoneOutlined />}
                linkTo="/invoice"
                isActive={activePage === "/invoice"} />
            <MenuItemCustom
                title="User"
                icon={<UserOutlined />}
                linkTo="/user"
                isActive={activePage === "/user"} />
            <MenuItemCustom
                title="Shop"
                icon={<ShopOutlined />}
                linkTo="/shop"
                isActive={activePage === "/shop"} />
        </div>
    )
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