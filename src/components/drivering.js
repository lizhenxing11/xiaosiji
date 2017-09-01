import React,{Component} from 'react'
import '../Style/drivering.css'
import Bg from '../img/Indexbg.jpg'


class Drivering extends Component{
    constructor(propos,context){
        super(...arguments)
        this.state={
            title:'行驶时间',
            time:'00:00:00',
            total:3.5,
            over:false,
            confirmevent:'确认归还'
        }
        this.confirm= ()=>{
            if(this.state.confirmevent ==="确认归还") {
                this.setState({over: true})
                this.setState({time: this.state.total})
                this.setState({title: '本次行驶需要支付费用(元)'})
                this.setState({confirmevent: '确认支付'})
            }else{
                this.context.router.history.push({
                    pathname:'/driveover',
                    query:{total:this.state.total}
                })
            }
        }
    }
    componentWillMount(){
        const time = new Date().getTime()

        var timeInterval= setInterval(()=>{
            if(this.state.over){
                clearInterval(timeInterval,totalInterval)

            }else{
                this.setState({time:new Date(new Date().getTime()-time-28800000).Format('hh:mm:ss')})
            }

        },1000)
        var totalInterval = setInterval(()=>{
            if((new Date().getTime()-time)/1000 >= 600){
                this.setState({total:this.state.total+0.35})
                console.log(new Date().getTime()-time/1000)
            }
        },60000)
    }
    render(){
        let driveringBg = {backgroundImage:`url(${Bg})`}
        return(
            <div className="drivering" style={driveringBg}>
                <div className="bottom">
                    <h6>{this.state.title}</h6>
                    <span className="time">{this.state.time}</span>
                    <p>当前费用:{this.state.total}元</p>
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