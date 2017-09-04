import React,{Component} from 'react'
import {FormGroup,InputGroup,MenuItem,DropdownButton,FormControl} from 'react-bootstrap'
import { Modal } from 'antd-mobile'
import {Link} from 'react-router-dom'
import axios from 'axios'
import '../../Style/login.css'

class Login extends Component{
    constructor (props,context) {
        super(...arguments);
        this.state = {
            ID:'',
            telTitle:"+86",/*区号*/
            telNum:"",//手机号
            signCode:"",//验证码
            time:60,//计时器
            countdown:"获取验证码",//获取验证码按钮的value
            cover:'none',//覆盖层是否显示
            err:'none',//校验表单,
            modal1:false //提示框
        }
        this.handleChange =(event)=>{
            //双向绑定数据
            this.setState({err:'none'})
            event.target.value=event.target.value.replace(/\D/g,'')
            this.setState({telNum:event.target.value})
        }
        this.handleChangeSignCode =(event)=>{
            this.setState({signCode:event.target.value})
        }
        this.getCode = () =>{
            if(/^1[34578]\d{9}$/.test(this.state.telNum)){
                axios({
                    method:'get',
                    url:'/SmallCar/beforeLogin.action?phone='+ this.state.telNum +'&id='+ this.state.ID,
                }).then((res)=>{
                    if(!res.data.map) {
                        this.setState({cover:"block"})
                        var int = setInterval(() => {
                            if (this.state.time > 0) {
                                this.state.time--
                                this.setState({countdown: this.state.time + 's后重新获取'});
                            } else {
                                clearInterval(int)
                                this.setState({time: 60});
                                this.setState({countdown: '获取验证码'});
                                this.setState({cover: "none"})
                            }

                        }, 1000)
                    } else{
                        this.setState({err:'flex'})
                    }
                }).catch((err)=>{

                })
            }else {
                this.setState({err:'flex'})
            }

        }
        this.confirm = (event) =>{
            axios({
                method:'get',
                url:'SmallCar/doLogin.action?phone='+ this.state.telNum +'&chenk_code='+ this.state.signCode +'&id='+this.state.ID
            }).then((res)=>{
                if(!res.data.map){
                    this.context.router.history.push('/index')
                }else{
                    this.setState({modal1:true})
                }
            })
        }
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    componentWillMount(){

        window.localStorage.removeItem('id')


    }
    componentDidMount(){
        var str = window.location.href
        var id = str.substring(str.indexOf('=')+1)
        window.localStorage.setItem('id',id)
        this.setState({ID:window.localStorage.id})

    }
    render () {
        return (
           <div className="login">
               <Modal
                   title="验证失败"
                   transparent
                   maskClosable={false}
                   visible={this.state.modal1}
                   onClose={this.onClose('modal1')}
                   footer={[{ text: '确定', onPress: () => {this.onClose('modal1')(); } }]}
               >
                   手机号或验证码输入错误
               </Modal>
               <h1>请输入您的手机号码</h1>
               <form className="sign">
                   <FormGroup>
                       <InputGroup>
                           <InputGroup.Button>
                               <DropdownButton bsStyle="default" title={this.state.telTitle} key="1" id="dropdown-basic" disabled={true}>
                                   <MenuItem eventKey="1">+86</MenuItem>
                                   <MenuItem eventKey="2">+66</MenuItem>
                                   <MenuItem eventKey="3">Something else here</MenuItem>
                                   <MenuItem divider />
                                   <MenuItem eventKey="4">Separated link</MenuItem>
                               </DropdownButton>
                           </InputGroup.Button>
                           <FormControl placeholder="请输入您的手机号" value={this.state.telNum} onChange={this.handleChange} type="text" maxLength="11"/>

                       </InputGroup>
                       <span className="err" style={{display:this.state.err}}>请输入正确的手机号</span>
                   </FormGroup>
                   <div className="signCode">
                       <div className="signCodeipt">
                           <span>验证码</span>
                           <input type="text"  onChange={this.handleChangeSignCode} value={this.state.signCode} placeholder="请输入验证码" maxLength='10'/>
                       </div>
                       <span id="getCode" onClick={this.getCode}>{this.state.countdown}</span>
                       <div className="cover" style={{display:this.state.cover}}></div>
                   </div>
                   <span id="confirm" onClick={this.confirm}>开始</span>
               </form>
               <div className="book">

                   <p>点击开始,既表示以阅读并同意</p>
                   <Link to="/">《用车服务条款》</Link>
               </div>
           </div>
        )
    }
}

Login.contextTypes = {
    router: React.PropTypes.object
}

export default Login