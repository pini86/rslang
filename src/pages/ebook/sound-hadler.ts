import api from '../../api/api';
import state from './state';

export default async function soundHadler(el: HTMLElement) {
  const { base } = state;
  if (state.audioChunk) {
    (state.audioChunk as HTMLAudioElement).pause();
  }

  const id = el.getAttribute('id') as string;
  const { audio, audioExample, audioMeaning } = await api.getWord(id);
  const audioLinks = [`${base}/${audio}`, `${base}/${audioExample}`, `${base}/${audioMeaning}`];
  const audioChunk = new Audio(audioLinks[0]);
  audioChunk.src = `${base}/${audio}`;
  state.audioChunk = audioChunk;
  audioChunk.play();
  let i = 1;

  audioChunk.onended = () => {
    if (i < audioLinks.length) {
      audioChunk.src = audioLinks[i];
      audioChunk.play();
      i++;
    }
  };
}
