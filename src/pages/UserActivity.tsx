import {
  NotificationTypes,
  errorHandler,
  openNotificationWithIcon,
} from "../utils/functions";
import { useContext, useEffect, useState } from "react";

import Axios from "axios";
import { Table } from "antd";
import { USER_LOG_URL } from "../utils/myPaths";
import moment from "moment";
import { store } from "../store";

const columns = [
  {
    title: "Usuario",
    dataIndex: "user",
  },
  {
    title: "Ação",
    dataIndex: "action",
  },
  {
    title: "Criado em",
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
          <h3>Atividades de Usuários</h3>
        </div>

        <Table
          dataSource={activities}
          columns={columns}
          loading={fetching}
          pagination={{
            total: totalCount,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
    </>
  );
}
