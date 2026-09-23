/**
 * Admin Authorization Middleware
 * 
 * Must run AFTER the protect (authMiddleware) middleware, which
 * verifies the JWT and attaches req.user from the database.
 * 
 * This middleware checks that the already-authenticated user
 * has role === "admin". Role is always read from the database
 * (via req.user set by protect), never from request body or query.
 * 
 * Usage in routes:
 *   router.get('/something', protect, adminOnly, controller)
 * 
 * Behavior:
 *   - If no req.user: protect middleware handles it (401)
 *   - If req.user.role !== 'admin': returns 403 Forbidden
 *   - If req.user.role === 'admin': calls next()
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

module.exports = { adminOnly };
