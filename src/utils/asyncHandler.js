
const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next)
    } catch (error) {
        next(error)
    }
}

module.exports = asyncHandler
