import type { RequestHandler } from '@sveltejs/kit';

import sgMail from '@sendgrid/mail';

import { variables } from '$lib/variables';
import { EMAIL_REGEX } from '$/lib/constants';

export const post: RequestHandler = async (req) => {
    const { email, message } = JSON.parse(req.body as string) as { email: string, message: string };
    if (!email || !message || !EMAIL_REGEX.test(email)) {
        return {
            status: 422,
            body: { error: 'Email and/or message invalid' }
        };
    }
    try {
        sgMail.setApiKey(variables.API_KEY as string);
        const msg = {
            to: variables.EMAIL_TO as string,
            from: variables.EMAIL_FROM as string,
            subject: `Message from ${email}`,
            text: message,
            html: `<strong>${message}</strong>`
        };
        await sgMail.send(msg);
        return { body: { response: 'Message sent. We\'ll respond as soon as possible.' } };
    } catch (e) {
        return {
            status: 500,
            body: { error: 'Something went wrong. Please try again later' }
        };
    }
}

