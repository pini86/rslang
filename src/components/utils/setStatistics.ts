/* eslint-disable no-param-reassign */
import api from '../../api/api';
import { IUserStatistics, ISettings } from '../../interfaces/interfaces';

export default async function setStatistics() {
  const currentDate = new Date();
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
 /*  const currDateString = currentDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }); */
  const newSettings: ISettings = {
    wordsPerDay: 1,
    optional: {
      learnedWords: 0,
      dayStats: {
        start: {
          learnedWords: 0,
          optional: {
            sprint: {
              correctWords: 0,
              incorrectWords: 0,
              streak: 0,
              newWords: 0,
            },
            audiocall: {
              correctWords: 0,
              incorrectWords: 0,
              streak: 0,
              newWords: 0,
            },
          },
        },
      },
      dayLearnWords: { start: 0 },
    },
  };

  const statisticsUser = await api.getStatistics()
  .catch(() => {
    api.upsertStatistics(statisticsNew);
    api.upsertSettings(newSettings);
  });

  await api.getSettings().then((settingUser)=>{
    if (!localStorage.getItem('dateRSLang')) {
      localStorage.setItem('dateRSLang', currentDate.getTime().toString());
    } else {
      const savedDate = +(localStorage.getItem('dateRSLang') as string);
      console.log(currentDate.getTime(),savedDate )
      if (currentDate.getTime() - savedDate > 86400000) {
        console.log('пора менять сетинг', settingUser, statisticsUser);
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
          api.upsertSettings(settingUser);
        }
        localStorage.setItem('dateRSLang', currentDate.getTime().toString());
        api.upsertStatistics(statisticsNew);
      }
    }
  });

  console.log('statisticsUser');
 /*  if (!statisticsUser) {
    console.log(statisticsUser);
    await api.upsertStatistics(statisticsNew);
    await api.upsertSettings(newSettings);
  } */

 /*  if (!localStorage.getItem('dateRSLang')) {
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
      await api.upsertStatistics(statisticsNew);
    }
  } */
}
