const ocr = weex.requireModule('ocrModule');

export default {
  cardIdSideFront: () => new Promise((resolve, reject) => {
    ocr.cardIdSideFront(e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  cardIdSideBack: () => new Promise((resolve, reject) => {
    ocr.cardIdSideBack(e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  cardIdOnlyNameId: () => new Promise((resolve, reject) => {
    ocr.cardIdOnlyNameId(e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  scanBankCard: options => new Promise((resolve, reject) => {
    ocr.scanBankCard(options, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  startLiveness: options => new Promise((resolve, reject) => {
    ocr.startLiveness(options, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),
  // 证通身份证正面
  scanIdFront: () => new Promise((resolve, reject) => {
    ocr.scanIdFront(e => {
        e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }),

  // 证通身份证反面
  scanIdBack: () => new Promise((resolve, reject) => {
      ocr.scanIdBack(e => {
          e.code === '0000' ? resolve(e.data) : reject(e);
      });
  }),

  // 证通扫描银行卡
  scanBankCardInfo: options => new Promise((resolve, reject) => {
      ocr.scanBankCardInfo(options, e => {
          e.code === '0000' ? resolve(e.data) : reject(e);
      });
  }),

  // 证通活体检测
  scanLiveness: () => new Promise((resolve, reject) => {
      ocr.scanLiveness(e => {
          e.code === '0000' ? resolve(e.data) : reject(e);
      });
  }),

  isSupport: !!ocr.scanLiveness,
};