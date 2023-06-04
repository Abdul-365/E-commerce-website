import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './models/userModel';

passport.use(new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
        const user = await User.findOne({ email: username }).exec();
        if (!user) {
            return done(null, false, { message: 'Invalid Username or password' });
        }
        const passwordOK = await user.comparePassword(password);
        if (!passwordOK) {
            return done(null, false, { message: 'Invalid Username or password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
    try {
        await User.findById(id)
            .populate('cart.product')
            .exec(function (err, user) {
                return done(err, user);
             });
    } catch (err) {
        return done(err);
    }
});

module.exports = {
    initialize: passport.initialize(),
    session: passport.session(),
    setUser: (req, res, next) => {
        res.locals.user = req.user;
        return next();
    }
};