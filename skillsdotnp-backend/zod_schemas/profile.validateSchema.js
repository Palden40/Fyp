const { z } = require('zod');

const profilePostSchema = z.object({
    body: z.object({
        first_name: z.string().nonempty('First name is required').optional(),
        last_name: z.string().nonempty('Last name is required').optional(),
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format')
            .optional(),
        username: z.string().nonempty('Username is required').optional(),
        phone_number: z
            .string({ required_error: 'phone number is required' })
            .refine(
                (value) => value.length === 10,
                'Phone number must be 10 digits'
            )
            .refine(
                (value) => value.match(/^[0-9]+$/),
                'Phone number must be digits'
            )
            .optional(),
        country: z.string().optional(),
        address: z.string().optional(),
        status: z.string().optional(),
        date_of_birth: z.string().optional(),
        gender: z.string().optional(),
        profile_picture: z.string().optional(),
        bio: z.string().optional(),
        socials: z.string().optional(),
        tier_id: z
            .number()
            .refine((value) => [1, 2, 3].includes(value), {
                message: 'Invalid tier_id value',
                path: ['tier_id'],
            })
            .optional(),
        user_id: z.string().optional(),
    }),
});

const profileUpdateSchema = profilePostSchema.partial();

// const profileUpdateSchema = z.object({
//     body: z.object({
//         first_name: z.string().nonempty('First name is required').optional(),
//         last_name: z.string().nonempty('Last name is required').optional(),
//         email: z
//             .string({ required_error: 'Email is required' })
//             .email('Invalid email format')
//             .optional(),
//         username: z.string().nonempty('Username is required').optional(),
//         phone_number: z
//             .string({ required_error: 'Phone number is required' })
//             .refine(
//                 (value) => value.length === 10,
//                 'Phone number must be 10 digits'
//             )
//             .refine(
//                 (value) => value.match(/^[0-9]+$/),
//                 'Phone number must be digits'
//             )
//             .optional(),
//         country: z.string().optional(),
//         address: z.string().optional(),
//         status: z.string().optional(),
//         date_of_birth: z.string().optional(),
//         gender: z.string().optional(),
//         profile_picture: z.string().optional(),
//         bio: z.string().optional(),
//         socials: z.string().optional(),
//         tier_id: z.enum([1, 2, 3]).optional(),
//         user_id: z.string().optional(),
//     }),
// });

module.exports = { profilePostSchema, profileUpdateSchema };
