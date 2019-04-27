const camera = weex.requireModule('photoModule');

export default {
  take: () => new Promise((resolve, reject) => {
    camera.capturePhoto(e => {
      e.code === '0000' ? resolve({
        image: 'data:image/png;base64,' + e.data.imageBase64,
        base64: e.data.imageBase64,
        urlImage: e.data.urlImage,
        sign: e.data.imageSign,
      }) : reject(e);
    });
  }).handle(),

  crop: (options = {}) => new Promise((resolve, reject) => {
    // crop: true 裁剪
    camera.capturePhotoWithParams(options, e => {
      e.code === '0000' ? resolve({
        image: 'data:image/png;base64,' + e.data.imageBase64,
        base64: e.data.imageBase64,
        urlImage: e.data.urlImage,
        sign: e.data.imageSign,
      }) : reject(e);
    });
  }).handle(),

  pick: () => new Promise((resolve, reject) => {
    camera.selectPhoto(e => {
      e.code === '0000' ? resolve({
        image: 'data:image/png;base64,' + e.data.imageBase64,
        base64: e.data.imageBase64,
        urlImage: e.data.urlImage,
        sign: e.data.imageSign,
      }) : reject(e);
    });
  }).handle(),

    pickCrop: (options = {crop: false}) => new Promise((resolve, reject) => {
        camera.selectPhotoWithParams(options, e => {
            e.code === '0000' ? resolve({
                image: 'data:image/png;base64,' + e.data.imageBase64,
                base64: e.data.imageBase64,
                urlImage: e.data.urlImage,
                sign: e.data.imageSign,
            }) : reject(e);
        });
    }).handle(),
};
