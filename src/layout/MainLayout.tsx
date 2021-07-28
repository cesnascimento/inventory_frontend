import React, { useContext, useEffect, useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Axios from "axios"
import { redirectToLogin } from "../utils/functions"
import { useHistory } from "react-router-dom"
import { ME_URL } from "../utils/myPaths"
import { Spin } from "antd"
import { ActionTypes, store } from "../store"

export const USERTOKEN = "invt-toun-user"
export const USERIDUPDATE = "invt-toun-user-id-update"

const MainLayout: React.FC = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const { dispatch } = useContext(store)
    const history = useHistory()

    useEffect(() => {
        checkIsAuthenticated()
    }, [])

    const checkIsAuthenticated = async () => {
        const userToken = localStorage.getItem(USERTOKEN)
        if (!userToken) {
            redirectToLogin(history)
            return
        }
        const userInfo: any = await Axios.get(ME_URL, { headers: { Authorization: `Bearer ${userToken}` } }).catch(
            (error: any) => {
                redirectToLogin(history)
            }
        )

        if (userInfo) {
            dispatch({ type: ActionTypes.UPDATE_USER_DATA, payload: userInfo.data })
            dispatch({ type: ActionTypes.UPDATE_USER_TOKEN, payload: `Bearer ${userToken}` })

            setIsAuthenticated(true)
        }

    }

    if (!isAuthenticated) return <Spin size="large" />

    return <div className="mainLayout">
        < Header />
        <Sidebar />
        <div className="contentMain">
            {children}
        </div>
    </div >
}

export default MainLayout