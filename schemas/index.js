const Joi = require('joi');

// agents schema
exports.agentSchema = Joi.object({
  first_name: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  last_name: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
    'any.required': 'Email is required',
  }),
  phone_no: Joi.number().required().messages({
    'any.required': 'Phone number is required',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Address must be added',
  }),
  role: Joi.string().default('Agent'),
  status: Joi.number().allow(1, 0).default(0),
  block: Joi.boolean().default(false),
  email_verified_at: Joi.date(),
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
