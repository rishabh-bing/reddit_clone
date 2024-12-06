const config = require("../../../config");

const emailType = config.email.emailType;

const TestEmailConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: config.email.id,
        pass: config.email.token,
    },
};

const SelectedMail = {
    test: TestEmailConfig,
};

module.exports = { emailConfig: SelectedMail[emailType] };
