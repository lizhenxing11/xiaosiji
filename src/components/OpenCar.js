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
            carid:''
        }

    }
    componentWillUnmount(){
        clearInterval(this.time)    // path/to/abc
        clearInterval(this.times)    // path/to/abc
        clearInterval(this.newtime)    // path/to/abc
    }
    componentWillMount(){
        clearInterval()
    }
    componentDidMount(){
        this.setState({ID:window.localStorage.id})
        setTimeout(()=>{
            this.time=  setInterval(()=>{
                if(this.state.progressCode<100){
                    let num = this.state.progressCode+1
                    this.setState({progressCode:num})
                }else{
                    // this.setState({progressCode:'',icon:'iconfont icon-zhengque',sign:'',state:'开锁成功'})
                    clearInterval(this.time)
                }


            },500)
            axios({
                url:'/SmallCar/scanTwoCode.action',
                method:'post',
                data:{id:this.state.ID,resultStr:this.props.location.query.scanQRCode}
            }).then((res)=>{
                if(!res.data.map){
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
                }else{
                    this.times = setInterval(()=>{
                        if(!this.state.progressCode<100){
                            this.setState({modal1:true})
                            clearInterval(this.times)
                        }
                    },1000)
                }

            })
        },2000)

    }

    onCloseModal = key => () => {
        this.setState({
            [key]: false,
        });
        this.context.router.history.push('/index')
    }
    componentDidUpdate(event) {
        if(this.state.state === '开锁成功'){
            this.context.router.history.push({
                pathname:'/drivering',
                query:{carid:this.state.carid,beginstamp:this.state.beginstamp,orderID:this.state.orderID}
            })
        }
    }
    render(){
        return(
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
        )
    }
}

OpenCar.contextTypes={
    router: React.PropTypes.object
}

export default OpenCar