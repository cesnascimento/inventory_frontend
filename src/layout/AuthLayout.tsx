import React from 'react'

interface AuthLayoutProps {
    title?: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title = "Sign In", children }) => {
    return (
        <div className="authLayout">
            <div className="authContent">
                <div className="headerContent">
                    <h3>{title}</h3>
                    <div className="brand">
                        INVENTORY
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}


export default AuthLayout