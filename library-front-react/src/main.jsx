import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RouterApp from './router/index.jsx'
import { store } from './store/index.js'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterApp />
  </Provider>
)
