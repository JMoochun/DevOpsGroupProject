import passport from "../auth/passport.js";

const requireAuth = passport.authenticate("jwt", { session: false });

export default requireAuth;
