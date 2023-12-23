import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

// STATIC ROUTER
const static_router = Router();
// REQUESTS LIMITER
const static_limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 60 requests per windowMs
});
static_router.use(static_limiter);

// Redirect to home page
static_router.get('/', (req, res) => {
    res.redirect(301, '/static/home/index.html');
});

export default static_router;
