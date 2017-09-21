import React,{Component} from 'react'
import { Carousel,Icon } from 'antd-mobile';
import '../Style/showCard.css'

class ShowCard extends Component{
    constructor (props,context) {
        super(...arguments);
        this.state = {
            initialHeight:200,
            data:[{img:require('../img/pic2.jpg'),title:'一键扫码,快速开锁',main:'在小司机玩具车的车头都印有二维码',main2:'只需要用手机扫码，车锁会自动打开'},{img:require('../img/pic1.jpg'),title:'拔电使用,充电结束',main:'请在电源处拔电后开始用车',main2:'确认小车已充电后结束用车'}],
            show:this.props.showState
        }
        this.closeCard = ()=>{
            this.setState({show:'none'})
            this.props.show()
        }
    }
    render() {
        const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
        return (
            <div className="showCard" style={{display:this.state.show}}>
                    <Carousel
                        className="my-carousel"
                        autoplay={false}
                        infinite
                        selectedIndex={0}
                        swipeSpeed={35}
                    >
                        {this.state.data.map((ii,ind) => (
                            <div className="CardItem" key={ind} style={hProp}>
                                <img
                                    className="CardImg"
                                    src={ii.img}
                                    alt="icon"
                                    onLoad={() => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({
                                            initialHeight: null,
                                        });
                                    }}
                                />
                                <h2>{ii.title}</h2>
                                <p className="main">{ii.main}</p>
                                <p>{ii.main2}</p>
                            </div>
                        ))}
                    </Carousel>
                <Icon type='cross-circle' onClick={this.closeCard} />
            </div>
        )
    }
}

export default ShowCard