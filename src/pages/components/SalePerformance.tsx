import React from 'react'
import { useContext } from "react";
import { useState } from "react";
import { store } from "../../store";
import DateSelector from "./DateSelector";
import Axios from "axios";
import { SALE_BY_SHOP_URL } from "../../utils/myPaths";
import {
  errorHandler,
  NotificationTypes,
  openNotificationWithIcon,
} from "../../utils/functions";
import { useEffect } from "react";
import Chart from "react-google-charts";
import Loader from "./Loader";
import moment from "moment";

export default function SalePerformance() {
  const [saleChart, setSaleChart]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  const {
    state: { userToken },
  } = useContext(store);

  const getTopSellingData = async () => {
    const res = await Axios.get(SALE_BY_SHOP_URL + `?monthly=true`, {
      headers: { Authorization: userToken },
    }).catch((e) =>
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
    );
    if (res) {
      setSaleChart(res.data);
      setFetching(false);
    }
  };

  useEffect(() => {
    getTopSellingData();
  }, []);

  const getMonthlyData = () => {
    const months: any = [];
    for (const item of saleChart) {
      if (!months.includes(item.month)) {
        months.push(item.month);
      }
    }
    const totalData = [];
    for (const month of months) {
      const individualData = [moment(new Date(month)).format("MMM")];
      for (const item of saleChart) {
        if (item.month === month) {
          individualData.push(item.amount_total || "0");
        } else {
          individualData.push("0");
        }
      }
      totalData.push(individualData);
    }
    return totalData;
  };

  return (
    <div>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Item por loja</h3>
          <DateSelector picker="month" />
        </div>
        <Chart
          className="chartSvg"
          chartType="Bar"
          loader={fetching ? <Loader /> : <></>}
          data={[
            ["Month", ...saleChart.map((item: any) => item.name)],
            ...getMonthlyData(),
          ]}
        />
      </div>
    </div>
  );
}
