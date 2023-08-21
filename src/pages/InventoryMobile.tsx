import { Button, Table, Modal, Popconfirm } from "antd";
import Searchbar from "./components/Searchbar";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import InventoryMobileForm from "./components/InventoryMobileForm";
import { store } from "../store";
import moment from "moment";
import Axios from "axios";
import {
  errorHandler,
  NotificationTypes,
  openNotificationWithIcon,
} from "../utils/functions";
import { INVENTORY_MOBILE_URL } from "../utils/myPaths";
import InventoryFormExcel from "./components/InventoryFormExcel";

const columns = [
  {
    title: "Patrimônio",
    dataIndex: "patrimonio",
  },
  {
    title: "Marca",
    dataIndex: "marca",
  },
  {
    title: "Modelo",
    dataIndex: "modelo",
  },
  {
    title: "Usuário",
    dataIndex: "usuario",
  },
  {
    title: "Colaborador",
    dataIndex: "colaborador",
  },
  {
    title: "IMEI",
    dataIndex: "imei",
  },
  {
    title: "NF",
    dataIndex: "nf",
  },
  {
    title: "Linha",
    dataIndex: "linha",
  },
  {
    title: "OBS",
    dataIndex: "obs",
  },
  {
    title: "Motivo",
    dataIndex: "motivo_depreciado",
  },
  {
    title: "Adicionado em",
    dataIndex: "addedOn",
  },
  /* {
    title: "Added by",
    dataIndex: "addedBy",
  }, */
  {
    title: "Ações",
    dataIndex: "actions",
  },
];

export default function Inventory({
  invoiceSection = false,
  noAuth = false,
  onAddItem,
  formAction,
}: {
  invoiceSection?: boolean;
  noAuth?: boolean;
  onAddItem?: (item: any) => void;
  formAction?: any;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inventory, setInventory]: any = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [isSingleAdd, setIsSingleAdd] = useState(true);
  const [activeItem, setActiveItem]: any = useState();

  const newColumns = noAuth
    ? columns.filter((item: any) => {
        if (
          item.dataIndex === "addedOn" ||
          item.dataIndex === "addedBy" ||
          item.dataIndex === "total" ||
          item.dataIndex === "itemGroup" ||
          item.dataIndex === "actions"
        )
          return false;
        return true;
      })
    : invoiceSection
    ? columns.filter((item: any) => {
        if (
          item.dataIndex === "addedOn" ||
          item.dataIndex === "addedBy" ||
          item.dataIndex === "total" ||
          item.dataIndex === "itemGroup"
        )
          return false;
        return true;
      })
    : columns;

  const {
    state: { userToken },
  } = useContext(store);

  const editItem = (item: any) => {
    setActiveItem(item);
    setIsModalVisible(true);
  };

  const onDelete = async (id: any) => {
    setFetching(true);
    const res: any = Axios.delete(
      INVENTORY_MOBILE_URL + `/${id}`,
      noAuth
        ? {}
        : {
            headers: { Authorization: userToken },
          }
    ).catch((e) => {
      openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e));
      setFetching(false);
    });
    if (res) {
      setTimeout(async () => {
        await getInventory();
        openNotificationWithIcon(
          NotificationTypes.SUCCESS,
          "Deletion successful!"
        );
      }, 1000);
    }
  };

  const getInventory = async () => {
    setFetching(true);

    const res = await Axios.get(
      INVENTORY_MOBILE_URL + `?page=${currentPage}&keyword=${search}`,
      { headers: { Authorization: userToken } }
    ).catch((e) =>
      console.log(e) 
    );
    if (res) {
      setTotalCount(res.data.count);
      const data = res.data.results.map((item: any, i: number) => ({
        key: i,
        patrimonio: item.patrimonio,
        marca: item.marca,
        modelo: item.modelo,
        usuario: item.usuario,
        colaborador: item.colaborador?.name,
        imei: item.imei,
        nf: item.nf,
        linha: item.linha,
        obs: item.obs,
        motivo_depreciado: item.motivo_depreciado,
        addedOn: moment(item.created_at).format("DD-MM-YYYY"),
        actions: noAuth ? null : invoiceSection ? (
          formAction ? (
            formAction(item, item.remaining)
          ) : (
            <Button
              style={{
                backgroundColor: "rgba(140,255,179,29%)",
                borderColor: "rgba(140,255,179,29%)",
                color: "#269962",
              }}
              className="flex align-center"
              onClick={() => onAddItem && onAddItem(item)}
            >
              <PlusOutlined />
              <div className="spacer-5"></div>
              Add
            </Button>
          )
        ) : (
          <>
            <div className="flex align-center">
              <EditOutlined
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => editItem(item)}
              />
              <div className="spacer-10"></div>
              <Popconfirm
                title="Are you sure to delete item?"
                onConfirm={() => onDelete(item.id)}
              >
                <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
              </Popconfirm>
            </div>
          </>
        ),
      }));
      setInventory([...data]);
    }

    setFetching(false);
  };

  useEffect(() => {
    getInventory();
  }, [currentPage, search]);

  const showModal = (isSingleMode: boolean) => {
    setIsSingleAdd(isSingleMode);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setActiveItem(null);
    getInventory();
  };

  return (
    <>
      <div className="cardMain" style={{ width: "calc(100vw - 250px)" }}>
        <div className="headerContent">
          <h3>Gestão de Inventário Mobile</h3>
          <div className="flex align-center">
            <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
            {!invoiceSection && !noAuth && (
              <>
                <div className="spacer-10" />
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "rgba(24,144,255,19%)",
                    color: "#1890FF",
                    borderColor: "transparent",
                  }}
                  onClick={() => showModal(true)}
                >
                  Add Item
                </Button>
                <div className="spacer-10" />
                <Button type="primary" onClick={() => showModal(false)}>
                  Exportar (CSV)
                </Button>
              </>
            )}
          </div>
        </div>
        <Table
          dataSource={inventory}
          columns={newColumns}
          loading={fetching}
          pagination={{
            total: totalCount,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
      <Modal
        title={isSingleAdd ? "Add item Mobile" : "Exportar items Mobile"}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={false}
      >
        {isSingleAdd ? (
          <InventoryMobileForm onAddComplete={closeModal} activeItem={activeItem} />
        ) : (
          <InventoryFormExcel onAddComplete={closeModal} />
        )}
      </Modal>
    </>
  );
}
