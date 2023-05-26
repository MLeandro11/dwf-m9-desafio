import Airtable from 'airtable'

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});
export const airtableBase = Airtable.base('app0M1uCuIbb75Epw');