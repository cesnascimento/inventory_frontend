import React, { useContext, useEffect, useState } from 'react'
import { store } from '../../store'
import DateSelector from './DateSelector'
import Axios from "axios"
import { TOP_SELLING_URL } from '../../utils/myPaths'
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions'
import Loader from './Loader'

export default function TopSellingItems() {

    const [topSelling, setTopSelling]: any = useState([])
    const [fetching, setFetching] = useState(true)
    const { state: { userToken } } = useContext(store)
    const [dateInfo, setDateInfo]: any = useState("");

    const getTopSellingData = async () => {
      const res = await Axios.get(TOP_SELLING_URL + `${dateInfo}`, {
        headers: { Authorization: userToken },
      }).catch((e) =>
        openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
      );
      if (res) {
        setTopSelling(res.data);
        setFetching(false);
      }
    };

    useEffect(() => {
      getTopSellingData();
    }, [dateInfo]);

    const handleDateSelect = (val: any) => {
      if (val) {
        const [startMoment, endMoment] = val;
        setDateInfo(
          `?start_date=${startMoment.format(
            "YYYY-MM-DD"
          )}&end_date=${endMoment.format("YYYY-MM-DD")}`
        );
      } else {
        setDateInfo("");
      }
    };

    return (
      <div className="cardMain">
        <div className="headerContent">
          <h3>Top Item</h3>
          <DateSelector handleChange={handleDateSelect} />
        </div>
        {fetching ? (
          <Loader />
        ) : (
          <div className="itemsGrid">
            {topSelling.map((item: any, i: number) => (
              <ItemCard
                key={i}
                image={item.photo}
                title={item.name}
                count={item.sum_of_item || 0}
              />
            ))}
          </div>
        )}
      </div>
    );
}

const ItemCard = ({ image, title, count }: {
    image: string
    title: string,
    count: string
}) => {
    return (
        <div className="itemCard">
            <div className="imgCon" style={{ backgroundImage: `url('${image}')` }} />
            <div className="content">
                <div className="title">{title}</div>
                <div className="count">{count}</div>
            </div>
        </div>
    )
}