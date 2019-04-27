const statusbar = weex.requireModule('statusBarModule');

export default {
  color: $color => statusbar.setStatusbarColor($color), // android
  style: $style => statusbar.setStatusbarStyle($style), // ios
};