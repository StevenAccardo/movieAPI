//We define this, so we don't have to add try-catch blocks to ever single route handler
//However, we had to turn it into a function factory because express expects a reference to a function to be passed, therefore we can't execute the route handler directly, so we have to return a standard express async route handler from this function, which when executed, will invoke the handler() passed into it, which will then execute the code within each route.

//Using express-async-errors library instead of this middleware, but if you ever need to use this, you just wrap the route handler in the function invocation, and this middleware will be in play.
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    }
    catch(err) {
      next(err);
    }
  }
}
