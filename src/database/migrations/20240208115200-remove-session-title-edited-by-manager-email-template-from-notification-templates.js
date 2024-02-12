'use strict'
/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const defaultOrgId = queryInterface.sequelize.options.defaultOrgId
		if (!defaultOrgId) {
			throw new Error('Default org ID is undefined. Please make sure it is set in sequelize options.')
		}
		let tempalteFilter = {
			type: 'email',
			code: 'session_title_edited_by_manager_email_template',
			organization_id: defaultOrgId,
		}
		// Delete the unwanted template
		return queryInterface.bulkDelete('notification_templates', tempalteFilter)
	},

	down: async (queryInterface, Sequelize) => {
		const defaultOrgId = queryInterface.sequelize.options.defaultOrgId
		if (!defaultOrgId) {
			throw new Error('Default org ID is undefined. Please make sure it is set in sequelize options.')
		}
		let notificationTemplatesData = [
			{
				type: 'email',
				code: 'session_title_edited_by_manager_email_template',
				subject: 'Update: Changes to Mentoring Session Name',
				body: '<div><p>Dear {name},</p><p>I trust this email finds you well. There has been an update to the mentoring session name. Please review the changes below:<ul><li><strong>Original Session Name::</strong> {originalSessionTitle}</li><li><strong>Revised Session Name:</strong> {revisedSessionTitle}</li></ul><p>We understand that the session name change may impact your session agenda. Thank you for your understanding and continued commitment to mentoring.</p></div>',
				status: 'active',
				created_at: new Date(),
				updated_at: new Date(),
				created_by: null,
				updated_by: null,
				email_footer: 'email_footer',
				email_header: 'email_header',
				organization_id: defaultOrgId,
			},
		]
		return queryInterface.bulkInsert('notification_templates', notificationTemplatesData)
	},
}
