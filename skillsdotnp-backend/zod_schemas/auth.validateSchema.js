const { z } = require('zod');

const authSchema = z.object({
    body: z.object({
        username: z
            .string({ required_error: 'Username is required' })
            .optional(),
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email'),
        password: z.string({ required_error: 'Password is required' }),
    }),
});

module.exports = { authSchema };
