import React, { useContext, useEffect, useState } from 'react'
import { DatabaseOutlined, ClusterOutlined, UserOutlined, ShopOutlined } from "@ant-design/icons"
import Axios from "axios"
import { SUMMARY_URL } from "../../utils/myPaths"
import { store } from '../../store'
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions'
import Loader from './Loader'

export default function DashboardContentSumary() {

    const [summaryData, setSummaryData]: any = useState({})
    const [fetching, setFetching] = useState(true)
    const { state: { userToken } } = useContext(store)

    const getSummaryData = async () => {
        const res = await Axios.get(SUMMARY_URL, { headers: { Authorization: userToken } }).catch(
            e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        )
        if (res) {
            setSummaryData(res.data)
            setFetching(false)
        }
    }

    useEffect(() => {
        getSummaryData()
    }, [])

    return (
        <div className="dashboardContentSumary">
            <DashboardSummaryCard
                title="Total de item"
                count={summaryData?.total_inventory}
                loading={fetching}
                icon={<DatabaseOutlined style={{ fontSize: "30px", color: "#4451C2" }} />}
            />

            <DashboardSummaryCard
                title="Total Grupos/Categoria"
                count={summaryData?.total_group}
                loading={fetching}
                icon={<ClusterOutlined style={{ fontSize: "30px", color: "#4495C2" }} />}
            />

            <DashboardSummaryCard
                title="Total de Lojas"
                count={summaryData?.total_shop}
                loading={fetching}
                icon={<ShopOutlined style={{ fontSize: "30px", color: "#FA9696" }} />}
            />

            <DashboardSummaryCard
                title="Total Usuários"
                count={summaryData?.total_users}
                loading={fetching}
                icon={<UserOutlined style={{ fontSize: "30px", color: "#02AC32" }} />}
            />
        </div>
    )
}

const DashboardSummaryCard = ({ icon, title, count, loading = false }: {
    icon: React.ReactElement
    title: string,
    count: string,
    loading?: boolean
}) => {
    return (
        <div className="cardMain dashboardBoardSummaryCard">
            <div className="content">
                <div className="title">{title}</div>
                {loading ? <Loader /> : <div className="count">{count}</div>}
            </div>
            <div className="icon">
                {icon}
            </div>
        </div>
    )
}
