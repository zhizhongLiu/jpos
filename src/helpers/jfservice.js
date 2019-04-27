const jfservice = weex.requireModule('jfServiceModule');
const openpay = weex.requireModule('openPayModule');
import location from 'plugins/location';
import config from 'config/env.config'
import auth from './auth';

export default {
  md5: string => new Promise((resolve, reject) => {
    jfservice.md5(string, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  getUUID: mobileNo => new Promise((resolve, reject) => {
    jfservice.getUUID(mobileNo, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  isUpdate () {
      jfservice.isUpdate();
  },

  pay: params => location.get().then(loc => new Promise((resolve, reject) => {
    let payInfo = {
      amount: '', // 金额
      merchantOrderId: '', // 订单信息
      goodsDesc: '', // 商品描述(暂不传)
      merchantCode: '123456', // 商户号(可不传)
      merchantName: '', // 店铺名
      merchantMessage: '', //认证参数
      mobileNo: '', // 收款人
      fromMobileNo: '', // 付款人

      orgCode: '170330165348', // 机构号

      payType: '1,2', // 支付类型 '0'表示只支持扫码  '1'表示只支持刷卡  '01'表示都支持
      latitude: loc.latitude,
      longitude: loc.longitude,

      ...params
    };

    setPayEnvEnv().then(() => {
      openpay.pay(payInfo, result => {
        result.code === '0000' && result.data.status === '支付成功'
        ? resolve(result.data.status)
        : reject(result.data.status);
      });
    });
  })).handle(),

  query: () => new Promise((resolve, reject) => {
    auth.getToken().then(info => {
      setPayEnvEnv().then(() => {
        openpay.queryBalance({
          mobileNo: info.mobileNo,
          merchantCode: '123456',
          orgCode: '170330165348',
        }, result => {
          result.code === '0000' && result.data.status === '查询成功'
          ? resolve(JSON.parse(result.data.result.message))
          : reject(result.data.status);
        });
      }).catch(function (error) {
        reject('环境设置失败！')
      });
    }).catch(function (error) {
      reject('用户未登录！')
    });
  }).handle(),
};

let PAY_ENV_SET_STATUS = false; // 是否设置环境

const setPayEnvEnv = () => new Promise((resolve, reject) => {
  if (PAY_ENV_SET_STATUS) return resolve();
  openpay.setOpenPayUrl(config.OPEN_PAY, config.OPEN_PAY_UPLOAD, result => {
    if (result.code != '0000') return reject();
    PAY_ENV_SET_STATUS = true;
    resolve();
  });
});


