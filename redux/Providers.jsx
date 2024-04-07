'use client'
import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import { ToastContainer } from 'react-toastify'
import { Analytics } from "@vercel/analytics/react"
function Providers({ children }) {
    return (
        <Provider store={store}>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Analytics/>
            <div>{children}</div>
        </Provider>
    )
}

export default Providers