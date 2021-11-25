/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
const Joi = require('joi').extend((require('@joi/date')));

// agents schema
exports.usersSchema = Joi.object({
  first_name: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  last_name: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
  other_name: Joi.string(),
  password: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!_`,/@#\-"=:;~<>'\$%\^&\*\?\|\+\(\)\[\]\{}\.])(?=.{8,})/,
    )
    .trim()
    .required()
    .min(1)
    .error(
      new Error(
        'Password should contain a minimum of 8 characters (upper and lowercase letters, numbers and at least one special character)',
      ),
    ),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().error(
    new Error(
      'Email  not valid',
    ),
  ),
  phone_no: Joi.string()
    .regex(/^\d+[0-9]{10,15}$/)
    .required()
    .error(new Error('Phone number should be at least minimum of 11 digits and maximum 16')),
  address: Joi.string().required().error(new Error('Address must be added')),
  role: Joi.string().valid('agent', 'client').default('none').required()
    .error(
      new Error(
        'Role must be added(either agent or client)',
      ),
    ),
  status: Joi.number().allow(1, 0).default(0),
  block: Joi.boolean().default(false),
  email_verified_at: Joi.date(),
});

// agents schema
exports.listingsSchema = Joi.object({
  location: Joi.string().required().messages({
    'any.required': 'location is required',
  }),
  area: Joi.string().required().messages({
    'any.required': 'area is required',
  }),
  price: Joi.string().required().messages({
    'any.required': 'price is required',
  }),
  category: Joi.string().valid('buy', 'rent').required().messages({
    'any.required': 'category is required',
  }),
  createdAt: Joi.date(),
  features: Joi.array().required().messages({
    'any.required': 'features are required',
  }),
  typeOfProperty: Joi.string().required().messages({
    'any.required': 'type Of Property is required',
  }),
  charges: Joi.object().required().messages({
    'any.required': 'Charges must be added',
  }),
});

// agents schema
exports.bookingsSchema = Joi.object({
  userEmail: Joi.string(),
  listingIds: Joi.array(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  scheduledForInspection: Joi.boolean().default(false),
  fee: Joi.number().default(0),
});

// agents schema
exports.scheduledInspectionsSchema = Joi.object({
  userEmail: Joi.string(),
  bookingId: Joi.string(),
  time: Joi.date().format('YYYY-MM-DD').raw(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
// // target schema (please, im begging you, DO NOT touch this schema @Odogwu)
// exports.targetSchema = Joi.object({
//   target: [Joi.string().required(), Joi.number().required()],
//   milestones: Joi.any()
//     .when('target', {
//       is: Joi.number(),
//       then: Joi.array()
//         .items(
//           Joi.object()
//             .keys({
//               1: Joi.object({ value: Joi.number().less(Joi.ref('target')), achieved: Joi.boolean().default(false) }),
//               2: Joi.object({
//                 value: Joi.number().allow().default('0'),
//                 achieved: Joi.boolean().default(false),
//               }).default(),
//               3: Joi.object({
//                 value: Joi.number().allow().default('0'),
//                 achieved: Joi.boolean().default(false),
//               }).default(),
//               4: Joi.object({
//                 value: Joi.number().allow().default('0').optional(),
//                 achieved: Joi.boolean().default(false).optional(),
//               }).default(),
//             })
//         )
//         .required(),
//       otherwise: Joi.string().required(),
//     }),
//   //milestone: Joi.string().when('type', { is: Joi.string(), then: Joi.required()}),
//   achieved: Joi.boolean().default(false),
// });
// // mission schema
// exports.missionSchema = Joi.object({
//   title: Joi.string().optional(),
//   description: Joi.string().required(),
// });

// // vision schema
// exports.visionSchema = Joi.object({
//   title: Joi.string().optional(),
//   description: Joi.string().required(),
// });

// // likeGoal schema
// exports.likeGoalSchema = Joi.object({
//   goalId: Joi.string().required().messages({
//     'any.required': 'goal id is required',
//   }),
//   userId: Joi.string().required().messages({
//     'any.required': 'user id is required',
//   }),
//   orgId: Joi.string().required().messages({
//     'any.required': 'organization id is required',
//   }),
// });

// // getGoalLikes schema
// exports.getGoalLikesSchema = Joi.object({
//   goalId: Joi.string().required().messages({
//     'any.required': 'goal id is required',
//   }),
//   orgId: Joi.string().required().messages({
//     'any.required': 'organization id is required',
//   }),
// });

// exports.goalReactionSchema = Joi.object({
//   goal_id: Joi.string().required().messages({
//     'any.required': 'goal id is required',
//   }),
//   reactions: Joi.array().items(
//     Joi.object().keys({
//       user_id: Joi.string().required().messages({ 'any.reuired': 'The user_id is a reuired field' }),
//       reaction: Joi.string()
//         .valid('like', 'dislike', 'none')
//         .required()
//         .messages({ messages: 'You need to set a user reaction' }),
//     })
//   ),
//   org_id: Joi.string().required().messages({
//     'any.required': 'organization id is required',
//   }),
// });

// exports.allowedFields = [
//   'category',
//   'description',
//   'due_date',
//   'goal_name',
//   'goal_type',
//   'is_complete',
//   'is_expired',
//   'start_date',
// ];
