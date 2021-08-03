import React from 'react'
import { useContext } from "react";
import { useState } from "react";
import { store } from "../../store";
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
import PurchaseSummary from "./PurchaseSummary";

export default function SalePieChart() {
  const [saleChart, setSaleChart]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  const {
    state: { userToken },
  } = useContext(store);

  const getTopSellingData = async () => {
    const res = await Axios.get(SALE_BY_SHOP_URL, {
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

  const allZero = (() => {
    let allZero = true;
    for (const item of saleChart) {
      if (item.amount_total) {
        allZero = false;
        break;
      }
    }
    return allZero;
  })();
  return (
    <div>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Sale By Shop</h3>
        </div>
        <Chart
          width={"500px"}
          height={"300px"}
          chartType="PieChart"
          loader={fetching ? <Loader /> : <></>}
          data={[
            ["Task", "Hours per Day"],
            ...saleChart.map((item: any) => [
              item.name,
              allZero ? 1 : item.amount_total || 0,
            ]),
          ]}
        />
      </div>
      <br />
      <PurchaseSummary />
    </div>
  );
}
