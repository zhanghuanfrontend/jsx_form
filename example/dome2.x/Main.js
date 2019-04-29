import React from 'react'
// import TestBase from './TestBase'
// import Base from './Base'
import Dynamic from './Dynamic'

export default class Main extends React.Component {
    render() {
        const formData = {
            param: {
                name: ''
            }
        }
        return <>
            {/* <TestBase /> */}
            {/* <Base /> */}
            <Dynamic />
        </>
    }
}