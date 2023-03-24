import { useContext, useEffect, useRef, useState } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, } from "antd";
import Axios from "axios";
import { store } from "../../store";
import { INVENTORY_DATACENTER_URL } from "../../utils/myPaths";
import {
    errorHandler,
    getAppGroups,
    getAppColab,
    NotificationTypes,
    openNotificationWithIcon,
} from "../../utils/functions";

const { Option } = Select;

const { TextArea } = Input;

export default function InventoryForm({
    onAddComplete,
    activeItem,
}: {
    onAddComplete: () => void;
    activeItem: any;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const {
        state: { userToken, groups, colaborador },
    } = useContext(store);
    const [selectedImage, setSelectedImage]: any = useState(null);
    const [imageContent, setImageContent]: any = useState("");
    const [form] = Form.useForm();
    const imageUpload: any = useRef();
    const [groupItem, setGroupItem] = useState([]);
    const [colabItem, setColabItem] = useState([]);

    const onFinish = async (values: any) => {
        setIsLoading(true);
        let formData;

        if (selectedImage) {
          formData = new FormData();
          for (let key in values) {
            formData.append(key, values[key]);
          }
          formData.append("photo", selectedImage);
        } else {
          formData = values;
        }
        let url = INVENTORY_DATACENTER_URL
        if (activeItem) {
            url = INVENTORY_DATACENTER_URL + `/${activeItem.id}`
        }
        const result = await Axios[activeItem ? "patch" : "post"](url, formData, {
            headers: { Authorization: userToken },
        }).catch((e) =>
            openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        );
        if (result) {
            openNotificationWithIcon(
                NotificationTypes.SUCCESS,
                `Item ${activeItem ? 'Added' : 'Updated'} Successfully`
            );
            form.resetFields();
            onAddComplete();
        }
        setIsLoading(false);
    };

    const getGroups = async () => {
        const res = await getAppGroups(userToken);
        if (res) {
            setGroupItem(res.data.results);
        }
    };

    const getColabs = async () => {
        const res = await getAppColab(userToken);
        if (res) {
            setColabItem(res.data.results);
        }
    };

    useEffect(() => {
        if (groups) {
            setGroupItem(groups);
        } else {
            getGroups();
        }
    }, []);
    
    useEffect(() => {
        if (colaborador) {
            setColabItem(colaborador);
        } else {
            getColabs();
        }
    }, []);

    const handleLogoClick = () => {
        imageUpload.current.value = null;
        imageUpload.current.click();
    };

    const handleImageSelect = (e: any) => {
        setSelectedImage(e.target.files[0]);
        readImage(e.target.files[0]);
    };

    const readImage = (selectedImage: any) => {
        var reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onloadend = function () {
            setImageContent(reader.result);
        };
    };

    useEffect(() => {
        if (activeItem && groupItem.length && colabItem.length > 0) {
            form.setFieldsValue({ ...activeItem, group_id: activeItem.group?.id })
            setImageContent(activeItem.photo)
        }
    }, [activeItem, groupItem, colabItem])

    return (
        <div>
            <input
                type="file"
                ref={imageUpload}
                accept="image/png, image/gif, image/jpeg"
                onChange={handleImageSelect}
                style={{ display: "none" }}
            />

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="flex align-center justify-center">
                    <div className="uploadContainer" onClick={handleLogoClick}>
                        {selectedImage ? (
                            <img src={imageContent} alt="" />
                        ) : (
                            <CameraOutlined />
                        )}
                    </div>
                </div>
                <Form.Item
                    label="IP"
                    name="ip"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Digite o patrimônio" />
                </Form.Item>
                <Form.Item
                    label="Descrição"
                    name="descricao"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Digite o patrimônio" />
                </Form.Item>
                <Form.Item
                    label="hostname"
                    name="hostname"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Colaborador"
                    rules={[{ required: true, message: "Please select category" }]}
                    name="colaborador_id"
                >
                    <Select placeholder="Selecione colaborador" allowClear>
                        {colabItem.map((item: any, i: number) => (
                            <Option key={i} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="S.O"
                    name="sistema_operacional"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Digite o sistema operacional" />
                </Form.Item>
                <Form.Item
                    label="Service Tag"
                    name="service_tag"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="NF S.O"
                    name="nf_so"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Empresa"
                    name="empresa"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Marca"
                    name="marca"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Modelo"
                    name="modelo"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                    label="Configuração"
                    name="configuracao"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <TextArea rows={4} placeholder="Enter item name" />
                </Form.Item>
                <Button block type="primary" htmlType="submit" loading={isLoading}>
                    {activeItem ? "Atualizar" : "Inserir"}
                </Button>
            </Form>
        </div>
    );
}
