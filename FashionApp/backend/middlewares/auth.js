// middlewares/auth.js

const isLoggedIn = (req, res, next) => {
    console.log(req.user);
    const redirectUrl = req.headers['x-original-url'] || req.originalUrl;
    console.log('Redirect URL:', redirectUrl); 
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=redirectUrl;
        return res.status(401).json({ authenticated:false, message: 'You need to be logged in to perform this action.'});
    }   
    return next();
};
const setRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
  };

module.exports = {isLoggedIn, setRedirectUrl };
  