import {
  NotificationTypes,
  errorHandler,
  openNotificationWithIcon,
} from "../utils/functions";
import { useContext, useEffect, useState } from "react";

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
    title: "Inventario",
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
  /* {
    title: "Observação",
    dataIndex: "motivo",
  }, */
  {
    title: "Criado em",
    dataIndex: "createdOn",
  },
];

export default function InventoryActivity() {
  const [activities, setActivities]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const {
    state: { userToken },
  } = useContext(store);


  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date:any) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date:any) => {
    setEndDate(date);
  };

  const getActivities = async () => {
    setFetching(true);

    const formattedStartDate = startDate ? moment(startDate).format("DD/MM/YYYY") : "";
    const formattedEndDate = endDate ? moment(endDate).format("DD/MM/YYYY") : "";

    const res = await Axios.get(INVENTORY_LOG_URL + `?page=${currentPage}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`, {
      headers: { Authorization: userToken },
    }).catch((e) => {
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e));
    });

    /* const formattedSearchDate = moment(search, "DD/MM/YYYY", true);
    let formattedDateForAPI = '';

    if (formattedSearchDate.isValid()) {
      formattedDateForAPI = formattedSearchDate.format("YYYY-MM-DD");
    } else {
      console.log("Data inválida");
    }

    const res = await Axios.get(INVENTORY_LOG_URL + `?page=${currentPage}&keyword=${encodeURIComponent(formattedDateForAPI)}`, {
      headers: { Authorization: userToken },
    }).catch((e) => {
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e));
    }); */

    if (res) {
      setTotalCount(res.data.count);
      console.log('AQUI O RES DA ATIVIDADE', res.data.results)
      setActivities(
        res.data.results.map((item: any, i: number) => ({
          key: i,
          user: item.fullname,
          inventario: item.inventario,
          patrimonio: item.patrimonio,
          local: `${item.local} ⇀ ${item.local_novo}`,
          colaborador: `${item.colaborador} ⇀ ${item.colaborador_novo}`,
          createdOn: moment(item.created_at).format("DD-MM-YYYY"),
          /* createdOn: moment(item.created_at_formatted), */
        }))
      );
    }

    setFetching(false);
  };

  useEffect(() => {
    getActivities();
  }, [currentPage, startDate, endDate]);

  return (
    <>
      <div className="cardMain">
        <div className="headerContent">
          <h3>Atividades de Inventarios</h3>
          <DatePicker onChange={handleStartDateChange} />
          {/* Adicione o DatePicker para a data de fim */}
          <DatePicker onChange={handleEndDateChange} />
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
