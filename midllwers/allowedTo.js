const AppError = require("../Utils/AppError");

module.exports = (...roles) => {
    console.log(roles);

    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)){
            return next(AppError('this role is not authorized',401))

        }
         next()
    }
}