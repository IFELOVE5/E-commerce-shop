const { expressjwt: expressJwt } = require('express-jwt');


const authJwt  = () => {
    const secret = process.env.JWT_SECRET;
    return expressJwt ({
    secret,
    algorithms:['HS256'],
    isRevoked: isRevoked
}).unless({
    path:[
        {url: /\/api\/v1\/order(.*)/, methods: [`GET`, `OPTIONS`]},
        {url: /\/api\/v1\/product(.*)/, methods: [`GET`, `OPTIONS`]},
        {url: /\/api\/v1\/category(.*)/, methods: [`GET`, `OPTIONS`]},
        {url: /\/public\/uploads(.*)/, methods: [`GET`, `OPTIONS`]},
        `/api/v1/user/login`,
        `/api/v1/order/:userid`,
        `/api/v1/order/add`,
        `/api/v1/user/get/:id`,
        `/api/v1/product/gallery-images/:id`
    ]
})
}

    async function isRevoked(req, payload, done) {
    try {
        // Check if the user is not an admin
        if (!payload.isAdmin) {
            // Token should be revoked
            done(null, true);
        } else {
            // Token is valid
            done(null, false);
        }
    } catch (error) {
        // If an error occurs, treat it as token revocation
        done(error, true);
    }
}


module.exports = authJwt;
