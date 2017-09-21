import React from 'react'
import { Route, HashRouter, Switch} from 'react-router-dom';
import login from '../components/login/login'
import Index from '../components/index'
import openCar from '../components/OpenCar'
import PersonCenter from '../components/personCenter'
import Drivering from '../components/drivering'
import Driveover from '../components/driveover'
import TraveList from '../components/travelList'
import Repair from '../components/repair'


class AppRouter extends React.Component{
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/login"  component={login}></Route>
                    <Route path="/index"  component={Index}></Route>
                    <Route path="/openCar"  component={openCar}></Route>
                    <Route path="/PersonCenter"  component={PersonCenter}></Route>
                    <Route path="/drivering"  component={Drivering}></Route>
                    <Route path="/driveover"  component={Driveover}></Route>
                    <Route path="/travelList"  component={TraveList}></Route>
                    <Route path="/repair"  component={Repair}></Route>
                </Switch>
            </HashRouter>
        )
    }
}

export default AppRouter