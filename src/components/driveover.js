import React,{Component} from 'react'
import '../Style/driveover.css'

class Driveover extends Component{
    constructor(props,context){
        super(...arguments)
        this.state={
            total:this.props.location.query.total,
            overTime:'2017-09-01 09:20',
            totalTime:13,
            carCode:2313212303586565
        }
    }
    render(){
        return(
            <div className="driveover">
                <h2>本次支付{this.state.total.toFixed(2)}元</h2>
                <p>结束时间：{this.state.overTime}&nbsp;&nbsp;&nbsp;总共用时：{this.state.totalTime}分钟</p>
                <span>车辆编号：{this.state.carCode}</span>
                <span className="driveDetail">查看行程</span>

            </div>
        )
    }
}

Driveover.contextTypes={
    router:React.PropTypes.object
}

export default Driveover