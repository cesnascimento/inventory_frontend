import React, { useContext, useEffect, useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Axios from "axios"
import { redirectToLogin } from "../utils/functions"
import { useHistory } from "react-router-dom";
import { ME_URL } from "../utils/myPaths";
import { Spin } from "antd";
import { ActionTypes, store } from "../store";
import Modal from "antd/lib/modal/Modal";
import ShopFormSelect from "../pages/components/shopFormSelect";

export const USERTOKEN = "invt-toun-user";
export const USERIDUPDATE = "invt-toun-user-id-update";

const MainLayout: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {
    state: { shop },
    dispatch,
  } = useContext(store);
  const [hideSideBar, setHideSideBar] = useState(false);
  const history = useHistory();

  useEffect(() => {
    checkIsAuthenticated();
  }, []);

  const checkIsAuthenticated = async () => {
    const userToken = localStorage.getItem(USERTOKEN);
    if (!userToken) {
      redirectToLogin(history);
      return;
    }
    const userInfo: any = await Axios.get(ME_URL, {
      headers: { Authorization: `Bearer ${userToken}` },
    }).catch((error: any) => {
      redirectToLogin(history);
    });

    if (userInfo) {
      dispatch({ type: ActionTypes.UPDATE_USER_DATA, payload: userInfo.data });
      dispatch({
        type: ActionTypes.UPDATE_USER_TOKEN,
        payload: `Bearer ${userToken}`,
      });
      if (userInfo.data.role === "sale") {
        setShowModal(true);
        setHideSideBar(true);
        history.push("/invoice-section");
      } else if (userInfo.data.role === "creator") {
        history.push("/inventory");
      } else {
        setHideSideBar(false);
      }

      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) return <Spin size="large" />;

  const onShopSelect = ({ shop }: any) => {
    dispatch({ type: ActionTypes.UPDATE_APP_SHOP, payload: shop });
    setShowModal(false);
  };

  return (
    <div className={`mainLayout ${hideSideBar ? "hideSideBar" : ""}`}>
      <Header />
      <Sidebar />
      <div className="contentMain">{children}</div>
      <Modal
        title={"Choose shop to sell from"}
        visible={showModal}
        footer={false}
        closable={false}
      >
        <ShopFormSelect onAddComplete={onShopSelect} />
      </Modal>
    </div>
  );
};

export default MainLayout