import signIn from "../../api/signin";
import { createUser } from "../../api/users";
import { User } from "../interfaces/interfaces";

class Register {
  form: HTMLFormElement;

  fields: string[];

  constructor(form: HTMLFormElement, fields: string[]){
    this.form = form;
    this.fields = fields;
    this.signOnSubmit();
  }

  signOnSubmit(): void{
  this.form.addEventListener('submit',async (e)=>{

  e.preventDefault();
  const inputValues: [string, string][] = [];

  this.fields.forEach((field)=>{
    const input = document.querySelector(`#${field}`) as HTMLInputElement;
    const fieldName = field.slice(0,-4);
    inputValues.push([fieldName, input.value]);
  });

    const user: User = inputValues.reduce((a, v) => ({ ...a, [v[0]]: v[1]}), {name: '', password: '', email:''});
    const {email, password} = user;

    await createUser(user).then(()=>{
      signIn({email,password});
    }); 
})}
}
export default Register;