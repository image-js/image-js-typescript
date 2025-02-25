
import { vi } from "vitest";

import { createRgbaImage } from "../../../test/testUtils.js";
import { encode } from "../encode.js";
import { encodeBase64 } from "../encodeBase64.js";

test("basic image (png)",()=>{
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 0, 255, 0],
    [0, 255, 255, 255, 0],
    [255, 0, 255, 0, 255],
  ]);
  const base64Url = encodeBase64(image,'png');

  expect(base64Url).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAAAAACoBHk5AAAAFklEQVR4XmNggID///+DSCCEskHM/wCAnQr2TY5mOAAAAABJRU5ErkJggg==");
});

test("basic image 2 (jpeg)",()=>{
  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 255, 255, 255],
  ]);
  const format = 'jpeg'
  const base64 = encodeBase64(image,format);
  const base64Data = Buffer.from(encode(image,{format}))
  .toString('base64');
  expect(typeof base64).toBe('string');
  expect(base64Data).toBe(base64.slice( base64.indexOf(',') + 1));
});

test("legacy image-js test",()=>{
  const image = createRgbaImage([[
    255,
    0,
    0,
    255, // red
    0,
    255,
    0, 
    255,// green
    0,
    0,
    255, 
    255 // blue
  ],[255,
      255,
      0, 
      255,// yellow
      255,
      0,
      255, 
      255,// magenta
      0,
      255,
      255, 
      255,// cyan
    ],[ 0,
        0,
       0, 
        255,// black
        255,
        255,
        255,
        255, // white
        127,
        127,
        127,
        255,//grey 
        ]]);
      const format = 'jpeg';  
      const url = encodeBase64(image,format); 
      const base64Data = Buffer.from(encode(image,{format}))
      .toString('base64')
      expect(typeof url).toBe('string');
      expect(base64Data).toBe(url.slice(url.indexOf(',') + 1));
})
test("browser testing",()=>{
  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 255, 255, 255],
  ]);
  const base64Node = encodeBase64(image,'jpg');
 vi.stubGlobal('window',()=>{
  const base64Browser = encodeBase64(image,'jpg');
  expect(base64Browser).not.toBe(base64Node);
 })
 vi.stubGlobal('document',()=>{
  const base64Browser = encodeBase64(image,'jpg');
  expect(base64Browser).not.toBe(base64Node);
 })
})
