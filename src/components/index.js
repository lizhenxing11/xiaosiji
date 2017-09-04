import React,{Component} from 'react'
import ShowCard from './showCard'
import '../Style/index.css'
import Bg from '../img/Indexbg.jpg'
import { Popup } from 'antd-mobile';
import axios from 'axios'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
    // Note: the popup content will not scroll.
    maskProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class Index extends Component{
    constructor(props,context){
        super(...arguments)
        this.state = {
            ID:'',
            modal1:false,
            show:'block',
            sel:'',
            price:3,
            cardCode:' '
        }
        this.show = () =>{
            this.setState({show:'none'})
        }
        this.handleChange =(event)=>{
            //双向绑定数据
            event.target.value=event.target.value.replace(/\D/g,'')
            this.setState({cardCode:event.target.value})

        }
        this.cao=()=>{
            console.log(this.state.cardCode)
        }
        this.enterPersonCenter=()=>{
            this.context.router.history.push('/PersonCenter')
        }
        this.unlocking=()=>{
            let self = this
            window.wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    self.context.router.history.push({
                        pathname:'/openCar',
                        query:{scanQRCode:res.resultStr}
                    }); // 当needResult 为 1 时，扫码返回的结果
                }
            });
        }

    }
    componentWillMount(){
        var str = window.location.href
        if(str.indexOf('=')!==-1){
            var id = str.substring(str.indexOf('=')+1)
            window.localStorage.setItem('id',id)
        }
        this.setState({ID:window.localStorage.id})
    }
    componentDidMount() {
        axios({
            method:'post',
            url:'/SmallCar/sign.action',
            params:{url:window.location.href.split('#')[0]}
        }).then((res)=>{
            localStorage.setItem('userID',res.data.ID)
            window.wx.config({
                appId: 'wxa70554b5f2348936', // 必填，公众号的唯一标识
                timestamp: Number(res.data.timestamp), // 必填，生成签名的时间戳
                nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                signature: res.data.signature,// 必填，签名，见附录1
                jsApiList: ['scanQRCode','chooseWXPay','chooseImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            window.wx.ready(()=>{})
        }).catch((err)=>{

        })
    }
    onClick = () => {
        Popup.show(<div className="openCarCode">
            <span className="price">计费说明: {this.state.price}元/分钟</span>
            <p>输入车牌号,获取解锁码</p>
            <input type="text" placeholder="输入车牌号" onInput={this.handleChange} />
            <span className="OpenCarCodeBtn" onClick={this.cao}>立即用车</span>
            <div className="other">
                <div className="sao">
                    <i className="iconfont icon-richscan_icon"></i>
                    <span>扫码解锁</span>
                </div>
                <div className="lighten">
                    <i className="iconfont icon-shoudiantongdianliang"></i>
                    <span>手电筒</span>
                </div>
            </div>
        </div>, { animationType: 'slide-up', maskProps, maskClosable: false ,maskClosable:true});
    };
    onClose = (sel) => {
        this.setState({ sel });
        Popup.hide();
    };
    render(){
        var IdnexBg = {backgroundImage:`url(${Bg})` }
        return (
            <div className="Index" style={IdnexBg}>
                <ShowCard show={this.show}></ShowCard>
                <div className="cover" style={{display:this.state.show}}></div>
                <div className="bottom">
                    <i className="iconfont icon-geren" onClick={this.enterPersonCenter}></i>
                    <span className="btn" onClick={this.unlocking}><i className="iconfont icon-richscan_icon"></i>  扫码开锁</span>
                    <i className="iconfont icon-tixing-copy"></i>
                </div>
            </div>

        )
    }

}


Index.contextTypes = {
    router: React.PropTypes.object
}

export default Index