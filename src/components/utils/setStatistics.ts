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

  await api
    .getStatistics()
    .then(async (statisticsUserData) => {
      await api.getSettings().then(async (settingUser) => {
        if (!localStorage.getItem('dateRSLang')) {
          localStorage.setItem('dateRSLang', currentDate.getTime().toString());
        } else {
          const savedDate = +(localStorage.getItem('dateRSLang') as string);

          if (
            currentDate.getTime() > savedDate &&
            new Date().getDate() > new Date(+savedDate).getDate()
          ) {
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
              if (statisticsUserData) {
                settingUser.optional.dayStats[
                  `${new Date(savedDate).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}`
                ] = statisticsUserData;
              }
              await api.upsertSettings(settingUser);
            }
            localStorage.setItem('dateRSLang', currentDate.getTime().toString());
            await api.upsertStatistics(statisticsNew);
          }
        }
      });
    })
    .catch(() => {
      api.upsertStatistics(statisticsNew);
      api.upsertSettings(newSettings);
    });
}
