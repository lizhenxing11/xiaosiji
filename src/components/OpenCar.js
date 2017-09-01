import React,{Component} from 'react'
import '../Style/OpenCar.css'

class OpenCar extends Component{
    constructor(props,context){
        super(...arguments);
        this.state={
            progressCode:0,
            sign:'%',
            state:'开锁中',
            icon:'iconfont'
        }

    }
    componentWillMount(){
        setTimeout(()=>{
           let time=  setInterval(()=>{

                if(this.state.progressCode<100){
                    let num = this.state.progressCode+1
                    this.setState({progressCode:num})
                }else{
                    this.setState({progressCode:'',icon:'iconfont icon-zhengque',sign:'',state:'开锁成功'})
                    clearInterval(time)
                }


            },100)
        },2000)


    }
    componentDidUpdate(event) {
        if(this.state.state === '开锁成功'){
            this.context.router.history.push('/login')
            console.log('fuxk')
        }
    }
    render(){
        return(
            <div className="OpenCar">
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