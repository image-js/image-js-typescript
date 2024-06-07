import { Image } from "../../Image";
import { Stack } from "../../Stack";
import { fromMask } from "../../roi";
/**
 *
 * @param stack
 */
export function getROI(stack:Stack){
  if(stack.colorModel  !== "GREY"){
    stack.map((image)=>image.convertColor("GREY"));
  }
  let image = stack.maxImage();
  if(image.colorModel !== 'GREY') {
    image = image.convertColor("GREY");
  }
  const rois = fromMask(image.threshold()).getRois();
    const stackGrays = new Map<number,number[]>();
    for(const roi of rois){
      const stackAvgs = [];
      for(const image of stack){
        const cropped = image.crop({origin:roi.origin,width:roi.width,height:roi.height});
        //gets value from one channel since it is grayscaled.
        stackAvgs.push(cropped.mean()[0]);
      }
    stackGrays.set(roi.id,stackAvgs);
    }
  return stackGrays;
//console.log(stackGrays);
}