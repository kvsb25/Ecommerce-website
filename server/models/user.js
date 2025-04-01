const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
		type: String,
		required: [true, "A Username is required!"],
		unique: [true, "The username already exists! Login if you're already Registered."],
		trim: true,
	},
	password:{
		type: String,
		required: [true, "A password is required!"],
	},
	email:{
		type: String,
		validate: {
		  validator: function(v) {
			return /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(v);
		  },
		  message: props => `${props.value} is not a valid email!`
		},
		required: [true, 'Email address is required.']
	  },
	firstName:{
		type: String,
		required: [true, "Please enter first name."],
		validate: {
			validator: function(v) {
				return v.trim().length > 0;
			},
			message: "First name cannot be empty."
		}
	},
	lastName:{
		type: String,
	},
	phone: {
		type: String,
		required: true,
		unique: true,
		minLength:10,
		maxLength:10
	},
	role:{
		type: String,
		enum: {
			values: ["customer", "vendor"],
			message: '{VALUE} role is not supported'
		},
		required: [true, "Please specify your role."],
		lowercase: true,
		trim: true,
	},
})

module.exports = mongoose.model("user", userSchema);