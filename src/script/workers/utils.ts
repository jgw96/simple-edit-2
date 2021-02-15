// resize image by scale
export const getDrawImageParams = (image, scale) => {

  const {naturalWidth: imageWidth, naturalHeight: imageHeight} = image;

  return {
    sx: 0,
    sy: 0,
    sWidth: imageWidth,
    sHeight: imageHeight,
    dx: 0,
    dy: 0,
    dWidth: imageWidth * scale,
    dHeight: imageHeight * scale,
  };
};