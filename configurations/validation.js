import {body} from 'express-validator'

// validating staff registration 
let validation = [
    // validation
    body('username').trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('password').isLength({min:5}).withMessage('The Password must be at least 5 characters long'),
]

export const valid = {validation : validation}
