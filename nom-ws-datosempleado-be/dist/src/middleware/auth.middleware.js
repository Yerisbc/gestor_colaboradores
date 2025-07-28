"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_utils_1 = require("../utils/auth.utils");
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = auth_utils_1.AuthUtils.extractTokenFromHeader(authHeader);
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no proporcionado'
            });
        }
        const decoded = auth_utils_1.AuthUtils.verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido o expirado'
        });
    }
};
exports.authenticateToken = authenticateToken;
