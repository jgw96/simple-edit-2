

let ctx = null;
let canvas = null;

let filter = null;

export const init = async (canvasRef: HTMLCanvasElement, context: any) => {
  if (canvasRef && context) {
    canvas = canvasRef;
    ctx = context;

    // @ts-expect-error
    await import("./webgl.js");

    filter = new (window as any).WebGLImageFilter();
  }
};

export const obj = {

  async doWebGL(type, canvasImage, width, height, amount) {
    if (amount) {
      filter.addFilter(type, amount);
    }
    else {
      filter.addFilter(type);
    }

    this.drawImage(canvasImage);

    const filtered = filter.apply(canvas);

    this.drawImage(filtered);

    filter.reset();
  },

  drawImage(image) {
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);
  },

  loadImage(imageData, width, height) {
    this.drawImage(imageData, width, height);
  },

  async getBlob(imageData, width, height) {
    this.offscreen.width = width;
    this.offscreen.height = height;

    ctx = this.offscreen.getContext("2d");

    ctx.drawImage(imageData, 0, 0, width, height);

    return this.offscreen.convertToBlob();
  },

  blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function (e) { callback(e.target.result); }
    a.readAsDataURL(blob);
  },

  async doManualCrop(image, initialWidth, initialHeight, width, height) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image, 0, 0, width, height,
      0, 0, initialWidth, initialHeight);

    return canvas.convertToBlob();
  },

  async doAI() {
    const blob = await canvas.convertToBlob();

    return new Promise((resolve, reject) => {
      this.blobToDataURL(blob, async (dataURL) => {
        const splitData = dataURL.split(',')[1];

        const bytes = self.atob(splitData);
        const buf = new ArrayBuffer(bytes.length);
        let byteArr = new Uint8Array(buf);

        for (var i = 0; i < bytes.length; i++) {
          byteArr[i] = bytes.charCodeAt(i);
        }

        let data = null;

        try {
          const response = await fetch(`https://westus2.api.cognitive.microsoft.com/vision/v3.1/generateThumbnail?width=200&height=200&smartCropping=true`, {
            headers: {
              "Ocp-Apim-Subscription-Key": "d930861b5bba49e5939b843f9c4e5846",
              "Content-Type": "application/octet-stream"
            },
            method: "POST",
            body: byteArr
          });
          data = await response.blob();

          if (data.type !== "application/json") {
            resolve(data);
          }

        } catch (error) {
          console.error(error, error.message);
          reject(error);
        }
      })
    })
  }
};