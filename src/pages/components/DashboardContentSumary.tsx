import React, { useContext, useEffect, useState } from 'react'
import { DesktopOutlined, LaptopOutlined, MobileOutlined, DatabaseOutlined } from "@ant-design/icons"
import Axios from "axios"
import { SUMMARY_URL } from "../../utils/myPaths"
import { store } from '../../store'
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions'
import Loader from './Loader'
import { DashboardProvider, useDashboardContext } from '../../contexts/DashboardContext'

function DashboardContentSumary() {

    const {setFilteredDashboard} = useDashboardContext()

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
                title="Total de Desktop"
                count={summaryData?.total_inventory}
                loading={fetching}
                icon={<DesktopOutlined style={{ fontSize: "30px", color: "#4451C2" }} />}
                onClick={() => setFilteredDashboard('desktop')}
            />

            <DashboardSummaryCard
                title="Total de Notebook"
                count={summaryData?.total_group}
                loading={fetching}
                icon={<LaptopOutlined style={{ fontSize: "30px", color: "#4495C2" }} />}
                onClick={() => setFilteredDashboard('notebook')}
            />

            <DashboardSummaryCard
                title="Total de Mobiles"
                count={summaryData?.total_shop}
                loading={fetching}
                icon={<MobileOutlined style={{ fontSize: "30px", color: "#FA9696" }} />}
                onClick={() => setFilteredDashboard('mobile')}
            />

            <DashboardSummaryCard
                title="Total de DataCenter"
                count={summaryData?.total_users}
                loading={fetching}
                icon={<DatabaseOutlined style={{ fontSize: "30px", color: "#02AC32" }} />}
                onClick={() => setFilteredDashboard('datacenter')}
            />
        </div>
    )
}

const DashboardSummaryCard = ({ icon, title, count, onClick, loading = false }: {
    icon: React.ReactElement
    title: string,
    count: string,
    onClick: () => void,
    loading?: boolean

}) => {
    return (
        <div className="cardMain dashboardBoardSummaryCard" onClick={onClick}>
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

export default DashboardContentSumary;
