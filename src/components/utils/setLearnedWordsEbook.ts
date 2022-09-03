/* eslint-disable no-param-reassign */
import api from '../../api/api';
import Controller from '../controller/controller';
import state from '../../pages/ebook/state';
import { ISettings } from '../../interfaces/interfaces';

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
  }).catch(() => {
    const currDate = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const newSettings: ISettings = {
      wordsPerDay: 1,
      optional: {
        learnedWords: state.easyCount,
        dayStats: { currDate: {
           learnedWords: 0,
           optional: {
             sprint: {
               correctWords: 0,
               incorrectWords: 0,
               streak: 0,
               newWords: 0
             },
             audiocall: {
              correctWords: 0,
              incorrectWords: 0,
              streak: 0,
              newWords: 0
             }
           }
        }},
        dayLearnWords: {currDate: 0},
      },
    };
    api.upsertSettings(newSettings);
});
}
