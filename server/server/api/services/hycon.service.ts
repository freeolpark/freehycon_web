import L from '../../common/logger'

import { Db, MongoClient } from "mongodb"

const delay = require('delay')
export class HyconService {
  private url: string = "mongodb://localhost:27017"
  private dbName = 'freehycon'

  private isReal = true
  private client: MongoClient
  private db: Db

  private jsonData: any = {}
  constructor() {
    if (this.isReal) {
                       this.url = "mongodb://127.0.0.1:27017"
    }
    this.initialize()
  }
  public async initialize() {
    this.client = await MongoClient.connect(this.url)
    this.db = this.client.db(this.dbName)

      // original: 2 seconds
    setInterval(async () => {
      this.fetchData()
    }, 10000)
  }
  public async fetchData() {

    let collection = this.db.collection(`MinedBlocks`)
    let blocks = await collection.find({}).sort({ "height": -1 }).limit(2000).toArray()
    for (let block of blocks) {
      block.time = `${new Date()}`
    }

    collection = this.db.collection(`Miners`)
    let miners = await collection.find({}).limit(200).toArray()
    for (let miner of miners) {
      miner.time = `${new Date()}`
    }

    collection = this.db.collection(`PoolSummary`)
    let infos = await collection.find({}).limit(100).toArray()
    let info: any = {}
    if (infos.length > 0) {
      info = infos[0]
    }
    info.time = new Date()


    collection = this.db.collection(`LastBlock`)
    let lastBlocks = await collection.find({}).limit(10).toArray()
    let lastBlock: any = {}
    if (lastBlocks.length > 0) {
      lastBlock = lastBlocks[0]
    }

    collection = this.db.collection(`Workers`)
    let workers = await collection.find({}).limit(3000).sort({ workerId: 1 }).toArray()

    collection = this.db.collection(`Disconnections`)
    let disconnections = await collection.find({}).limit(3000).sort({ timestamp: -1 }).toArray()

    this.jsonData = { miners, blocks, info, lastBlock, workers, disconnections }

  }
  public async   all(): Promise<any> {
    return this.jsonData
  }

  public async  byId(id: number): Promise<any> {
    return { id: 0, name: "apple" }
  }

  public async  create(name: string): Promise<string> {
    return "test"
  }
}

export default new HyconService(); 
