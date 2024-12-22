const roleMiddleware = (roles) => {
    return (req, res, next) => {
        console.log('Checking roles:', roles);
        console.log('User data:', req.user);
        console.log('User role:', req.user?.role);

        if (!req.user || !roles.includes(req.user.role)) {
            console.log('Access denied. Required roles:', roles);
            console.log('User role:', req.user?.role);
            return res.status(403).send('Akses ditolak');
        }
        next();
    };
};

module.exports = roleMiddleware;