import * as React from 'react'

export class DisconnectedRow extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { info: props.info, worker: props.worker, app: props.app }
    }
    handleClick(i:any) {
        console.log(`click2 ${i} app=${this.state.app}`)
      
    }
    public render() {  
       // const on = { "color": "#03EBA6" }
       // const off = { "color": "#BFBFBF" }
       // const digits = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        return (
             <tr>                
                <td className="text-center">{new Date(this.state.worker.timestamp).toLocaleString()}</td>
                <td className="text-center">{this.state.worker.workerId}</td>
            </tr>
        );
    }
}
