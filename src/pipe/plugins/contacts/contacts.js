const contacts = weex.requireModule('contactsModule');

export default {
  // save: contact => {
  //   // body...
  // },

  // remove: contact => {
  //   // body...
  // },

  // clone: contact => {
  //   // body...
  // },

  // find: contact => {
  //   // body...
  // },

  pickContact: () => new Promise((resolve, reject) => {
    contacts.pickContact(e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
    // resolve([{phone:'13022199055'}])
  }).handle(),
};
