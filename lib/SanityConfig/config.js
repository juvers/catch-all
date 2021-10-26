export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tkaznk7b',
  apiVersion: '2021-10-05',
  useCdn: process.env.NODE_ENV === 'production',
};
