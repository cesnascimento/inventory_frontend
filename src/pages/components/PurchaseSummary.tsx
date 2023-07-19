import React, { useContext, useEffect, useState } from 'react'
import { store } from '../../store'
/* import { PURCHASE_SUMMARY_URL } from '../../utils/myPaths' */
import DateSelector from './DateSelector'
import Axios from "axios"
import {
  errorHandler,
  formatCurrency,
  NotificationTypes,
  openNotificationWithIcon,
} from "../../utils/functions";
import Loader from "./Loader";

export default function PurchaseSummary() {
  const [summary, setSummary]: any = useState({});
  const [fetching, setFetching] = useState(true);
  const {
    state: { userToken },
  } = useContext(store);

  /* const getSummary = async () => {
    const res = await Axios.get(PURCHASE_SUMMARY_URL, {
      headers: { Authorization: userToken },
    }).catch((e) =>
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
    );
    if (res) {
      setSummary(res.data);
      setFetching(false);
    }
  };
 */
  /* useEffect(() => {
    getSummary();
  }, []); */
  return (
    <div className="cardMain">
      <div className="headerContent">
        <h3>Compras de item</h3>
        <DateSelector />
      </div>
      {fetching ? (
        <Loader />
      ) : (
        <>
          <div className="purchaseItem">
            <div className="count">
              <span>{formatCurrency(summary.price || 0)}</span>
            </div>
            <div className="info">(Preço)</div>
          </div>
          <div className="purchaseItem">
            <div className="count">
              <span>{summary.count}</span>
            </div>
            <div className="info">(Quantidade)</div>
          </div>
        </>
      )}
    </div>
  );
}
