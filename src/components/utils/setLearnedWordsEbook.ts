/* eslint-disable no-param-reassign */
import api from '../../api/api';
import Controller from '../controller/controller';
import state from '../../pages/ebook/state';

export default function setLearnedWordsEbook(): void {
  if (!Controller.isLoggedIn) {
    return;
  }
  api.getSettings().then((data) => {
    if (data) {
      delete data.id;
      data.optional.learnedWords = state.easyCount;
      api.upsertSettings(data);
    }
  });
}
