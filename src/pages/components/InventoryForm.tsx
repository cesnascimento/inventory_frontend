import { useContext, useEffect, useRef, useState } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import Axios from "axios";
import { store } from "../../store";
import { INVENTORY_URL } from "../../utils/myPaths";
import {
    errorHandler,
    getAppGroups,
    getAppColab,
    NotificationTypes,
    openNotificationWithIcon,
} from "../../utils/functions";

const { Option } = Select;

export default function InventoryForm({
    onAddComplete,
    activeItem,
}: {
    onAddComplete: () => void;
    activeItem: any;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const {
        state: { userToken, groups },
    } = useContext(store);
    const [selectedImage, setSelectedImage]: any = useState(null);
    const [imageContent, setImageContent]: any = useState("");
    const [form] = Form.useForm();
    const imageUpload: any = useRef();
    const [groupItem, setGroupItem] = useState([]);

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
        let url = INVENTORY_URL
        if (activeItem) {
            url = INVENTORY_URL + `/${activeItem.id}`
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
        const res = await getAppColab(userToken);
        if (res) {
            setGroupItem(res.data.results);
            console.log(res.data.results)
        }
    };

    useEffect(() => {
        if (groups) {
            setGroupItem(groups);
        } else {
            getGroups();
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
        if (activeItem && groupItem.length > 0) {
            form.setFieldsValue({ ...activeItem, group_id: activeItem.group?.id })
            setImageContent(activeItem.photo)
        }
    }, [activeItem, groupItem])

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
                    label="Grupo/Categoria"
                    rules={[{ required: true, message: "Please select category" }]}
                    name="group_id"
                >
                    <Select placeholder="Select item category" allowClear>
                        {groupItem.map((item: any, i: number) => (
                            <Option key={i} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Colaborador"
                    rules={[{ required: true, message: "Please select category" }]}
                    name="colab_id"
                >
                    <Select placeholder="Select item category" allowClear>
                        {groupItem.map((item: any, i: number) => (
                            <Option key={i} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* <Form.Item
                    label="Nome do Item"
                    name="name"
                    rules={[{ required: true, message: "Please input item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>
                {!activeItem && (
                    <Form.Item
                        label="Total de Item Disponível"
                        name="total"
                        rules={[
                            {
                                required: true,
                                message: "Please input total items available count",
                            },
                        ]}
                    >
                        <Input placeholder="Enter item total available" />
                    </Form.Item>
                )}
                <Form.Item
                    label="Grupo/Categoria"
                    rules={[{ required: true, message: "Please select category" }]}
                    name="group_id"
                >
                    <Select placeholder="Select item category" allowClear>
                        {groupItem.map((item: any, i: number) => (
                            <Option key={i} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Preço do Item"
                    name="price"
                    rules={[{ required: true, message: "Please input item price" }]}
                >
                    <Input placeholder="Enter item price" type="number" />
                </Form.Item> */}
                <Button block type="primary" htmlType="submit" loading={isLoading}>
                    {activeItem ? "Update" : "Submit"}
                </Button>
            </Form>
        </div>
    );
}
