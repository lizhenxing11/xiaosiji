import React,{Component} from 'react'
import {FormGroup,InputGroup,Button,MenuItem,DropdownButton,FormControl} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import axios from 'axios'
import '../../Style/login.css'

class Login extends Component{
    constructor (props,context) {
        super(...arguments);
        this.state = {
            telTitle:"+86",/*区号*/
            telNum:"",//手机号
            signCode:"",//验证码
            time:60,//计时器
            countdown:"获取验证码",//获取验证码按钮的value
            cover:'none',//覆盖层是否显示
            err:'none'//校验表单
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
                this.setState({cover:"block"})
                var int = setInterval(()=> {
                    if (this.state.time>0) {
                        this.state.time--
                        this.setState({countdown :this.state.time+  's后重新获取'});
                    }else {
                        clearInterval(int)
                        this.setState({time: 60});
                        this.setState({countdown: '获取验证码'});
                        this.setState({cover:"none"})
                    }

                },1000)
            }else {
                this.setState({err:'flex'})
            }

        }
        this.confirm = (event) =>{

            // this.context.router.history.push('/')

        }
    }
    componentWillMount(){
        axios({
            method:'get',
            url:''
        }).then((res)=>{
            if(res.data.userPresence){
               this.context.router.history.push('/index')
            }

        })
    }
    render () {
        return (
           <div className="login">
               <h1>请输入您的手机号码</h1>
               <form className="sign">
                   <FormGroup>
                       <InputGroup>
                           <InputGroup.Button>
                               <DropdownButton bsStyle="default" title={this.state.telTitle} key="1" id="dropdown-basic" disabled={true}>
                                   <MenuItem eventKey="1">Action</MenuItem>
                                   <MenuItem eventKey="2">Another action</MenuItem>
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
                           <input type="text"  onChange={this.handleChangeSignCode} value={this.state.signCode} placeholder="请输入验证码"/>
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