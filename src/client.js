'use strict';

const rp = require('request-promise');

const AIQ_MAILER_ENDPOINT = process.env.AIQ_MAILER_ENDPOINT;

if (!AIQ_MAILER_ENDPOINT) {
    throw new Error('Environment variable for aiq-mailer endpoint not set');
}

const AIQMailer = (() => {

    return {
        Mail,
        getEmails
    };

    function Mail(mailId /*Email name*/ , opts) {
        opts = opts || {};

        if (typeof mailId === 'object' || typeof mailId === 'undefined') {
            throw new Error('MailId must be a string');
        }

        this.mailId = mailId;
        this.recipients = opts.recipients || [];
        this.subject = opts.subject || [];
        this.params = opts.params || null;

        return this;
    }

    Mail.prototype.addRecipient = (r) => {
        this.recipients.push(r);
    };

    Mail.prototype.addRecipients = (r) => {
        this.recipients = this.recipients.concat(r);
    };

    Mail.prototype.send = () => {
        let self = this;
        const opts = {
            uri: `${AIQ_MAILER_ENDPOINT}/emails/${this.mailId}`,
            method: 'POST',
            body: {
                subject: self.subject,
                recipients: self.recipients,
                params: self.params
            }
        };

        return rp(opts);
    };

    function getEmails() {
        return rp(`${AIQ_MAILER_ENDPOINT}/emails`);
    }

})();

module.exports = AIQMailer;