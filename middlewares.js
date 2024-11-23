// middlewares.js

function verificarAutenticacao(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Não autorizado." });
    }
    next();
}

function verificarAdmin(req, res, next) {
    if (!req.session.usuario || req.session.usuario.permissao !== 1) {
        return res.status(403).json({ message: "Acesso restrito aos administradores." });
    }
    next();
}

module.exports = { verificarAutenticacao, verificarAdmin };
