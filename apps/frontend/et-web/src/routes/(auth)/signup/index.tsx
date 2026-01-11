import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Activity, useMemo } from 'react';
import { type SignUpUserRequestDto, type IUser, type SignUpUserResponseDto, UserVerificationStatus, isValidPhoneNumber, getCountries } from 'expense-tracker-shared';
import './signup.css';
import { useMutation } from '@tanstack/react-query';
import { axiosHttpApiRequestLayer } from '../../../api-layer/base.service';
import { useForm, type SubmitHandler } from 'react-hook-form';

export const Route = createFileRoute('/(auth)/signup/')({
  component: SignupComponent,
})

type IState = SignUpUserRequestDto & { confirmpass: string };

function SignupComponent() {
  const countries = useMemo(() => getCountries(), []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IState>();

  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: async (data: IState) => {
      // Perform signup logic here, e.g., call an API
      const response = await axiosHttpApiRequestLayer.post<SignUpUserRequestDto, SignUpUserResponseDto>("/auth/signup", {
        email: data.email,
        username: data.username,
        password: data.password,
        country_code: data.country_code,
        phone_number: data.phone_number,
        profilePic: data.profilePic as File
      });

      console.log("Signing up with:", data);
      return response.data;
    },
    onSuccess: (response: SignUpUserResponseDto) => {
      console.log("Signup successful", response.verification_id);
      router.navigate({
        to: "/login",
      });
      return response;
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    }
  })

  const onSubmitForm: SubmitHandler<IState> = (data) => {
    signupMutation.mutate(data);
  }

  const checkPasswordMatch = (value: string) => {
    if(value == watch('password')) {
      return true;
    }
    return "Passwords do not match";
  };

  const validatePhoneNumber = (value: string) => {
    try {
      const country_code = watch('country_code');
      return isValidPhoneNumber(value, country_code as any);
    } catch(error: any) {
      return error.message;
    }
  }

  return (
    <div className='h-full flex justify-center items-center'>
        <form onSubmit={handleSubmit(onSubmitForm)} className='p-4 border border-black border-solid rounded-md'>
            <fieldset className='flex flex-col gap-2.5'>
                <legend className='p-2 rounded-md text-base text-center mb-2'>
                  <h1>Signup</h1>
                </legend>

                <section className='input-section'>
                    <label htmlFor="phone_number" className='flex-1 w-100 font-bold'>Phone number:</label>

                    <div className='input-error-section' key="phone_number">
                      <section className='flex gap-0'>
                        <select 
                          id="country_code" 
                          className='max-w-[100px] border border-black rounded-l-lg'
                          {
                            ...register("country_code", {required: "Country code is required"})
                          }>
                          {countries.map(country => (
                            <option key={country.code} value={country.code}>{country.name} ({country.phoneCode})</option>
                          ))}
                        </select>
                        <input type="text" placeholder='Enter phone number' id='phone_number' 
                          {
                            ...register("phone_number", { 
                              required: {value: true, message: "Phone number is required"}, 
                              validate: { validatePhoneNumber }
                            })
                          }
                          className={`phone-number ${errors.phone_number ? 'border-red-500' : ''}`}
                        />
                      </section>
                      
                      {errors.phone_number && <p className='text-red-500 text-sm'>{errors.phone_number.message}</p>}
                    </div>
                </section>

                <section className='input-section'>
                    <label htmlFor="email" className='flex-1 font-bold'>Email:</label>
                    
                    <div className='input-error-section' key="email">
                      <input type="email" placeholder='Enter email' id='email' 
                          {...register("email", { required: {value: true, message: "Email is required"}, pattern: {value: /^\S+@\S+$/i, message: "Email is not correct! Enter valid email"} })}
                          className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
                    </div>
                </section>

                <section className='input-section'>
                    <label htmlFor="username" className='flex-1 font-bold'>Username:</label>

                    <div className='input-error-section' key="username">
                      <input type="text" placeholder='Enter username' id='username' 
                        {...register("username", { required: { value: true, message: "Username is required" } })}  
                        className={errors.username ? 'border-red-500' : ''}
                        />
                      {errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
                    </div>
                </section>

                <section className='input-section mb-2'>
                    <label htmlFor="password" className='flex-1 font-bold'>Password:</label>

                    <div className='input-error-section' key="password">
                      <input type="password" placeholder='Enter password' id='password' 
                        {...register("password", { 
                          required: {value: true, message: "Password is required"}, 
                          minLength: {value: 6, message: "Password must have atleast 6 characters"} 
                        })} 
                        className={errors.password ? 'border-red-500' : ''} 
                      />
                      {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
                    </div>
                </section>

                <section className='input-section'>
                    <label htmlFor="confirmpass" className='flex-1 font-bold'>Confirm Password:</label>
                    
                    <div className='input-error-section' key="confirmpass">
                      <input type="password" placeholder='Confirm password' id='confirmpass' 
                        className={errors.confirmpass ? 'border-red-500' : ''}
                        {...register("confirmpass", { validate: {checkPasswordMatch} })}
                      />
                      {errors.confirmpass && <p className='text-red-500 text-sm'>{errors.confirmpass.message}</p>}
                    </div>
                </section>

                <section className='input-section'>
                    <div className='input-error-section' key="profilepic">
                      <input type="file" placeholder='Upload file' id='profilepic' className='profilepic'
                        {...register("profilePic", { required: false })}    
                      />
                    </div>
                </section>

                <div className='flex justify-around items-center gap-1'>
                    <input type="submit" className='action-btn' value="Signup" 
                      disabled={signupMutation.status == "pending"} />
                    <button type="button" 
                      className='action-btn' 
                      onClick={() => {
                        router.navigate({
                          to: "/login"
                        });
                      }}>
                      Login
                    </button>
                </div>
            </fieldset>
        </form>

        <Activity mode={signupMutation.isPending ? "visible" : "hidden"}>
          <p>Loading...</p>
        </Activity>
    </div>
  )
}
