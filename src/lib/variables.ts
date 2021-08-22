export const variables = {
    DB_URI: import.meta.env.VITE_DB_URI,
    OTHER_URI: process.env.VITE_DB_URI,
    OTHER_URI_2: process.env.DB_URI
}