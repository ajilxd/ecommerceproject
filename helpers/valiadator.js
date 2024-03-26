const joi = require("joi");

const userNameRegex = /^(?!.*\d)[a-zA-Z0-9][a-zA-Z0-9\s]*$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signupSchema = joi.object({
  username: joi.string().required().pattern(userNameRegex).min(3).messages({
    "string.empty": "Username cant be empty",
    "string.base": "Username must be a string",
    "any.required": "Username is required",
    "string.pattern.base": "Enter valid username",
    "string.min": "Minimum 3 characters required for username",
  }),
  email: joi
    .string()
    .email({ tlds: { allow: ["com"] } })
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.empty": "Email cannot be empty ",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
  password: joi.string().min(3).required().pattern(passwordRegex).messages({
    "string.empty": "Password cant be empty",
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
    "string.pattern.base":
      "Password must contain at least one letter,one uppercase,one lowercase,have special characters and one number",
  }),
  retypepassword: joi.string().valid(joi.ref("password")).messages({
    "any.only": "Retyped password must match the password",
  }),
});

const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const categorySchema = joi.object({
  categoryname: joi
    .string()
    .min(3)
    .max(10)
    .regex(/^[a-zA-Z\s]*$/)
    .required()
    .messages({
      "string.base": `categoryname should be a type of 'text'`,
      "string.empty": `categoryname cannot be an empty field`,
      "string.min": `categoryname should have a minimum length of {#limit}`,
      "string.max": `categoryname should have a maximum length of {#limit}`,
      "any.required": `categoryname is a required field`,
      "string.pattern.base": `categoryname can only contain letters and spaces`,
    }),
  status: joi.string().required().messages({
    "any.required": `"status" is a required field`,
  }),
  description: joi
    .string()
    .min(8)
    .regex(/^[a-zA-Z\s]*$/)
    .required()
    .messages({
      "string.base": `"description" should be a type of 'text'`,
      "string.empty": `description cannot be an empty field`,
      "string.min": `description should have a minimum length of {#limit}`,
      "any.required": `description is a required field`,
      "string.pattern.base": `description can only contain letters and spaces`,
    }),
});

// product validation
const productSchema = joi.object({
  productname: joi
    .string()
    .min(3)
    .regex(/^[a-zA-Z\s]*$/)
    .required()
    .messages({
      "string.empty": "Product name cant be empty",
      "any.required": "Product name is required",
      "string.min": "Product name must be at least 3 characters long",
      "string.pattern.base":
        "Product name must only contain letters and spaces",
    }),
  cost: joi
    .string()
    .regex(/^[0-9]*$/)
    .min(1)
    .required()
    .messages({
      "string.empty": "cost cant be empty",
      "string.pattern.base": "Cost must contain only digits",
      "string.min": "Cost must be at least 1 character long",
      "any.required": "Cost is required",
    }),
  color: joi.string().required().messages({
    "string.empty": "Color cant be empty",
    "any.required": "Color is required",
  }),
  size: joi.string().required().messages({
    "any.required": "Size is required",
    "string.empty": "Size cant be empty",
  }),
  brand: joi.string().min(3).messages({
    "string.min": "Brand must be at least 3 characters long",
    "string.empty": "brand name cant be empty",
  }),
  description: joi.string().required().messages({
    "any.required": "Description is required",
    "string.empty": "description cant be empty",
  }),
  price: joi
    .string()
    .regex(/^[0-9]*$/)
    .required()
    .messages({
      "string.pattern.base": "Price must contain only digits",
      "any.required": "Price is required",
    }),
  status: joi.string().required().messages({
    "any.required": "Status is required",
    "string.empty": "status cant be empty",
  }),
  categories: joi.string(),
  quantity: joi
    .string()
    .regex(/^[0-9]*$/)
    .required()
    .messages({
      "string.pattern.base": "quantity must contain only digits",
      "any.required": "Quantity is required",
    }),
});

//edit address

const addressSchema = joi.object({
  name: joi.string().required().pattern(userNameRegex).min(3).messages({
    "string.empty": "Username cant be empty",
    "string.base": "Username must be a string",
    "any.required": "Username is required",
    "string.pattern.base": "Enter valid username",
    "string.min": "Minimum 3 characters required for username",
  }),
  type: joi
    .string()
    .min(2)
    .regex(/^[a-zA-Z\s]*$/)
    .required()
    .messages({
      "string.empty": "Type cannot be empty",
      "string.min": "Type must have at least 2 characters",
      "string.base": "Type must be a string",
      "string.pattern.base": "Type must contain only letters and spaces",
      "any.required": "Type is required",
    }),
  addressline: joi.string().min(4).required().messages({
    "string.empty": "Address line cannot be empty",
    "string.min": "Address line must have at least 4 characters",
    "any.required": "Address line is required",
  }),
  country: joi
    .string()
    .min(2)
    .regex(/^[a-zA-Z]*$/)
    .required()
    .messages({
      "string.empty": "Country cannot be empty",
      "string.min": "Country must have at least 2 characters",
      "string.base": "Country must be a string",
      "string.pattern.base": "Country must contain only letters",
      "any.required": "Country is required",
    }),
  state: joi.string().min(2).required().messages({
    "string.empty": "State cannot be empty",
    "string.min": "State must have at least 2 characters",
    "any.required": "State is required",
  }),
  city: joi
    .string()
    .min(2)
    .regex(/^[a-zA-Z]*$/)
    .required()
    .messages({
      "string.empty": "City cannot be empty",
      "string.min": "City must have at least 2 characters",
      "string.base": "City must be a string",
      "string.pattern.base": "City must contain only letters",
      "any.required": "City is required",
    }),
  zipcode: joi.string().required().messages({
    "string.empty": "Zipcode cannot be empty",
    "any.required": "Zipcode is required",
  }),
  mobileno: joi
    .string()
    .regex(/^(?:\+91)?[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number cannot be empty",
      "string.base": "Mobile number must be a string",
      "any.required": "Mobile number is required",
      "string.pattern.base": "Enter a valid mobile number",
    }),
});

// edit profile

const editProfileSchema = joi.object({
  name: joi.string().required().pattern(userNameRegex).min(3).messages({
    "string.empty": "Username cannot be empty",
    "string.base": "Username must be a string",
    "any.required": "Username is required",
    "string.pattern.base": "Enter a valid username",
    "string.min": "Username must have at least 3 characters",
  }),
  mobileno: joi
    .string()
    .regex(/^(?:\+91)?[0-9]{10}$/) // Allows optional +91 prefix followed by 10 digits
    .required()
    .messages({
      "string.empty": "Mobile number cannot be empty",
      "string.base": "Mobile number must be a string",
      "any.required": "Mobile number is required",
      "string.pattern.base": "Enter a valid mobile number",
    }),
  email: joi
    .string()
    .email({ tlds: { allow: ["com"] } })
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "any.required": "Email is required",
    }),
  gender: joi.string().required().messages({
    "any.required": "Gender is required",
  }),
});

const editPasswordSchema = joi.object({
  oldpassword: joi.string().required().messages({
    "string.empty": "Password cant be empty",
    "any.required": "Password is required",
  }),
  confirmnewpassword: joi
    .string()
    .min(3)
    .required()
    .pattern(passwordRegex)
    .messages({
      "string.empty": "Password cant be empty",
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must contain at least one letter,one uppercase,one lowercase,have special characters and one number",
    }),
});

const changePasswordSchema = joi.object({
  password: joi.string().min(3).required().pattern(passwordRegex).messages({
    "string.empty": "Password cant be empty",
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
    "string.pattern.base":
      "Password must contain at least one letter,one uppercase,one lowercase,have special characters and one number",
  }),
});

const reviewValidationSchema = joi
  .object({
    rating: joi.number().integer().min(1).max(5).required().messages({
      "number.base": "Rating must be a number.",
      "number.integer": "Rating must be an integer.",
      "number.min": "Rating must be at least 1.",
      "number.max": "Rating must be at most 5.",
      "any.required": "Rating is required.",
    }),
    review: joi
      .string()
      .required()
      .regex(/^[a-zA-Z\s]*$/)
      .messages({
        "string.empty": "Review cannot be empty.",
        "string.pattern.base":
          "Review must contain only characters and spaces.",
        "any.required": "Review is required.",
      }),
    userId: joi.string().required().messages({
      "string.empty": "User ID cannot be empty.",
      "any.required": "User ID is required.",
    }),
    productId: joi.string().required().messages({
      "string.empty": "Product ID cannot be empty.",
      "any.required": "Product ID is required.",
    }),
  })
  .options({ abortEarly: false });

// coupon


const couponSchema = joi.object({
  name: joi.string().min(3).required().messages({
    'string.min': 'The name must be at least 3 characters long.',
    'any.required': 'The name field is required.'
  }),
  code: joi.string().min(3).required().messages({
    'string.min': 'The code must be at least 3 characters long.',
    'any.required': 'The code field is required.'
  }),
  discountAmount: joi.string().regex(/^[0-9]*$/).required().messages({
    'string.pattern.base': 'Please provide a valid discount amount (must be a number).',
    'any.required': 'The discount amount field is required.'
  }),
  criteriaAmount: joi.string().regex(/^[0-9]*$/).required().messages({
    'string.pattern.base': 'Please provide a valid criteria amount (must be a number).',
    'any.required': 'The criteria amount field is required.'
  }),
  limit: joi.string().regex(/^[0-9]*$/).required().messages({
    'string.pattern.base': 'Please provide a valid limit (must be a number).',
    'any.required': 'The limit field is required.'
  }),
  expiryDate: joi.date().iso().min('2024-01-01').messages({
    'date.base': 'Expiry date must be a valid date in ISO 8601 format (e.g., YYYY-MM-DD).',
    'date.min': 'Expiry date cannot be before 2024.'
}),
  status: joi.string()
});

const offerSchema = joi.object({
  name: joi.string().min(3).required().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'any.required': 'Name is required.'
  }),
  discountpercentage: joi.string().regex(/^[0-9]*$/).required().messages({
    'string.pattern.base': 'Discount percentage must contain only digits (0-9).',
    'any.required': 'Discount percentage is required.'
  }),
  status: joi.string(),
  expirydate: joi.date().iso().min('2024-01-01').messages({
    'date.base': 'Expiry date must be a valid date in ISO 8601 format (e.g., YYYY-MM-DD).',
    'date.min': 'Expiry date cannot be before 2024.'
  }),
  description: joi.string().required().messages({
    'any.required': 'Description is required.'
  }),
  category: joi.string(),
  image: joi.string(),
  offerid:joi.string(),
  type:joi.string(),
  product:joi.string()
});




module.exports = {
  signupSchema,
  signinSchema,
  categorySchema,
  productSchema,
  addressSchema,
  editProfileSchema,
  editPasswordSchema,
  changePasswordSchema,
  reviewValidationSchema,
  couponSchema,
  offerSchema 
};
