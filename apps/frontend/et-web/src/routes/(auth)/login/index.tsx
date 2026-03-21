import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Activity, useContext } from 'react'
import "../common.css";
import { useMutation } from '@tanstack/react-query';
import { axiosHttpApiRequestLayer } from '../../../api-layer/base.service';
import type { LoginUserRequestDto, LoginUserResponseDto } from 'expense-tracker-shared';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AuthContext } from '../../../context/auth/auth.context';

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginComponent,
})

export interface ILoginPageState {
  username: string;
  password: string;
}

function LoginComponent() {
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

  const router = useRouter();

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmitForm)} className='p-4 border border-black border-solid rounded-md'>
          <fieldset className='flex flex-col justify-between gap-2.5'>
              <legend className='p-2 rounded-md text-base text-center mb-2'>
                <h2>Login</h2>
              </legend>

              <section className='input-section'>
                  <label htmlFor="username" className='flex-1 w-50 font-bold'>Username:</label>
                  <input type="text" placeholder='Enter username' id='username'
                      className={errors.username ? 'border-red-500 flex-2' : 'flex-2'} 
                      {...register("username", { required: true })}
                  />
              </section>

              <section className='input-section'>
                  <label htmlFor="password" className='flex-1 font-bold'>Password:</label>
                  <input type="password" placeholder='Enter password' id='password' 
                      className={errors.password ? 'border-red-500 flex-2' : 'flex-2'} 
                      {...register("password", { required: true })}
                  />
              </section>

              <div className='flex justify-around items-center gap-1'>
                  <input type="submit" 
                    className='action-btn'
                    disabled={loginUser?.status === 'pending'}
                    value="Login" />
                  <button type="button" 
                    className='action-btn' 
                    onClick={() => {
                      router.navigate({
                        to: "/signup"
                      });
                    }}>
                    Signup
                  </button>
              </div>
          </fieldset>
      </form>

      <Activity mode={loginUser?.isPending ? "visible" : "hidden"}>
        <p>Loading...</p>
      </Activity>
    </div>
  )
}

export default LoginComponent;
