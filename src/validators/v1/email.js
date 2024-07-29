module.exports = {
	send: (req) => {
		req.checkBody('type')
			.trim()
			.notEmpty()
			.withMessage('email field is empty')
			.matches(/^[A-Za-z ]+$/)
			.withMessage('This field can only contain alphabets')

		req.checkBody('email.to')
			.notEmpty()
			.withMessage('email.to field is empty')
			.custom((emailIds) => emailValidation(emailIds))
			.withMessage('invalid email ids')
		req.checkBody('email.attachments').optional().notEmpty().withMessage('email.attachments field is empty')
		if (emailValidation.attachments) {
			req.checkBody('email.attachments.*.url')
				.notEmpty()
				.withMessage('attachments.url field is empty')
				.isURL()
				.withMessage('attachments.url is invalid')

			req.checkBody('email.attachments.*.filename')
				.notEmpty()
				.withMessage('attachments.filename field is empty')
				.isAlphanumeric('en-US', { ignore: '-_' })
				.withMessage('attachments.filename is invalid')
			req.checkBody('email.attachments.*.filename')
				.notEmpty()
				.withMessage('attachments.type field is empty')
				.isAlphanumeric('en-US', { ignore: '/' })
				.withMessage('attachments.type is invalid')
		}
	},
}

function emailValidation(emailIds) {
	let isEmailValid = true
	let emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	let emails = emailIds.split(',')

	if (Array.isArray(emails)) {
		for (var i = 0; emails.length > i; i++) {
			let valid = emailRegex.test(emails[i])

			if (!valid) {
				isEmailValid = false
				return
			}
		}
	}

	return isEmailValid
}
