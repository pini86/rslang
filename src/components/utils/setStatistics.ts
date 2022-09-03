import api from '../../api/api';
import { IUserStatistics } from '../../interfaces/interfaces';

export default async function setStatistics() {
  const currentDate = new Date();
  const statisticsUser = await api.getStatistics();
  const settingUser = await api.getSettings();
  const statisticsNew: IUserStatistics = {
    learnedWords: 0,
    optional: {
      audiocall: {
        correctWords: 0,
        incorrectWords: 0,
        streak: 0,
        newWords: +0,
      },
      sprint: {
        correctWords: 0,
        incorrectWords: 0,
        streak: 0,
        newWords: +0,
      },
    },
  };

  if (!statisticsUser) {
    api.upsertStatistics(statisticsNew);
  }
  if (!localStorage.getItem('dateRSLang')) {
    localStorage.setItem('dateRSLang', currentDate.getTime().toString());
  } else {
    const savedDate = +(localStorage.getItem('dateRSLang') as string);
    if (currentDate.getTime() - savedDate > 86400000) {
      if (settingUser) {
        settingUser.optional.dayLearnWords[
          `${new Date(savedDate).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}`
        ] = settingUser.optional.learnedWords;
        settingUser.optional.learnedWords = 0;
        delete settingUser.id;
        if (statisticsUser) {
          settingUser.optional.dayStats[
            `${new Date(savedDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}`
          ] = statisticsUser;
        }
        await api.upsertSettings(settingUser);
      }
      localStorage.setItem('dateRSLang', currentDate.getTime().toString());
      api.upsertStatistics(statisticsNew);
    }
  }
}
