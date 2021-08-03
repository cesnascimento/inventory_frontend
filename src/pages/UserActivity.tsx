import { Table } from "antd";
import { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { store } from "../store";
import { USER_LOG_URL } from "../utils/myPaths";
import {
  errorHandler,
  NotificationTypes,
  openNotificationWithIcon,
} from "../utils/functions";
import moment from "moment";

const columns = [
  {
    title: "User",
    dataIndex: "user",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
  {
    title: "Created On",
    dataIndex: "createdOn",
  },
];

export default function UserActivity() {
  const [activities, setActivities]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const {
    state: { userToken },
  } = useContext(store);

  const getActivities = async () => {
    setFetching(true);

    const res = await Axios.get(USER_LOG_URL + `?page=${currentPage}`, {
      headers: { Authorization: userToken },
    }).catch((e) => {
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e));
    });

    if (res) {
      setTotalCount(res.data.count);
      console.log(res.data);
      setActivities(
        res.data.results.map((item: any, i: number) => ({
          key: i,
          user: item.fullname,
          action: item.action,
          createdOn: moment(item.created_at).format("DD-MM-YYYY --- h:mm a"),
        }))
      );
    }

    setFetching(false);
  };

  useEffect(() => {
    getActivities();
  }, [currentPage]);

  return (
    <>
      <div className="cardMain">
        <div className="headerContent">
          <h3>User Activities</h3>
        </div>

        <Table
          dataSource={activities}
          columns={columns}
          loading={fetching}
          pagination={{
            total: totalCount,
            pageSize: 20,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
    </>
  );
}
