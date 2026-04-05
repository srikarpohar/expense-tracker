import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Activity, useMemo, useState } from 'react';
import { type SignUpUserRequestDto, type IUser, type SignUpUserResponseDto, UserVerificationStatus, isValidPhoneNumber, getCountries } from 'expense-tracker-shared';
import './signup.module.css';
import { useMutation } from '@tanstack/react-query';
import { axiosHttpApiRequestLayer } from '../../../api-layer/base.service';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { EnvelopeIcon, EyeIcon, LockIcon, UserCircleIcon } from '@phosphor-icons/react/dist/ssr';

export const Route = createFileRoute('/(auth)/signup/')({
  component: SignupComponent,
})

type IState = SignUpUserRequestDto & { confirmpass: string };

function SignupComponent() {
  const [showField, setShowField] = useState("");
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
    <div className='signup_l-container'>
        <form onSubmit={handleSubmit(onSubmitForm)} className='c-form l-form'>
            <fieldset className='c-form__fieldset l-form__fieldset'>
                <section className='l-form__input-section'>
                    <label htmlFor="phone_number" className='l-input__label c-input__label'>Phone number:</label>

                    <div className={`l-input c-input ${errors.phone_number ? 'has-error' : ''}`} key="phone_number">
                      <select 
                        id="country_code" 
                        className='signup_l-country-dropdown signup_c-country-dropdown'
                        {
                          ...register("country_code", {required: "Country code is required"})
                        }>
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.icon ? `${country.icon} ` : ''} {country.name} ({country.phoneCode})
                          </option>
                        ))}
                      </select>
                      <input type="text" placeholder='Enter phone number' id='phone_number' 
                        {
                          ...register("phone_number", { 
                            required: {value: true, message: "Phone number is required"}, 
                            validate: { validatePhoneNumber }
                          })
                        }
                        className='l-input__field c-input__field'
                      />
                      
                    </div>
                      {errors.phone_number && <p className='c-input__error-message'>{errors.phone_number.message}</p>}
                </section>

                <section className='l-form__input-section'>
                    <label htmlFor="email" className='l-input__label c-input__label'>Email:</label>
                    
                    <div className={`l-input c-input ${errors.email ? 'has-error' : ''}`} key="email">
                      <EnvelopeIcon size={24} weight="light" className='l-input-icon c-input__icon--left' />
                      <input type="email" placeholder='Enter email' id='email' 
                          {...register("email", { required: {value: true, message: "Email is required"}, pattern: {value: /^\S+@\S+$/i, message: "Email is not correct! Enter valid email"} })}
                          className='l-input__field c-input__field'
                      />
                    </div>
                    {errors.email && <p className='c-input__error-message'>{errors.email.message}</p>}
                </section>

                <section className='l-form__input-section'>
                    <label htmlFor="username" className='l-input__label c-input__label'>Username:</label>

                    <div className={`l-input c-input ${errors.username ? 'has-error' : ''}`} key="username">
                      <UserCircleIcon size={24} weight="light" className='l-input-icon c-input__icon--left' />
                      <input type="text" placeholder='Enter username' id='username' 
                        {...register("username", { required: { value: true, message: "Username is required" } })}  
                        className='l-input__field c-input__field'
                      />
                    </div>
                    {errors.username && <p className='c-input__error-message'>{errors.username.message}</p>}
                </section>

                <section className='l-form__input-section'>
                    <label htmlFor="password" className='l-input__label c-input__label'>Password:</label>

                    <div className={`l-input c-input ${errors.password ? 'has-error' : ''}`} key="password">
                      <LockIcon size={24} weight="light" className='l-input-icon c-input__icon--left' />
                      <input type={showField === "password" ? "text" : "password"} placeholder='Enter password' id='password' 
                        {...register("password", { 
                          required: {value: true, message: "Password is required"}, 
                          minLength: {value: 6, message: "Password must have atleast 6 characters"} 
                        })} 
                        className='l-input__field c-input__field'
                      />
                      <EyeIcon size={24} weight="light" 
                      className='l-input-icon l-input__icon--right login_l-eye'
                      onClick={() => setShowField(showField === "password" ? "" : "password")}
                    />
                    </div>
                    {errors.password && <p className='c-input__error-message'>{errors.password.message}</p>}
                </section>

                <section className='l-form__input-section'>
                    <label htmlFor="confirmpass" className='l-input__label c-input__label'>Confirm Password:</label>
                    
                    <div className={`l-input c-input ${errors.confirmpass ? 'has-error' : ''}`} key="confirmpass">
                      <LockIcon size={24} weight="light" className='l-input-icon c-input__icon--left' />
                      <input type={showField === "confirmpass" ? "text" : "password"} placeholder='Confirm password' id='confirmpass' 
                        className='l-input__field c-input__field'
                        {...register("confirmpass", { validate: {checkPasswordMatch} })}
                      />
                      <EyeIcon size={24} weight="light" 
                        className='l-input-icon l-input__icon--right login_l-eye'
                        onClick={() => setShowField(showField === "confirmpass" ? "" : "confirmpass")}
                      />
                    </div>
                    {errors.confirmpass && <p className='c-input__error-message'>{errors.confirmpass.message}</p>}
                </section>

                <section className='l-form__input-section'>
                    <label htmlFor="profilepic" className='l-input__label c-input__label'>Profile Picture:</label>
                    <div className={`l-input c-input ${errors.profilePic ? 'has-error' : ''}`} key="profilepic">
                      <input type="file" placeholder='Upload file' id='profilepic'
                        {...register("profilePic", { required: false })}
                        className='l-input__field c-input__field'    
                      />
                    </div>
                </section>

                <div className='l-form__footer'>
                    <button type="submit" className='l-form__action o-button--primary' value="Signup" 
                      disabled={signupMutation.status == "pending"}>
                      Sign Up
                    </button>
                    {/* <button type="button" 
                      className='action-btn' 
                      onClick={() => {
                        router.navigate({
                          to: "/login"
                        });
                      }}>
                      Login
                    </button> */}
                </div>
            </fieldset>
        </form>

        <span>
          Have an account? <a href="/login">Sign in</a>
        </span>

        <Activity mode={signupMutation.isPending ? "visible" : "hidden"}>
          <p>Loading...</p>
        </Activity>
    </div>
  )
}
