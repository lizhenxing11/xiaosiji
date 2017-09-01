import React,{Component} from 'react'
import '../Style/personCenter.css'
import axios from 'axios'
import Bg from '../img/personCenterBg.png'

class PersonCenter extends Component{
    constructor(props,context){
        super(...arguments);
        this.state={

        }
        this.enterMarch=()=>{
            this.context.router.history.push('./login')
        }
    }
    componentWillMount(){
        // axios({
        //     method:'get',
        //     url:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa70554b5f2348936&secret=75b941805a0a57c2d57d0a6e10d05713'
        // }).then((res)=>{
        //     console.log(res.data)
        // })
    }
    render() {
        var CenterBg = {backgroundImage:`url(${Bg})`}
        return(
            <div className="personCenter">
                <div className="centerTop" style={CenterBg}>
                    <img src='http://img0.imgtn.bdimg.com/it/u=602288768,1056696022&fm=26&gp=0.jpg' alt=""/>
                    <span className="userName">用户昵称</span>
                </div>
                <ol>
                    <li onClick={this.enterMarch}>
                        <span>我的行程</span>
                        <i className="iconfont icon-xiayibu"></i>
                    </li>
                    <li>
                        <span>手机号</span>
                        <span>13273395992</span>
                    </li>
                    <li>
                        <span>微信昵称</span>
                        <span>童享科技</span>
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