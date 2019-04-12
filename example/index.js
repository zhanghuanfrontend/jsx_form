import React from 'react'
import ReactDOM from 'react-dom'
import Main from './Main'
import { AppContainer } from 'react-hot-loader';
import "antd/dist/antd.less";
import './index.less'

ReactDOM.render(
    <AppContainer>
        <Main />
    </AppContainer>,
    document.getElementById('app')
)