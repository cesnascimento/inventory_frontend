import {
  NotificationTypes,
  errorHandler,
  openNotificationWithIcon,
} from "../utils/functions";
import { useContext, useEffect, useState } from "react";
import DateSelector from './components/DateSelector'
import Axios from "axios";
import { Table, DatePicker } from "antd";
import { INVENTORY_LOG_URL } from "../utils/myPaths";
import moment from "moment";
import { store } from "../store";
import Searchbar from "./components/Searchbar";


const columns = [
  {
    title: "Usuário",
    dataIndex: "user",
  },
  {
    title: "Inventário",
    dataIndex: "inventario",
  },
  {
    title: "Patrimonio/IMEI/IP",
    dataIndex: "patrimonio",
  },
  {
    title: "Local",
    dataIndex: "local",
  },
  {
    title: "Colaborador",
    dataIndex: "colaborador",
  },
  {
    title: "Motivo",
    dataIndex: "motivo_depreciado",
  },
  {
    title: "Criado em",
    dataIndex: "createdOn",
  },
];

export default function InventoryActivity() {
  const [activities, setActivities]: any = useState([]);
  const [topSelling, setTopSelling]: any = useState([])
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [dateInfo, setDateInfo]: any = useState("");
  const {
    state: { userToken },
  } = useContext(store);


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


  const getActivities = async () => {
    setFetching(true);
    const queryParams = dateInfo ? dateInfo : `?page=${currentPage}&keyword=${search}`;
    const res = await Axios.get(INVENTORY_LOG_URL + queryParams, {
      headers: { Authorization: userToken },
    }).catch((e) => {
      console.log(e);
    });


    if (res) {
      setTotalCount(res.data.count);
      setActivities(
        res.data.results.map((item: any, i: number) => ({
          key: i,
          user: item.fullname,
          inventario: item.inventario,
          patrimonio: item.patrimonio,
          local: `${item.local} ⇀ ${item.local_novo}`,
          colaborador: `${item.colaborador} ⇀ ${item.colaborador_novo}`,
          motivo_depreciado: item.motivo_depreciado,
          createdOn: moment(item.created_at).format("DD-MM-YYYY"),
          /* createdOn: moment(item.created_at_formatted), */
        }))
      );
    }

    setFetching(false);
  };

  useEffect(() => {
    getActivities();
  }, [currentPage, search]);

  useEffect(() => {
    getActivities();
  }, [dateInfo]);

  return (
    <>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Atividades de Inventarios</h3>
          <DateSelector handleChange={handleDateSelect} />
          <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
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
