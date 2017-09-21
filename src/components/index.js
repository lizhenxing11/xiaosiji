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
            price:0.35,
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
        this.inputunlocking=()=>{
            if(/^\d{6,11}$/.test(this.state.cardCode)){
                this.state.cardCode
                this.onClose('modal1')
                this.context.router.history.push({
                    pathname:'/openCar',
                    query:{cardCode:this.state.cardCode}
                });
            }else{
                alert('请输入正确的汽车编号')
            }

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
        this.closewindow=(event)=>{
            if (event.state) {
                //侦测是用户触发的后退操作, dosomething
                //这里刷新当前url
                window.wx.closeWindow();
            }
        }
        this.addtag=()=>{
            window.history.replaceState('hasHash', '', '');
        }
    }
    componentWillMount(){
        if(window.localStorage.id){
            this.setState({show:'none'})
        }
        var str = window.location.href
        if(str.indexOf('=')!==-1){
            var id = str.substring(str.indexOf('=')+1)
            window.localStorage.setItem('id',id)
            this.setState({show:'block'})
        }
        this.setState({ID:window.localStorage.id})

        //检查有没有未完成订单
        axios({
            url:'/SmallCar/notReturnOrPay.action?id='+window.localStorage.id,
            method:'get'
        }).then((res)=>{
            if(res.data.notreturn){
                this.context.router.history.push({
                    pathname:'/drivering',
                    query:{carid:res.data.notreturn.carid,beginstamp:res.data.notreturn.beginstamp,orderID:res.data.notreturn.id,status:1}
                })
            }
            if(res.data.sign){
                this.context.router.history.push({
                    pathname:'/drivering',
                    query:{timestamp:res.data.sign.timestamp,nonceStr:res.data.sign.noncestr,package:res.data.sign.package1,paySign:res.data.sign.paysign,orderID:res.data.sign.orderid,status:2,orderPay:res.data.amount}
                })
            }
        })
    }
    componentDidMount() {
        axios({
            method:'post',
            url:'/SmallCar/sign.action',
            params:{url:window.location.href.split('#')[0]}
        }).then((res)=>{
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
    onClick = () => {//输入车牌号解锁
        Popup.show(<div className="openCarCode">
            <span className="price">计费说明: 前十分钟3.5元,<br/>十分钟后{this.state.price}元/分钟</span>
            <p>输入车牌号,获取解锁码</p>
            <input type="text" placeholder="输入车牌号" onInput={this.handleChange} minLength='8'/>
            <span className="OpenCarCodeBtn" onClick={this.inputunlocking}>立即用车</span>
        </div>, { animationType: 'slide-up', maskClosable:true});
    };
    onClose = (sel) => {
        this.setState({ sel });
        Popup.hide();
    };
    render(){
        var IdnexBg = {backgroundImage:`url(${Bg})` }
        return (
            <div className="Index" style={IdnexBg}>
                <ShowCard show={this.show} showState={this.state.show}></ShowCard>
                <div className="cover" style={{display:this.state.show}}></div>
                <div className="bottom">
                    <div className="left" onClick={this.enterPersonCenter}>
                        <img src={require('../img/person.png')} alt=""/>
                        <span>个人中心</span>
                    </div>
                    <span className="btn" onClick={this.unlocking}><i className="iconfont icon-richscan_icon"></i>  扫码开锁</span>
                    <div className="right" onClick={this.onClick}>
                        <img src={require('../img/input.png')} alt=""/>
                        <span>手动输入</span>
                    </div>
                </div>
            </div>

        )
    }

}


Index.contextTypes = {
    router: React.PropTypes.object
}

export default Index