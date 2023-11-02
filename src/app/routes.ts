import { type Response, Router, Request } from 'express';
import { users } from '../modules/users/user.route';
import { company } from '../modules/company/company.route';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.send('Server is healthy');
});

router.use('/users', users);
router.use('/company', company);

export default router;