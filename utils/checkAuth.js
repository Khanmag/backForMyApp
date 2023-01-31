import jwt from 'jsonwebtoken'

export default (req, res, next) => {

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = jwt.verify(token, '329230295')
            req.userId = decoded._id
            next()
        } catch(err) {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }

    } else {
        return res.json({
            message: 'Нет доступа'
        })
    }
}