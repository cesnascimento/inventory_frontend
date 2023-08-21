import { Button, Table, Modal, Popconfirm } from "antd";
import Searchbar from "./components/Searchbar";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import InventoryDatacenterForm from "./components/InventoryDatacenterForm";
import { store } from "../store";
import moment from "moment";
import Axios from "axios";
import {
  errorHandler,
  NotificationTypes,
  openNotificationWithIcon,
} from "../utils/functions";
import { INVENTORY_DATACENTER_URL, INVENTORY_MOBILE_URL, INVENTORY_NOTEBOOK_URL, INVENTORY_URL } from "../utils/myPaths";
import InventoryFormExcel from "./components/InventoryFormExcel";
import InventoryMobileForm from "./components/InventoryMobileForm";
import InventoryNotebookForm from "./components/InventoryNotebookForm";
import InventoryForm from "./components/InventoryForm";

const columns = [
  {
    title: "Patrimônio/IMEI/IP",
    dataIndex: "patrimonio",
  },
  /* {
    title: "Descricao",
    dataIndex: "descricao",
  },
  {
    title: "HostName",
    dataIndex: "hostname",
  }, */
  {
    title: "Local",
    dataIndex: "local",
  },
  {
    title: "Colaborador",
    dataIndex: "colaborador",
  },
  /* {
    title: "Sistema Operacional",
    dataIndex: "sistema_operacional",
  },
  {
    title: "Service Tag",
    dataIndex: "service_tag",
  },
  {
    title: "NF",
    dataIndex: "nf_so",
  },
  {
    title: "Empresa",
    dataIndex: "empresa",
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
    title: "Configuração",
    dataIndex: "configuracao",
  }, */
  {
    title: "Motivo",
    dataIndex: "motivo_depreciado",
  },
  {
    title: "Adicionado em",
    dataIndex: "addedOn",
  },
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
  const [inventoryMobile, setInventoryMobile]: any = useState([]);
  const [inventoryDesktop, setInventoryDesktop]: any = useState([]);
  const [inventoryNotebok, setInventoryNotebook]: any = useState([]);
  const [inventoryDataCenter, setInventoryDataCenter]: any = useState([]);
  const [activeItemType, setActiveItemType] = useState<string | null>(null);
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

  const editItem = (item: any, type: string) => {
    setActiveItem(item);
    setActiveItemType(type);
    setIsModalVisible(true);
  };


  const onDeleteDataCenter = async (id: any) => {
    setFetching(true);
    const res: any = Axios.delete(
      INVENTORY_DATACENTER_URL + `/${id}`,
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
        await getInventoryDataCenter();
        openNotificationWithIcon(
          NotificationTypes.SUCCESS,
          "Deletion successful!"
        );
      }, 1000);
    }
  };
  const onDeleteMobile = async (id: any) => {
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
        await getInventoryDataCenter();
        openNotificationWithIcon(
          NotificationTypes.SUCCESS,
          "Deletion successful!"
        );
      }, 1000);
    }
  };
  const onDeleteNotebook = async (id: any) => {
    setFetching(true);
    const res: any = Axios.delete(
      INVENTORY_NOTEBOOK_URL + `/${id}`,
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
        await getInventoryDataCenter();
        openNotificationWithIcon(
          NotificationTypes.SUCCESS,
          "Deletion successful!"
        );
      }, 1000);
    }
  };
  const onDeleteDesktop = async (id: any) => {
    setFetching(true);
    const res: any = Axios.delete(
      INVENTORY_URL + `/${id}`,
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
        await getInventoryDataCenter();
        openNotificationWithIcon(
          NotificationTypes.SUCCESS,
          "Deletion successful!"
        );
      }, 1000);
    }
  };

  const getInventoryMobile = async () => {
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
        patrimonio: item.imei,
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
                onClick={() => editItem(item, "Mobile")}
              />
              <div className="spacer-10"></div>
              <Popconfirm
                title="Are you sure to delete item?"
                onConfirm={() => onDeleteMobile(item.id)}
              >
                <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
              </Popconfirm>
            </div>
          </>
        ),
      }));
      const totalMobileFilter = data.filter((item: any) => item.colaborador === 'Depreciado');
      setInventoryMobile([...totalMobileFilter]);
    }
  }

  const getInventoryNotebook = async () => {
    setFetching(true);

    const res = await Axios.get(
      INVENTORY_NOTEBOOK_URL + `?page=${currentPage}&keyword=${search}`,
      { headers: { Authorization: userToken } }
    ).catch((e) =>
      console.log(e)
      /* openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e)) */
    );
    if (res) {
      setTotalCount(res.data.count);
      const data = res.data.results.map((item: any, i: number) => ({
        key: i,
        local: item.local?.name,
        patrimonio: item.patrimonio,
        hostname: item.hostname,
        usuario: item.usuario,
        colaborador: item.colaborador?.name,
        so: item.sistema_operacional,
        service_tag: item.service_tag,
        nf_so: item.nf_so,
        empresa: item.empresa,
        marca: item.marca,
        modelo: item.modelo,
        configuracao: item.configuracao,
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
                onClick={() => editItem(item, "Notebook")}
              />
              <div className="spacer-10"></div>
              <Popconfirm
                title="Are you sure to delete item?"
                onConfirm={() => onDeleteNotebook(item.id)}
              >
                <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
              </Popconfirm>
            </div>
          </>
        ),
      }));
      const totalNotebookFilter = data.filter((item: any) =>
        item.colaborador === 'Depreciado' && item.local === 'Depreciado'
      );
      setInventoryNotebook([...totalNotebookFilter]);
    }
  }

  const getInventoryDesktop = async () => {
    setFetching(true);

    const res = await Axios.get(
      INVENTORY_URL + `?page=${currentPage}&keyword=${search}`,
      { headers: { Authorization: userToken } }
    ).catch((e) =>
      console.log(e)
    );
    if (res) {
      setTotalCount(res.data.count);
      const data = res.data.results.map((item: any, i: number) => ({
        key: i,
        local: item.local?.name,
        patrimonio: item.patrimonio,
        hostname: item.hostname,
        usuario: item.usuario,
        colaborador: item.colaborador?.name,
        so: item.sistema_operacional,
        service_tag: item.service_tag,
        nf_so: item.nf_so,
        empresa: item.empresa,
        marca: item.marca,
        modelo: item.modelo,
        configuracao: item.configuracao,
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
                onClick={() => editItem(item, "Desktop")}
              />
              <div className="spacer-10"></div>
              <Popconfirm
                title="Are you sure to delete item?"
                onConfirm={() => onDeleteDesktop(item.id)}
              >
                <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
              </Popconfirm>
            </div>
          </>
        ),
      }));
      const totalDesktopFilter = data.filter((item: any) =>
        item.colaborador === 'Depreciado' && item.local === 'Depreciado'
      );
      setInventoryDesktop([...totalDesktopFilter]);
    }
  }

  const getInventoryDataCenter = async () => {
    setFetching(true);

    const res = await Axios.get(
      INVENTORY_DATACENTER_URL + `?page=${currentPage}&keyword=${search}`,
      { headers: { Authorization: userToken } }
    ).catch((e) =>
      console.log(e)
    );
    if (res) {
      setTotalCount(res.data.count);
      const data = res.data.results.map((item: any, i: number) => ({
        key: i,
        patrimonio: item.ip,
        descricao: item.descricao,
        hostname: item.hostname,
        usuario: item.usuario,
        colaborador: item.colaborador?.name,
        sistema_operacional: item.sistema_operacional,
        service_tag: item.service_tag,
        nf_so: item.nf_so,
        empresa: item.empresa,
        marca: item.marca,
        modelo: item.modelo,
        configuracao: item.configuracao,
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
                onClick={() => editItem(item, "DataCenter")}
              />
              <div className="spacer-10"></div>
              <Popconfirm
                title="Are you sure to delete item?"
                onConfirm={() => onDeleteDataCenter(item.id)}
              >
                <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
              </Popconfirm>
            </div>
          </>
        ),
      }));

      const totalDataCenterFilter = data.filter((item: any) => item.colaborador === 'Depreciado');
      setInventoryDataCenter([...totalDataCenterFilter]);
    }



    setFetching(false);
  }

  useEffect(() => {
    getInventoryDataCenter();
  }, [currentPage, search]);
  useEffect(() => {
    getInventoryMobile();
  }, [currentPage, search]);
  useEffect(() => {
    getInventoryNotebook();
  }, [currentPage, search]);
  useEffect(() => {
    getInventoryDesktop();
  }, [currentPage, search]);

  const showModal = (isSingleMode: boolean) => {
    setIsSingleAdd(isSingleMode);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setActiveItem(null);
    getInventoryDataCenter();
    getInventoryDesktop();
    getInventoryMobile();
    getInventoryNotebook();
  };

  return (
    <>
      <div className="cardMain" style={{ width: "calc(100vw - 250px)" }}>
        <div className="headerContent">
          <h3>Gestão de Inventário Depreciado</h3>
          <div className="flex align-center">
            <Searchbar style={{ minWidth: "250px" }} onSearch={setSearch} />
            {!invoiceSection && !noAuth && (
              <>
                <div className="spacer-10" />
                {/* <Button
                  type="primary"
                  style={{
                    backgroundColor: "rgba(24,144,255,19%)",
                    color: "#1890FF",
                    borderColor: "transparent",
                  }}
                  onClick={() => showModal(true)}
                >
                  Add Item
                </Button> */}
                <div className="spacer-10" />
                <Button type="primary" onClick={() => showModal(false)}>
                  Exportar (CSV)
                </Button>
              </>
            )}
          </div>
        </div>
        <Table
          dataSource={[...inventoryMobile, ...inventoryDataCenter, ...inventoryNotebok, ...inventoryDesktop]}
          columns={newColumns}
          loading={fetching}
          pagination={{
            total: totalCount,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
      <Modal
        title={isSingleAdd ? "Add item" : "Import your items"}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={false}
      >
        {isSingleAdd ? (
          activeItemType === "Mobile" ? <InventoryMobileForm onAddComplete={closeModal} activeItem={activeItem} /> :
            activeItemType === "Notebook" ? <InventoryNotebookForm onAddComplete={closeModal} activeItem={activeItem} /> :
              activeItemType === "Desktop" ? <InventoryForm onAddComplete={closeModal} activeItem={activeItem} /> :
                activeItemType === "DataCenter" ? <InventoryDatacenterForm onAddComplete={closeModal} activeItem={activeItem} /> :
                  null
        ) : (
          <InventoryFormExcel onAddComplete={closeModal} />
        )}
      </Modal>

    </>
  );
}
