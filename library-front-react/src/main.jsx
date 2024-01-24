import ReactDOM from 'react-dom/client'
import './index.css'
import RouterApp from './router/index.jsx'
import { store } from './store/index.js'
import { Provider } from 'react-redux'
import { Watermark, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('en');

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN}>
    <Watermark content={['陈思羊']}>
      <Provider store={store}>
        <RouterApp />
      </Provider>
    </Watermark>
  </ConfigProvider>
)
