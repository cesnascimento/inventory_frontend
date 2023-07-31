import React from 'react'
import DashboardContentSumary from "./components/DashboardContentSumary"
/* import PurchaseSummary from './components/PurchaseSummary' */
import SalePerformance from './components/SalePerformance'
import SalePieChart from './components/SalePieChart'
import TopSellingItems from './components/TopSellingItems'
import { DashboardProvider } from '../contexts/DashboardContext'


function Dashboard() {
    return (
      <div>
        <DashboardContentSumary />
        <br />
        <div className="gridSection">
          <TopSellingItems />
          <SalePieChart />
        </div>
        <br />
        <SalePerformance />
      </div>
    );
}

export default () => {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
};
