const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export default asyncHandler;

// Alternative implementation using Promise
// const asyncHandler = (fn) => { async (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch((err) => next(err));
// }}
