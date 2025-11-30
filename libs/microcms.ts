import { createClient } from 'microcms-js-sdk';
import type { MicroCMSQueries, MicroCMSImage, MicroCMSDate } from 'microcms-js-sdk';

// Environment variables check
if (!process.env.MICROCMS_SERVICE_DOMAIN) {
    throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
    throw new Error('MICROCMS_API_KEY is required');
}

// Initialize Client
export const client = createClient({
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: process.env.MICROCMS_API_KEY,
});

// Types
export type Profile = {
    id: string;
    name: string;
    description: string;
    image?: MicroCMSImage;
} & MicroCMSDate;

export type Work = {
    id: string;
    title: string;
    description: string;
    url?: string;
    image?: MicroCMSImage;
    technology?: string;
} & MicroCMSDate;

export type Active = {
    id: string;
    title: string;
    date: string;
    description?: string;
    url?: string;
    label?: string;
    image?: MicroCMSImage;
} & MicroCMSDate;

// Fetch Functions
// Fetch Functions
export const getProfile = async (queries?: MicroCMSQueries) => {
    try {
        const data = await client.get<Profile>({ endpoint: 'profile', contentId: 'hh0e-9wb3o', queries });
        return data;
    } catch (error) {
        console.error("Error fetching Profile:", error);
        throw error;
    }
};

export const getWorks = async (queries?: MicroCMSQueries) => {
    try {
        return await client.getList<Work>({ endpoint: 'works', queries });
    } catch (error) {
        console.error("Error fetching Works:", error);
        throw error;
    }
};

export const getActive = async (queries?: MicroCMSQueries) => {
    try {
        return await client.getList<Active>({ endpoint: 'active', queries });
    } catch (error) {
        console.error("Error fetching Active:", error);
        throw error;
    }
};
