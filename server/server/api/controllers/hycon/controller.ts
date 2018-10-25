import HyconService from '../../services/hycon.service';
import { Request, Response } from 'express';

export class Controller {
  public async all(req: Request, res: Response) {
    let r = await HyconService.all()
    return res.json(r)
  }

  public async byId(req: Request, res: Response) {
    try {
      let r = await HyconService.byId(req.params.id)
      res.json(r)
    }
    catch (err) {
      res.status(404).end()
    }
  }

  public async create(req: Request, res: Response) {
    let r = await HyconService.create(req.body.name)
    res.status(201)
    res.location(`/api/v1/hycon/${r}`)
    res.json(r)
  }
}
export default new Controller();
