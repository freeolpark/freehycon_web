import * as React from 'react'
export class MinerRow extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { info: props.info, miner: props.miner, app: props.app }
    }
    handleClick(i:any) {        
        this.state.app.clickMiner(i)
   
    }
    handleClickDiconnected(i:any) {
        console.log(`click disconnected ${i} app=${this.state.app}`)
        this.state.app.clickMinerDisconnected(i)
    }
    public render() {
        const on = { "color": "#03EBA6" }
        const off = { "color": "#BFBFBF" }
        const digits = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        return (
             <tr>
                <td className="text-center">{this.state.miner.nodes > 0 ? 
                    <i className="fa fa-circle" style={on}></i> : 
                    <i className="fa fa-circle" style={off}></i>}</td>
                <td onClick={()=>this.handleClick(this.state.miner._id)} className="text-center">{this.state.miner._id}  </td>
                <td onClick={()=>this.handleClickDiconnected(this.state.miner._id)} className="text-center">{this.state.miner.nodes > 0 ?
                    this.state.miner.nodes :
                    "-"
                }</td>
                <td className="text-center">{this.state.miner.hashrate > 0 ?
                    (0.001 * this.state.miner.hashrate).toLocaleString(undefined, digits) + " kH/s" :
                    "-" 
                }</td>
                <td className="text-center">{(this.state.miner.hashshare  * 100).toFixed(2)}%</td>
                <td className="text-center">{(this.state.miner.reward  * 240).toFixed(9)} HYC</td>
                <td className="text-center">{(this.state.miner.fee  * 240).toFixed(9)} HYC</td>
                <td className="text-center">{this.state.miner.elapsedStr}</td>
            </tr>
        );
    }
}
