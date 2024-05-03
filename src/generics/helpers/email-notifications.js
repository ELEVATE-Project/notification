/**
 * name : email-notifications
 * author : Rakesh Kumar
 * Date : 03-Nov-2021
 * Description : Contains email notifications related data
 */

//Dependencies
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const logQueries = require('../../database/queries/log')
const request = require('request')

/**
 * Send Email
 * @method
 * @name sendEmail
 * @param  {Object} params - contains email information for sending email
 * @param  {String} params.from - email id of the sender
 * @param  {String} params.to - email id of the receiver
 * @param  {String} params.subject - subject of the email
 * @param  {String} params.body - contains email content
 * @param  {String} params.cc - contains the cc of the email
 * @returns {JSON} Returns response of the email sending information
 */

/**
 * Fetches a file from a given URL.
 * @param {Object} fileUrl - The URL object containing information about the file.
 * @param {string} fileUrl.url - The URL of the file to fetch.
 * @param {string} fileUrl.filename - The name of the file.
 * @returns {Promise<Object>} A promise that resolves with an object containing the file content and filename.
 * @throws {Error} If an error occurs during the file fetch operation.
 */
async function fetchFileByUrl(fileUrl) {
	try {
		const response = await new Promise((resolve, reject) => {
			request(fileUrl.url, { encoding: null }, (err, res, body) => {
				if (err) {
					reject(err)
				} else if (res.statusCode === 400 || res.statusCode >= 500) {
					// Handle 400 Bad Request and server errors
					reject(new Error(`Request failed with status code ${res.statusCode}`))
				} else {
					resolve({ content: body, filename: fileUrl.filename })
				}
			})
		})
		return response
	} catch (error) {
		throw new Error('Error fetching file: ' + error.message)
	}
}

async function sendEmail(params) {
	try {
		let attachments = []
		let errorMeta = {}
		try {
			if (params.attachments && params.attachments.length > 0) {
				const processAttachment = async (attachment) => {
					const attachmentContent = await fetchFileByUrl(attachment)
					return {
						content: Buffer.from(attachmentContent.content).toString('base64'),
						filename: attachment.filename,
						type: attachment.type,
					}
				}

				if (params.attachments.length === 1) {
					attachments.push(await processAttachment(params.attachments[0]))
				} else {
					attachments = await Promise.all(params.attachments.map(processAttachment))
				}
			}
		} catch (error) {
			errorMeta = {
				attachments: { message: error.message },
			}
		}
		let fromMail = process.env.SENDGRID_FROM_MAIL

		if (params.from) {
			fromMail = params.from
		}
		const to = params.to.split(',')

		let message = {
			from: fromMail, // sender address
			to: to, // list of receivers
			subject: params.subject, // Subject line
			html: params.body,
			attachments: attachments,
		}
		if (params.cc) {
			message['cc'] = params.cc.split(',')
		}
		if (params.replyTo) {
			message['replyTo'] = params.replyTo
		}
		try {
			const res = await sgMail.send(message)
			errorResponse = {
				email: to,
				response_code: Number(res[0].statusCode),
				meta: errorMeta,
			}
			await logQueries.createLog(errorResponse)
		} catch (error) {
			errorResponse = {
				email: to,
				response_code: Number(error?.code),
				error: error?.response,
				status: 'FAILED',
				meta: errorMeta,
			}
			await logQueries.createLog(errorResponse)
			if (error.response) {
				return error
			}
		}
		return {
			status: 'success',
			message: 'successfully mail sent',
		}
	} catch (error) {
		console.log(error)
		return {
			status: 'failed',
			message: 'Mail server is down, please try after some time',
			errorObject: error,
		}
	}
}

module.exports = {
	sendEmail: sendEmail,
}
