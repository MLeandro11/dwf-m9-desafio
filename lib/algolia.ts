import algoliasearch from "algoliasearch";

export const clientAlgolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
