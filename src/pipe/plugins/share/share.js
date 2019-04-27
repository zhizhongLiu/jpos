const share = weex.requireModule('systemShareModule');

export default {
  text: (contentText = '') => new Promise((resolve, reject) => {
    share.share(contentText, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  image: (imageUrl = '') => new Promise((resolve, reject) => {
    share.shareImage(imageUrl, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),
};