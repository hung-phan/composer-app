export namespace DASHBOARD_CONFIG {
  export const bucketName = process.env.DASHBOARD_BUCKET_NAME || 'dashboard_bucket';
  export const indexName = process.env.DASHBOARD_INDEX_NAME || 'dashboard_index';
}

export const ELASTIC_SEARCH_HOST = process.env.ELASTIC_SEARCH_HOST;

export const AWS_CONFIG = {
  region: process.env.AWS_REGION,
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_KEY,
};
