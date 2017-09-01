import React,{Component} from 'react'
import ShowCard from './showCard'
import '../Style/index.css'
import Bg from '../img/Indexbg.jpg'
import { Popup, List, Button, Icon } from 'antd-mobile';

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
                    <span className="btn" onClick={this.onClick}><i className="iconfont icon-richscan_icon"></i>  扫码开锁</span>
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