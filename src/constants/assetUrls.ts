const S3_ASSET_BASE_URL = 'https://solve-s3-storage.s3.ap-northeast-2.amazonaws.com'

export const getS3AssetUrl = (fileName: string) => `${S3_ASSET_BASE_URL}/${fileName}`
