import * as React from 'react'

export class WorkerRow extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { info: props.info, worker: props.worker, app: props.app }
    }
    handleClick(i:any) {
        console.log(`click2 ${i} app=${this.state.app}`)
      
    }
    public render() {
        const on = { "color": "#03EBA6" }
        const off = { "color": "#BFBFBF" }
        const digits = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        return (
             <tr>
                <td className="text-center">{Date.now() - this.state.worker.lastUpdate >= 30000 ? 
                    <i className="fa fa-circle" style={off}></i> : 
                    <i className="fa fa-circle" style={on}></i>}</td>
                <td className="text-center">{this.state.worker.workerId}</td>
                <td className="text-center">{this.state.worker.hashrate > 0 ?
                    (0.001 * this.state.worker.hashrate).toLocaleString(undefined, digits) + " kH/s" :
                    "-" 
                }</td>
                <td className="text-center">{(this.state.worker.hashshare / this.state.info.poolHashshare * 100).toFixed(2)}%</td>
                <td className="text-center">{(this.state.worker.reward / this.state.info.poolHashshare * 240).toFixed(9)} HYC</td>
                <td className="text-center">{(this.state.worker.fee / this.state.info.poolHashshare * 240).toFixed(9)} HYC</td>
                <td className="text-center">{this.state.worker.elapsedStr}</td>
            </tr>
        );
    }
}
