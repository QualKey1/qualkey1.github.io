/**
 * Get S3 bucket full url
 */
export const transformToAwsUrl = (path: string): string => `${process.env.NEXT_PUBLIC_AWS_URL}/${path}`