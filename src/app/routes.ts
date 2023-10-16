import { type Response, Router, Request } from 'express';
import { users } from '../modules/users/user.route';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.send('Server is healthy');
})

router.use('/users', users);

export default router;