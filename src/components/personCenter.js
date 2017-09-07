import React,{Component} from 'react'
import '../Style/personCenter.css'
import axios from 'axios'
import Bg from '../img/personCenterBg.png'

class PersonCenter extends Component{
    constructor(props,context){
        super(...arguments);
        this.state={
            headImg:'',
            nickName:'',
            telNum:''
        }
        this.enterMarch=()=>{
            this.context.router.history.push('/travelList')
        }
    }
    componentWillMount(){
        axios({
            method:'get',
            url:'/SmallCar/mySelf.action?id='+window.localStorage.id
        }).then((res)=>{
            this.setState({headImg:res.data.map.headimgurl,nickName:res.data.map.nickname,telNum:res.data.map.phone})
        })
    }
    render() {
        var CenterBg = {backgroundImage:`url(${Bg})`}
        return(
            <div className="personCenter">
                <div className="centerTop" style={CenterBg}>
                    <img src={this.state.headImg} alt=""/>
                    <span className="userName">{this.state.nickName}</span>
                </div>
                <ol>
                    <li onClick={this.enterMarch}>
                        <span>我的行程</span>
                        <i className="iconfont icon-xiayibu"></i>
                    </li>
                    <li>
                        <span>手机号</span>
                        <span>{this.state.telNum}</span>
                    </li>
                    <li>
                        <span>微信昵称</span>
                        <span>{this.state.nickName}</span>
                    </li>
                </ol>

            </div>
        )
    }
}
PersonCenter.contextTypes= {
    router:React.PropTypes.object
}

export default PersonCenter