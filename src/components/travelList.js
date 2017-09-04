import React,{Component} from 'react'
import '../Style/travelList.css'
import axios from 'axios'

class TravelList extends Component{
    constructor(props,context){
        super(...arguments)
        this.state={
            list:[{overTime:new Date(),carid:132123132132,totalPay:3.6,totalTime:14},{overTime:new Date(),carid:132123132132,totalPay:3.6,totalTime:14},{overTime:new Date(),carid:132123132132,totalPay:3.6,totalTime:14},{overTime:new Date(),carid:132123132132,totalPay:3.6,totalTime:14},{overTime:new Date(),carid:132123132132,totalPay:3.6,totalTime:14},]
        }
    }
    componentDidMount(){
        axios({
            url:'',
            method:'post',
            data:{id:this.props.location.query.orderID}
        }).then((res)=>{
            this.setState({total:res,overTime:res,carCode:res,totalTime:res})
        })
    }
    render(){
        return(
            <div className="TravelList">
                <div className="TravelListinner">
                    {this.state.list.map((value,index)=>{
                        return <div className="traveitem" key={index}>
                            <div className="top">
                                <i className="iconfont icon-qiche"></i>
                                <span>{value.overTime.Format('yyyy-MM-dd hh:mm:ss')}</span>
                            </div>
                            <span>车辆编号：{value.carid}</span>
                            <div className="bottom">
                                <span><i className="iconfont icon-qian"></i>花费：{value.totalPay}元</span>
                                <span><i className="iconfont icon-shijian"></i>时间：{value.totalTime}分钟</span>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}

export default TravelList