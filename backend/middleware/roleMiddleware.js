const roleMiddleware = (...roles) => {
    const allowed = roles.flat();

    return (req, res, next) => {
        if (!req.user || !allowed.includes(req.user.role)) {
            return res.status(403).json({
                message: "Nemate ovlasti za ovu akciju."
            });
        }
        next();
    };
};

module.exports = roleMiddleware;
