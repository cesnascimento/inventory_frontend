import React from 'react'
import DashboardContentSumary from "./components/DashboardContentSumary"
import PurchaseSummary from './components/PurchaseSummary'
import SalePerformance from './components/SalePerformance'
import SalePieChart from './components/SalePieChart'
import TopSellingItems from './components/TopSellingItems'

export default function Dashboard() {
    return (
        <div>
            <DashboardContentSumary />
            <br />
            <div className="gridSection">
                <TopSellingItems />
                <SalePieChart />
            </div>
            <br />
            <div className="gridSection">
                <SalePerformance />
                <PurchaseSummary />
            </div>
        </div>
    )
}
