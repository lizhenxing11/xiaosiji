import React,{Component} from 'react'
import '../Style/OpenCar.css'
import axios from 'axios'
import { Modal } from 'antd-mobile';

class OpenCar extends Component{
    constructor(props,context){
        super(...arguments);
        this.state={
            modal1:false,
            ID:'',
            progressCode:0,
            sign:'%',
            state:'开锁中',
            icon:'iconfont',
            beginstamp:'',
            orderID:'',
            carid:'',
            countdown:60,
            success:"none"
        }

    }
    componentWillUnmount(){
        clearInterval(this.time)    // 清除计时器
        clearInterval(this.times)    // 清除计时器
        clearInterval(this.newtime)    // 清除计时器
    }
    componentDidMount(){
        this.setState({ID:window.localStorage.id})
        setTimeout(()=>{//2s之后开始
            this.time=  setInterval(()=>{
                if(this.state.progressCode<100){
                    let num = this.state.progressCode+1
                    this.setState({progressCode:num})
                }else{
                    this.setState({progressCode:'',icon:'iconfont icon-zhengque',sign:'',state:'开锁成功'})
                    clearInterval(this.time)
                }


            },500)
            if(this.props.location.query.scanQRCode){
                axios({//开锁
                    url:'/SmallCar/scanTwoCode.action',
                    method:'post',
                    data:{id:this.state.ID,resultStr:this.props.location.query.scanQRCode}
                }).then((res)=>{
                    if(res.data[0]){//开锁成功
                        clearInterval(this.time)
                        this.newtime=  setInterval(()=>{
                            if(this.state.progressCode<100){
                                let num = this.state.progressCode+1
                                this.setState({progressCode:num})
                            }else{
                                this.setState({progressCode:'',icon:'iconfont icon-zhengque',sign:'',state:'开锁成功'})
                                clearInterval(this.newtime)
                            }
                        },10)
                        this.setState({orderID:res.data[0].id})

                        this.setState({carid:res.data[0].carid})
                        this.setState({beginstamp:res.data[0].beginstamp})
                    }else{//开锁失败
                        this.times = setInterval(()=>{
                            if(!this.state.progressCode<100){
                                this.setState({modal1:true})//提示失败
                                clearInterval(this.times)
                            }
                        },1000)
                    }

                })
            }
            if(this.props.location.query.cardCode){//输入车辆编码开锁
                axios({//开锁
                    url:'/SmallCar/openCarBynum.action?id='+this.state.ID+'&carcode='+String(this.props.location.query.cardCode),
                    method:'get'
                }).then((res)=>{
                    if(res.data[0]){//开锁成功
                        clearInterval(this.time)
                        this.newtime=  setInterval(()=>{
                            if(this.state.progressCode<100){
                                let num = this.state.progressCode+1
                                this.setState({progressCode:num})
                            }else{
                                this.setState({progressCode:'',icon:'iconfont icon-zhengque',sign:'',state:'开锁成功'})
                                clearInterval(this.newtime)
                            }
                        },10)
                        this.setState({orderID:res.data[0].id})

                        this.setState({carid:res.data[0].carid})
                        this.setState({beginstamp:res.data[0].beginstamp})
                    }else{//开锁失败
                        this.times = setInterval(()=>{
                            if(!this.state.progressCode<100){
                                this.setState({modal1:true})//提示失败
                                clearInterval(this.times)
                            }
                        },1000)
                    }

                })
            }

        },2000)

    }

    onCloseModal = key => () => {//关闭提示并跳转扫码主页
        this.setState({
            [key]: false,
        });
        this.context.router.history.push('/index')
    }
    componentDidUpdate(event) {//开锁命令成功后跳转计时
        if(this.state.state === '开锁成功'&&this.state.countdown===60){
            clearInterval(this.countdown)
            this.countdown = setInterval(()=>{
                this.setState({success:"flex"})
                if(this.state.countdown > 0){
                    let num = this.state.countdown-1
                    this.setState({countdown:num})

                }else{
                    clearInterval(this.countdown)
                    this.context.router.history.push({
                        pathname:'/drivering',
                        query:{carid:this.state.carid,beginstamp:this.state.beginstamp,orderID:this.state.orderID}
                    })
                }
            },1000)


        }
    }
    render(){
        return(
            <div className="open">
                <div className="OpenCar">
                    <Modal
                        title="开锁失败"
                        transparent
                        maskClosable={false}
                        visible={this.state.modal1}
                        onClose={this.onCloseModal('modal1')}
                        footer={[{ text: '确定', onPress: () => {this.onCloseModal('modal1')(); } }]}
                    >
                        小车有故障,请换一辆试试
                    </Modal>
                    <div className="content">
                        <i className={this.state.icon}>{this.state.progressCode}{this.state.sign}</i>
                        <h5>{this.state.state}</h5>
                    </div>
                </div>
                <span className="OpenCarfooter" style={{display:this.state.success}}>{this.state.countdown}s后开始计费
                    <em style={{color:'red'}}>请拔掉充电器</em>检查车辆是否启动
                </span>
            </div>
        )
    }
}

OpenCar.contextTypes={
    router: React.PropTypes.object
}

export default OpenCar