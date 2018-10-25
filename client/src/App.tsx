import * as React from 'react'
import './App.css';
import { BlockRow } from "./BlockRow"
import { MinerRow } from "./MinerRow"
import { WorkerRow } from "./WorkerRow"
import { DisconnectedRow } from "./DisconnectedRow"
import { Modal, Button } from 'react-bootstrap';
// import { Button } from 'react-bootstrap'
class App extends React.Component<any, any> {
    private url: string = "http://127.0.0.1:3000"

    private miners: any[] = []
    private blocks: any[] = []
    private info: any = {}
    private lastBlock: any = {}
    private workers: any[] = []
    private totalWorkers: any[] = []
    private disconnections: any[] = []
    private totalDisconnections: any[] = []
    private blockStat: any = {}

    private showWallet: string
    constructor(props: any) {

        super(props)

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handleShowDisconnected = this.handleShowDisconnected.bind(this);
        this.handleCloseDisconnected = this.handleCloseDisconnected.bind(this);
        this.state = {
            show: false,
            showDisconnected: false
        };

        this.state = {
            blocks: [],
            info: {},
            miners: [],
            workers: [],
            disconnections: [],
            seconds: 0,
            test: `apple`
        }


        // this.<initialize></initialize>()
        //  setInterval(() => { this.tick() }, 1000)
    }

    public tick() {
        this.setState((prevState: any) => ({
            seconds: prevState.seconds + 1
        }));
    }
    public async initialize() {
        const data = await fetch(this.url + `/api/v1/hycon`)

        // tslint:disable-next-line:no-console
        const json = await data.json()
        this.miners = json.miners
        this.blocks = json.blocks
        this.info = json.info
        this.lastBlock = json.lastBlock
        this.totalWorkers = json.workers
        this.totalDisconnections = json.disconnections
        this.workers = []
        this.blockStat = {
            _01h: 0,
            _06h: 0,
            _12h: 0,
            _24h: 0,
            _01x: 0,
            _06x: 0,
            _12x: 0,
            _24x: 0,
        }

        const now = Date.now()
        for (const block of this.blocks) {
            if (now - block.timestamp <= 3600 * 1000) {
                if (block.mainchain === true) {
                    this.blockStat._01h++
                    this.blockStat._06h++
                    this.blockStat._12h++
                    this.blockStat._24h++
                } else {
                    this.blockStat._01x++
                    this.blockStat._06x++
                    this.blockStat._12x++
                    this.blockStat._24x++
                }
                continue
            }

            if (now - block.timestamp <= 6 * 3600 * 1000) {
                if (block.mainchain === true) {
                    this.blockStat._06h++
                    this.blockStat._12h++
                    this.blockStat._24h++
                } else {
                    this.blockStat._06x++
                    this.blockStat._12x++
                    this.blockStat._24x++
                }
                continue
            }

            if (now - block.timestamp <= 12 * 3600 * 1000) {
                if (block.mainchain === true) {
                    this.blockStat._12h++
                    this.blockStat._24h++
                } else {
                    this.blockStat._12x++
                    this.blockStat._24x++
                }
                continue
            }

            if (now - block.timestamp <= 24 * 3600 * 1000) {
                if (block.mainchain === true) {
                    this.blockStat._24h++
                } else {
                    this.blockStat._24x++
                }
                continue
            }
        }

        for (const block of this.blocks) {
            block.timestamp = (new Date(block.timestamp)).toUTCString()
            block.localTimestamp = (new Date(block.timestamp)).toString()
        }

        // sort miners 
        this.miners.sort((a: any, b: any) => b.hashshare - a.hashshare)

        this.setState({ miners: [] })
        this.setState({ miners: this.miners })

        this.setState({ blocks: [] })
        this.setState({ blocks: this.blocks })

        this.setState({ info: {} })
        this.setState({ info: this.info })

        // set workers
        this.workers = []
        for (let m of this.totalWorkers) {
            if (m.address === this.showWallet)
                this.workers.push(m)
        }
        this.workers.sort((a: any, b: any) => {
            if (a.workerId > b.workerId) { return 1 }
            else if (a.workerId === b.workerId) { return 0 }
            else { return -1 }
        })

        this.setState({ workers: [] })
        this.setState({ workers: this.workers })

        // set disconnections
        this.disconnections = []
        for (let m of this.totalDisconnections) {
            if (m.address === this.showWallet) {
                m.timeStamp = (new Date(m.timeStamp)).toLocaleString()
                this.disconnections.push(m)
            }
        }
        this.setState({ disconnections: [] })
        this.setState({ disconnections: this.disconnections })

        // tslint:disable-next-line:no-console
        console.log(json)
        // tslint:disable-next-line:no-console
        // console.table(json.blocks)
        // tslint:disable-next-line:no-console
        // console.table(json.miners)
        // tslint:disable-next-line:no-console
        // console.table(json.info)

    }
    public async componentDidMount() {
        setInterval(() => { this.initialize() }, 2000)
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    clickMiner(from: any) {
        this.showWallet = from
        this.initialize()
        this.setState({ show: true });

    }



    handleCloseDisconnected() {
        this.setState({ showDisconnected: false });
    }

    handleShowDisconnected() {
        this.setState({ showDisconnected: true });
    }


    clickMinerDisconnected(from: any) {
        this.showWallet = from
        this.initialize()
        this.setState({ showDisconnected: true });

    }

    public render() {

        const title = { "fontSize": "30px", "fontFamily": "Alegreya SC", "fontWeight": 700 }
        const titleWallet = { "fontSize": "30px", "fontFamily": "Gentium Basic", "fontWeight": 700 }
        const address = { "textDecoration": "none", "color": "#3152A5", "fontFamily": "Gentium Basic", "fontWeight": 500 }
        const table = { "fontSize": "18px", "fontFamily": "Gentium Basic" }
        const header = { "fontSize": "18px", "fontFamily": "Alegreya SC" }
        const digits = { minimumFractionDigits: 2, maximumFractionDigits: 2 }


        return (
            <div>
                <Modal {...this.props}
                    show={this.state.show}
                    onHide={this.handleClose}
                    bsSize="lg"
                    dialogClassName="worker-modal">

                    <Modal.Header closeButton>
                        <Modal.Title>Workers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <span style={titleWallet}> {this.showWallet} </span>
                        <table className="table table-hover" style={table} >
                            <thead style={header}>
                                <tr>
                                    <th className="text-center">On</th>
                                    <th className="text-center">Worker</th>
                                    <th className="text-center">Hash Rate</th>
                                    <th className="text-center">Hash Share</th>
                                    <th className="text-center">Expected Return</th>
                                    <th className="text-center">Expected Fee</th>
                                    <th className="text-center">Elapsed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.workers.map((peer: any) => {
                                    return (
                                        <WorkerRow key={peer.address + peer.workerId} worker={peer} info={this.info} app={this} />
                                    )
                                })}
                            </tbody>
                        </table>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>


                <Modal {...this.props}
                    show={this.state.showDisconnected}
                    onHide={this.handleCloseDisconnected}
                    bsSize="lg"
                    dialogClassName="worker-modal">

                    <Modal.Header closeButton>
                        <Modal.Title>Disconnected Workers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <span style={titleWallet}> {this.showWallet} </span>
                        <table className="table table-hover" style={table}>
                            <thead style={header}>
                                <tr>
                                    <th className="text-center">DateTime</th>
                                    <th className="text-center">Disconnected Worker</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.disconnections.map((peer: any) => {
                                    return (
                                        <DisconnectedRow key={peer.address + peer.workerId} worker={peer} info={this.info} app={this} />
                                    )
                                })}
                            </tbody>
                        </table>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleCloseDisconnected}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <section id="pool_data">
                    <div className="container">
                        <div className="table-responsive">

                            <span style={title}>Pool Status</span>
                            <table className="table table-hover" id="poolBrief" style={table}>
                                <thead style={header}>
                                    <tr>
                                        <th className="text-center">Hash Rate</th>
                                        <th className="text-center">Workers</th>
                                        <th className="text-center">Last 1h</th>
                                        <th className="text-center">Last 6h</th>
                                        <th className="text-center">Last 12h</th>
                                        <th className="text-center">Last 24h</th>
                                        <th className="text-center">Pool Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-center">{(this.info.poolHashrate * 0.001).toLocaleString(undefined, digits)} kH/s</td>
                                        <td className="text-center">{this.info.workerCount}</td>
                                        <td className="text-center">{this.blockStat._01h} ({this.blockStat._01x})</td>
                                        <td className="text-center">{this.blockStat._06h} ({this.blockStat._06x})</td>
                                        <td className="text-center">{this.blockStat._12h} ({this.blockStat._12x})</td>
                                        <td className="text-center">{this.blockStat._24h} ({this.blockStat._24x})</td>
                                        <td className="text-center"><a style={address} href="http://explorer.hycon.io/address/H2nVWAEBuFRMYBqUN4tLXfoHhc93H7KVP" target="_blank">H2nVWAEBuFRMYBqUN4tLXfoHhc93H7KVP</a></td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table table-hover" id="poolData" style={table}>
                                <thead style={header}>
                                    <tr>
                                        <th className="text-center">On</th>
                                        <th className="text-center">Wallet Address</th>
                                        <th className="text-center">Workers</th>
                                        <th className="text-center">Hash Rate</th>
                                        <th className="text-center">Hash Share</th>
                                        <th className="text-center">Expected Return </th>
                                        <th className="text-center">Expected Fee </th>
                                        <th className="text-center">Elapsed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.miners.map((peer: any) => {
                                        return (
                                            <MinerRow key={peer._id} miner={peer} info={this.info} app={this} />
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>



                <section id="mined_blocks">
                    <div className="container">

                        <div className="table-responsive">
                            <span style={title}>Last Block</span>
                            <table className="table table-hover" id="minedBlocks" style={table}>
                                <thead style={header}>
                                    <tr>
                                        <th data-field="height" className="text-center">Height</th>
                                        <th data-field="timestamp" className="text-center">Block Timestamp</th>
                                        <th data-field="miner" className="text-center">Miner</th>
                                        <th data-field="blockhash" className="text-center">Block Hash</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-center">{this.lastBlock.height}</td>
                                        <td className="text-center">{this.lastBlock.ago}</td>
                                        <td className="text-center">{this.lastBlock.miner}</td>
                                        <td className="text-center">{this.lastBlock.blockHash}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <span style={title}>Mined Blocks</span>
                            <table className="table table-hover" id="minedBlocks" style={table}>
                                <thead style={header}>
                                    <tr>
                                        <th data-field="height" className="text-center">Height</th>
                                        <th data-field="Mainchain" className="text-center">Mainchain</th>
                                        <th data-field="datetime" className="text-center">Datetime</th>
                                        <th data-field="blockhash" className="text-center">Block Hash</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.blocks.map((peer: any) => {
                                        return (
                                            <BlockRow key={peer._id} info={peer} />
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default App;
