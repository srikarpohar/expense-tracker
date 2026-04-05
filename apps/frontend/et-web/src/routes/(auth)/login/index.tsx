import { createFileRoute } from '@tanstack/react-router'
import { Activity, useContext, useState } from 'react'
import "./login.module.css";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AuthContext } from '../../../context/auth/auth.context';
import { LockIcon, UserCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { ArrowRightIcon, EyeIcon } from '@phosphor-icons/react';

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginComponent,
})

export interface ILoginPageState {
  username: string;
  password: string;
}

function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ILoginPageState>();

  const onSubmitForm: SubmitHandler<ILoginPageState> = () => {
    loginUser?.mutate(watch());
  };

  return (
    <div className='login_l-container'>
      <form onSubmit={handleSubmit(onSubmitForm)} className='c-form l-form'>
          <fieldset className='c-form__fieldset l-form__fieldset'>
              <section className='l-form__input-section'>
                  <label htmlFor="username" className='l-input__label c-input__label'>Username:</label>
                  
                  <div className={`l-input c-input ${errors.username ? 'has-error' : ''}`}>
                    <UserCircleIcon size={24} weight="light" className=' l-input-icon c-input__icon--left' />
                    <input type="text" placeholder='Enter username' id='username'
                        className='l-input__field c-input__field'
                        {...register("username", { required: true })}
                    />
                  </div>
              </section>

              <section className='l-form__input-section'>
                  <label htmlFor="password" className='l-input__label c-input__label'>Password:</label>
                  
                  <div className={`l-input c-input ${errors.password ? 'has-error' : ''}`}>
                    <LockIcon size={24} weight="light" className='l-input-icon c-input__icon--left' />
                    <input type={showPassword ? "text" : "password"} placeholder='Enter password' id='password' 
                        className='l-input__field c-input__field'
                        {...register("password", { required: true })}
                    />
                    
                    <EyeIcon size={24} weight="light" 
                      className='l-input-icon l-input__icon--right login_l-eye'
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
              </section>

              <footer className='l-form__footer'>
                  <button type="submit" 
                    className='l-form__action o-button--primary'
                    disabled={loginUser?.status === 'pending'}
                    >
                      Sign In
                      <ArrowRightIcon size={20} weight="bold" />
                  </button>
              </footer>
          </fieldset>
      </form>
      
      <span>
        Don't have an account? <a href="/signup">Sign up for free</a>
      </span>

      <Activity mode={loginUser?.isPending ? "visible" : "hidden"}>
        <p>Loading...</p>
      </Activity>
    </div>
  )
}

export default LoginComponent;
