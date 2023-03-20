import React from 'react'

interface AuthLayoutProps {
    title?: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title = "Entrar", children }) => {
    return (
        <div className="authLayout">
            <div className="authContent">
                <div className="headerContent">
                    <h3>{title}</h3>
                    <div className="brand">
                        INVENTÁRIO
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}


export default AuthLayout