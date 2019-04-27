import dialogs from 'plugins/dialogs';
import isJSON from 'utils/lodash/isJSON';

const toast = (message, duration = 2) => {
  if (isJSON(message)) message = JSON.stringify(message);
  dialogs.toast({ message: message, duration: duration })
};

for (let key in dialogs) { toast[key] = dialogs[key]; };

export default toast;