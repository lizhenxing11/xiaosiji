import React,{Component} from 'react'
import '../Style/repair.css'
import axios from 'axios'
import { Modal } from 'antd-mobile';

export default class Repair extends Component{
    constructor(props,context){
        super(...arguments)
        this.state={
            ID:'',
            cardCode:'',
            question:[],
            questionDetail:'',
            isLoggedIn:false,
            localId: [],
            serverId: null
        }
        this.handdle=(event)=>{
            event.target.value=event.target.value.replace(/\D/g,'')
            this.setState({cardCode:event.target.value})
        }
        this.change=(e)=>{
            this.setState({questionDetail:e.target.value})
        }
        this.selectQuestion=(event)=>{
            var select = this.state.question
            console.log(event.target.value)
            select[event.target.value].select=!select[event.target.value].select
            this.setState({question:select})
        }
        this.scan=()=>{
            let self = this
            window.wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    axios({
                        url:'/SmallCar/getSceneStrByGeturl.action',
                        method:'post',
                        params:{url:res.resultStr}
                    }).then((res)=>{
                        self.setState({cardCode:res.data.sceneStr})
                    })
                }
            });
        }
        this.chooseImage=()=>{
            let self = this
            window.wx.chooseImage({
                count: 3, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds;
                    self.setState({localId:localIds,isLoggedIn:true})// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    let h = self
                    let serverID = []
                    localIds.map((val)=>{
                        window.wx.uploadImage({
                            localId: val, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                var serverId = res.serverId; // 返回图片的服务器端ID
                                serverID.push(serverId)
                                alert(serverId)
                            }
                        });
                    })
                    self.setState({serverId:serverID})
                }
            });
        }
        this.submit=()=>{
            var type = []
            this.state.question.map((val)=>{
                if (val.select){
                    type.push(val.id)
                }
            })
            if(this.state.cardCode === ''){
                alert('车辆编号不能为空')
                return
            }
            if(!type.length){
                alert('问题类型不能为空')
                return
            }
            axios({
                method:'post',
                url:'/SmallCar/addRepair.action',
                params:{carcode:this.state.cardCode,type:type.join(','),mediaIds:this.state.serverId,userid:this.state.ID,details:this.state.questionDetail}
            }).then((res)=>{
                if(res.data === 1){
                    Modal.alert("上报成功",<div><p style={{fontSize:'0.22rem'}}>工作人员正在审核</p><p style={{fontSize:'0.22rem'}}>一到三个工作日返回结果</p></div>,[
                        { text: '返回微信', onPress: () => {window.wx.closeWindow()} },
                        { text: '开始新行程', onPress: () => {this.context.router.history.push('/index')} }
                    ])

                }else{
                    alert('车辆不存在')
                }
            })
        }
    }
    componentWillMount(){
        this.setState({ID:window.localStorage.id})
        axios({
            url:'/SmallCar/getAllRepairType.action',
            method:'get',
        }).then((res)=>{
            res.data.map.forEach((val)=>{
                val.select = false
            })
            this.setState({question:res.data.map})
        })
    }
    componentDidMount(){
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
                jsApiList: ['scanQRCode','chooseWXPay','chooseImage','uploadImage','closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            window.wx.ready(()=>{})
        }).catch((err)=>{

        })
    }
    render(){
        let isLoggedIn = this.state.isLoggedIn;

        return(
            <div className="repair">
                <div className="Cardcode">
                    <input type="text" onChange={this.handdle} maxLength="11" placeholder="扫描二维码或手动输入编码" value={this.state.cardCode}/><i className="iconfont icon-richscan_icon" onClick={this.scan}></i>
                </div>
                <div className="question">
                    <span>请选择问题类型</span>
                    <ol>
                        {this.state.question.map((val,ind)=>{
                            return(
                                <li className={val.select ? "select":""} key={ind} value={ind} onClick={this.selectQuestion}>{val.typeName}</li>
                            )
                        })}
                    </ol>
                    <textarea name="questionDetail" id="" cols="5" rows="5" onInput={this.change} placeholder="问题补充描述..."></textarea>
                </div>
                <div className="chooseImg">
                    {isLoggedIn? <div className="img">
                            {this.state.localId.map((val,ind)=>{
                                return (
                                    <img src={val} alt="" key={ind} onClick={this.chooseImage}/>
                                )
                            })}
                    </div>: <div className="imgnone" onClick={this.chooseImage}><img src={require('../img/photo.png')} alt=""/><span>请拍摄车子照片<br/>帮我们更快的解决问题</span></div>}
                </div>
                <button className="submit" onClick={this.submit}>提交</button>
            </div>
        )
    }
}
Repair.contextTypes = {
    router: React.PropTypes.object
}