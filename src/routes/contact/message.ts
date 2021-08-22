import type { RequestHandler } from '@sveltejs/kit';

import { MongoClient } from 'mongodb';

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
        const client = await MongoClient.connect(variables.DB_URI as string);
        const db = client.db();
        await db.collection('messages').insertOne({ email, message });
        client.close();
        return {
            status: 200,
            body: { response: 'Message sent successfully '}
        };
    } catch (e) {
        return {
            status: 500,
            body: { error: 'Something went wrong. Please try again later' }
        };
    }
}

