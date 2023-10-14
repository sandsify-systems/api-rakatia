import { type Response, Router } from 'express';
import {users} from './users/user.route';

const router = Router();

router.get('/', (res: Response) => {
	res.send('Server is healthy');
})

router.use('/users', users);

export default router;
