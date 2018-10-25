import * as React from 'react'
export class BlockRow extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = { info: props.info }
    }
    public render() {
        const on  = { "color": "#03EBA6", "fontSize": "22px", "vertical-align": "middle" }
        const off = { "color": "#BFBFBF", "fontSize": "22px", "vertical-align": "middle" }
        return (
            <tr>
                <td className="text-center">{this.state.info.height}</td>
                <td className="text-center">{this.state.info.mainchain ? <i className="fas fa-code-branch" style={on}></i > :<i className="fas fa-code-branch" style={off}></i> }</td>
                <td className="text-center">{this.state.info.timestamp}</td>
                <td className="text-center">{this.state.info._id}</td>
            </tr>
        );
    }
}
