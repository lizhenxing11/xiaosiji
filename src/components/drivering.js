import React,{Component} from 'react'
import '../Style/drivering.css'
import Bg from '../img/Indexbg.jpg'
import axios from 'axios'


class Drivering extends Component{
    constructor(propos,context){
        super(...arguments)
        this.state={
            ID:'',
            title:'行驶时间',
            time:'00:00:00',
            total:3.5,
            over:false,
            confirmevent:'确认归还',
            timestamp:'',
            nonceStr:'',
            package:'',
            signType:'',
            paySign:'',
            orderID:'',
            BeginTime:''
        }
        this.confirm= ()=>{
            if(this.state.confirmevent ==="确认归还") {//确认归还
                axios({
                    method:'post',
                    url:'/SmallCar/closeCar.action',
                    data:{beginstamp:String(this.props.location.query.beginstamp),userid:this.state.ID,id:this.props.location.query.orderID,carid:this.props.location.query.carid,total:String(Number(new Date().getTime()-this.props.location.query.beginstamp))}
                }).then((res)=>{
                    this.setState({timestamp:res.data.timestamp,nonceStr:res.data.nonce_str,package:res.data.package,paySign:res.data.paySign,orderID:res.data.order})
                    this.setState({over: true})
                    this.setState({time: this.state.total})
                    this.setState({title: '本次行驶需要支付费用(元)'})
                    this.setState({confirmevent: '确认支付'})
                    clearInterval(this.totalInterval)
                    clearInterval(this.timeInterval)
                })
            }else{//确认支付
                let self = this
                window.wx.chooseWXPay({
                    appId:'wxa70554b5f2348936',
                    timestamp: Number(this.state.timestamp), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: this.state.nonceStr, // 支付签名随机串，不长于 32 位
                    package: this.state.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: this.state.paySign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        if(res.errMsg==='chooseWXPay:ok'){
                            axios({
                                url:'/SmallCar/payBack.action?id='+ self.state.ID +'&orderid='+self.state.orderID,
                                method:'get'
                            }).then((res)=>{
                                if(res.data[0]){
                                    self.context.router.history.push({
                                        pathname: '/index',
                                        query: {orderID: self.state.orderID}
                                    })
                                }
                            }).catch((err)=>{
                                alert(err.url)
                                alert('系统出现问题导致不能付款,请联系管理员,否则会导致后续不能用车')
                            })
                        }else{
                        }
                    }
                });
            }
        }

        }
    componentWillUnmount(){
        clearInterval(this.timeInterval)//当组件销毁时停掉计时器
    }
    componentWillMount(){
        this.setState({ID:window.localStorage.id})
                this.setState({BeginTime:new Date().getTime()})

            this.timeInterval= setInterval(()=>{//计时器  计算时间和总价
                if(this.state.over){
                    clearInterval(this.timeInterval)

                }else{
                    this.setState({time:new Date(new Date().getTime()-this.state.BeginTime-28800000).Format('hh:mm:ss')})
                    if((new Date().getTime()-this.state.BeginTime)/1000 >= 600){
                        this.setState({total:Math.ceil((((new Date().getTime()-this.state.BeginTime)/1000).toFixed(0)-600)/60)*0.35+3.5})
                    }
                }

            },1000)
    }
    componentDidMount(){
        axios({//微信config
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
        if(this.props.location.query.status===2){
            this.setState({timestamp:this.props.location.query.timestamp,nonceStr:this.props.location.query.nonceStr,package:this.props.location.query.package,paySign:this.props.location.query.paySign,orderID:this.props.location.query.orderID})
            this.setState({over: true})
            this.setState({time: this.state.total})
            this.setState({title: '本次行驶需要支付费用(元)'})
            this.setState({confirmevent: '确认支付'})
            clearInterval(this.totalInterval)
            clearInterval(this.timeInterval)

        }
        if(this.props.location.query.status===1){
            this.setState({BeginTime:this.props.location.query.beginstamp})

        }
    }
    render(){
        let driveringBg = {backgroundImage:`url(${Bg})`}
        return(
            <div className="drivering" style={driveringBg}>
                <div className="bottom">
                    <h6 onClick={this.fuck}>{this.state.title}</h6>
                    <span className="time">{this.state.time}</span>
                    <p>当前费用:{this.state.total.toFixed(2)}元</p>
                    <span className="over" onClick={this.confirm}>{this.state.confirmevent}</span>
                </div>

            </div>
        )
    }
}

Drivering.contextTypes={
    router:React.PropTypes.object
}

export default Drivering