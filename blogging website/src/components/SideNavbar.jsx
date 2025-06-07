import React from 'react'
import { Outlet } from 'react-router-dom'

const SideNavbar = () => {
    return (
        <>
            <h1>This is a side bar</h1>
            <Outlet />
        </>
    )
}

export default SideNavbar