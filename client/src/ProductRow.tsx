import * as React from 'react'
export class ProductRow extends React.Component<any, any> {
    public render() {
        const product = this.props.product
        const name = this.props.name

        return (
            <tr>
                <td>{product}</td>
                <td>{name}</td>
            </tr>
        );
    }
}