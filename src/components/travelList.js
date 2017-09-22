import React,{Component} from 'react'
import '../Style/travelList.css'
import axios from 'axios'

class TravelList extends Component{
    constructor(props,context){
        super(...arguments)
        this.state={
            list:[]
        }
        this.enterIndex=()=>{
            this.context.router.history.push('/index')
        }
    }
    componentWillMount(){
        let self = this
        axios({
            url:'/SmallCar/finishOrder.action?id='+window.localStorage.id,
            method:'get'
        }).then((res)=>{
            self.setState({list:res.data})
        }).catch((err)=>{
            alert(err)
        })
    }
    componentDidMount(){

    }
    render(){
        return(
            <div className="TravelList">
                <div className="TravelListinner">
                    {
                        this.state.list.length > 0 ? this.state.list.map((value,index)=>{
                        return <div className="traveitem" key={index}>
                            <i className="iconfont icon-qiche"></i>
                            <div className="bottom">
                                <div className="top">
                                    <span>{new Date(Number(value.beginstamp)).Format('yyyy-MM-dd hh:mm:ss')}</span>
                                </div>
                                <span>车辆编号：{value.carCode}</span>
                                <div className="bottom">
                                    <span><i className="iconfont icon-qian"></i>花费：{value.amount === null?value.amount:0}元</span>
                                    <span><i className="iconfont icon-shijian"></i>时间：{Math.ceil((value.total)/1000/60)}分钟</span>
                                </div>
                            </div>
                            </div>
                    }) : <span className="null">
                            <p>没有行程</p>
                            <button onClick={this.enterIndex}>点我</button>开启新的行程
                        </span>
                    }
                </div>
            </div>
        )
    }
}

TravelList.contextTypes= {
    router:React.PropTypes.object
}

export default TravelList