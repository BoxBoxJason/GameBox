import { Router} from 'express';
const static_router = Router();

static_router.get('/', (req, res) => {
    res.redirect(301, '/static/index.html')
});

export default static_router;
