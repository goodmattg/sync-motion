import React from 'react';

const Layout = ({ children }) => {
    return (
        <>
            <div>
                <ToolBar />
                <Sides />
                <Backdrop />
            </div>
            <main>{children}</main>
        </>
    )
}

export default Layout;