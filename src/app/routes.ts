import { type Request, type Response, Router } from 'express';

const router:Router = Router();

router.get('/', (req: Request, res: Response) => {
	res.send('server is healthy');
})

export default router;
