import { RNS3 } from 'react-native-aws3';
import { getData } from "../storage";
import config from '../../config';

export async function uploadToS3(uri, fileExtension, width, height, size) {
  const userId = JSON.parse(await getData('userId'))
  const extension = fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'JPEG' : 'PNG'
  const epochSeconds = parseInt(new Date().getTime() / 1000)
  const file = {
    uri,
    name: `_${epochSeconds}.${fileExtension}`,
    type: `image/${fileExtension}`
  }
  
  const options = {
    acl: "private",
    keyPrefix: `user_${userId}`,
    bucket: config.aws.bucket,
    region: config.aws.region,
    accessKey: config.aws.accessKeyId,
    secretKey: config.aws.secretAccessKey,
    successActionStatus: 201,
  }
  const url = await RNS3.put(file, options).then((response) => {
    return response.body.postResponse.location
  }).catch(error => console.log(error))
  return url
}
