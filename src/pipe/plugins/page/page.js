const refresh = weex.requireModule('refreshModule');

export default {
  refresh: () => {
    refresh.refreshPage();
  }
};