import React, { useContext, useEffect, useState } from 'react'
import { store } from '../../store'
import { PURCHASE_SUMMARY_URL } from '../../utils/myPaths'
import DateSelector from './DateSelector'
import Axios from "axios"
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions'
import Loader from './Loader'

export default function PurchaseSummary() {
    const [summary, setSummary]: any = useState({})
    const [fetching, setFetching] = useState(true)
    const { state: { userToken } } = useContext(store)

    const getSummary = async () => {
        const res = await Axios.get(PURCHASE_SUMMARY_URL, { headers: { Authorization: userToken } }).catch(
            e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        )
        if (res) {
            setSummary(res.data)
            console.log(res.data)
            setFetching(false)
        }
    }

    useEffect(() => {
        getSummary()
    }, [])
    return (
        <div className="cardMain">
            <div className="headerContent">
                <h3>Purchases</h3>
                <DateSelector />
            </div>
            {
                fetching ? <Loader /> : <>
                    <div className="purchaseItem">
                        <div className="count">
                            <small>NGN </small>
                            <span>{summary.price}</span>
                        </div>
                        <div className="info">(Price)</div>
                    </div>
                    <div className="purchaseItem">
                        <div className="count">
                            <span>{summary.price}</span>
                        </div>
                        <div className="info">(Count)</div>
                    </div>
                </>
            }
        </div>
    )
}
