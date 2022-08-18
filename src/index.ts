import axios from 'axios';
import * as Materialize from '@materializecss/materialize';

import './style.scss';








import api from './components/api/api';

// console.log(api.getWords());

// console.log(api.getWord('5e9f5ee35eb9e72bc21af4a4'));

/* const userNew = api.createNewUser({
  name: 'test2',
  email: 'email2@mail.ru',
  password: '12345678'
}) */

const user1 = api.signIn( "email@mail.ru",
"12345678");
// console.log(user1);

console.log(user1.then(()=>api.getUser(api.userId)));  // здесь токен и userid сохраняются
 console.log(user1.then(()=>api.updateUser("new_email@mail.ru", "new_password")));  // а здесь уже нет 