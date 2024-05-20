function errorHandler(err, req, res, next)  {
    if (err.name === `unauthorizedError`)
    {return res.status(401).json({message: err})}

    if (err.name === `validationError`) {return res.status(400).json({message:err})
        
    }

    return res.status(500).json({message:err})
}

module.exports = errorHandler