import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Activity } from 'react'
import "./login.css";
import { useMutation } from '@tanstack/react-query';
import { axiosHttpApiRequestLayer } from '../../../api-layer/base.service';
import type { LoginUserRequestDto, LoginUserResponseDto } from 'expense-tracker-shared';
import { useForm, type SubmitHandler } from 'react-hook-form';

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginComponent,
})

interface IState {
  username: string;
  password: string;
}

function LoginComponent() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IState>();

  const loginMutation = useMutation({
    mutationFn: async (data: IState) => {
      // Perform login logic here, e.g., call an API
      const response = await axiosHttpApiRequestLayer.post<LoginUserRequestDto, LoginUserResponseDto>("/auth/login", {
        username: data.username,
        password: data.password,
      });

      const result: string = await new Promise((resolve) => {
        setTimeout(() => {
          console.log("Simulated login response");
          resolve("jgwafdjsgkj;l");
          router.navigate({
            to: "/dashboard",
          });
        }, 10000);
      });

      // TODO: store {{response.data}} (the token) in local storage or context
      // console.log("Logging in with:", response.data);
      return result;
    },
    onSuccess: (response: string) => {
      console.log("Login successful", response);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  });

  const onSubmitForm: SubmitHandler<IState> = (data) => {
    loginMutation.mutate(watch());
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
                    disabled={loginMutation.status === 'pending'}
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

      <Activity mode={loginMutation.isPending ? "visible" : "hidden"}>
        <p>Loading...</p>
      </Activity>
    </div>
  )
}

export default LoginComponent;
