import React,{Component} from 'react'
import '../Style/driveover.css'
import axios from 'axios'

class Driveover extends Component{
    constructor(props,context){
        super(...arguments)
        this.state={
            total:3.5,
            overTime:'',
            totalTime:'',
            carCode:''
        }
        this.entertraveList=()=>{
            this.context.router.history.push('/travelList')
        }
    }
    componentDidMount(){
        axios({
            url:'fasdfa',
            method:'post',
            // data:{id:this.props.location.query.orderID}
        }).then((res)=>{
            this.setState({total:res,overTime:res,carCode:res,totalTime:res})
        })
    }
    render(){
        return(
            <div className="driveover">
                <h2>本次支付{this.state.total.toFixed(2)}元</h2>
                <p>结束时间：{this.state.overTime}&nbsp;&nbsp;&nbsp;总共用时：{this.state.totalTime}分钟</p>
                <span>车辆编号：{this.state.carCode}</span>
                <span className="driveDetail" onClick={this.entertraveList}>查看行程</span>

            </div>
        )
    }
}

Driveover.contextTypes={
    router:React.PropTypes.object
}

export default Driveover