
import type { Image } from '../Image.js';

import {encode} from './encode.js';
import type {ImageFormat} from './encode.js';


/**
 * Converts image into a base64 URL string.
 * @param image - Image to get base64 encoding from.
 * @param format - Image format.
 * @returns base64 string.
 */
export function encodeBase64(image:Image,format:ImageFormat){
  const isNode = typeof window === 'undefined' && typeof document === 'undefined';
  if(isNode){
    return encodeBase64InNode(image,format);
  }else{
    return encodeBase64InBrowser(image,format);
  }
}


/**
 * Converts image into a base64 URL string in NodeJs.
 * @param image - Image to get base64 encoding from.
 * @param format - Image format.
 * @returns base64 string.
 */
function encodeBase64InNode(image:Image,format:ImageFormat){
  const encodedData = encode(image,{format});
  return `data:image/${format};base64,${(Buffer.from(encodedData)
    .toString('base64'))}`
}
/**
 *  Converts image into a base64 URL string in browser.
 * @param image - Image to get base64 encoding from.
 * @param format - Image format.
 * @returns base64 string.
 */
function encodeBase64InBrowser(image:Image,format:ImageFormat){
  const buffer = encode(image,{format});  
  let binaryString = '';
  for(const el of buffer){
    binaryString += String.fromCodePoint(el);
  }
  const base64String = btoa(binaryString);
  const dataURL = `data:image/${format};base64,${base64String}`; 
 return dataURL;
}


