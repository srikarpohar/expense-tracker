import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { AuthContext } from '../context/auth/auth.context';
import { PlusIcon, WalletIcon } from "@phosphor-icons/react";
import Calendar from '../components/calendar';
import Dialog, { type DialogRef } from '../components/dialog';
import { useForm } from 'react-hook-form';
import { axiosHttpApiRequestLayer } from '../api-layer/base.service';
import { ExpenseType, formatCurrencyValue, getCurrencyFromCountryCode, type AddExpenseRequestDto, type AddExpenseResponseDTO, type GetCalendarDataRequest, type GetCalendarDataResponse, type GetMonthlyCurrencyDataResponse } from 'expense-tracker-shared';
import { Dropdown } from '../components/dropdown';
import "./dashboard.module.css"
import { GlobeIcon } from '@phosphor-icons/react/dist/ssr';
import CalendarNav from '../components/calendar/nav';
import { fetchCalendarData, fetchCurrencyDashboardData } from '../api-layer/dashboard.service';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent
})

const categoryStyles: {[K:string]: { styleVariable: string }} = {
  "Food": {
    styleVariable: "--color-food",
  },
  "Transport": {
    styleVariable: "--color-transport"
  },
  "Entertainment": {
    styleVariable: "--color-entertainment",
  },
  "Shopping": {
    styleVariable: "--color-shopping"
  },
  "Bills": {  
    styleVariable: "--color-bills",
  },
  "Others": {
    styleVariable: "--color-other"
  }
};

interface IAddExpenseFormState {
  name: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  isRecurring: boolean;
  notes: string;
  billImage?: File | null;
  date?: string;
}

interface ICalendarData {
  [key: string]: GetCalendarDataResponse;
}

function RouteComponent() {
  // Context
  const {userData, logoutUser} = useContext(AuthContext);

  // State.
  const [currDate, setCurrDate] = useState(new Date());
  const [currencyData, setCurrencyData] = useState<GetMonthlyCurrencyDataResponse[]>([]);
  const [calendarData, setCalendarData] = useState<ICalendarData>({});
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");

  const categories = new Set<string>(Object.values(calendarData).flatMap(doc => doc.category_data.map(categoryData => categoryData.category)));
  const dialogRef = useRef<DialogRef>(null);

  const {
      register,
      handleSubmit,
      watch,
      formState: { errors }
    } = useForm<IAddExpenseFormState>({
      defaultValues: {
        name: '',
        category: "Food",
        description: '',
        amount: 0,
        currency: '',
        isRecurring: false,
        date: new Date().toString()
      }
    });

  const startDate = `${currDate.getFullYear()}-${(currDate.getMonth() + 1).toString().padStart(2, '0')}-01`;
  const endDate = `${currDate.getFullYear()}-${(currDate.getMonth() + 1).toString().padStart(2, '0')}-${new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate().toString().padStart(2, '0')}`;
  
  useEffect(() => {
    Promise.all([fetchCurrencyDashboardData(startDate, endDate), fetchCalendarData(startDate, endDate)])
      .then(([currencyDataResponse, calendarDataResponse]) => {
        setCurrencyData(currencyDataResponse);
        setCalendarData(calendarDataResponse.reduce((acc, curr) => {
          acc[curr.expense_date] = curr;
          return acc;
        }, {} as ICalendarData));
    }).catch((error) => {
        console.log("Error while fetching dashboard data: ", error);
    });

    return () => {
      console.log("use effect cleanup");
    }
  }, [currDate]);

  const onAddExpenseSubmit = () => {
    // console.log("Form data:", watch());
    axiosHttpApiRequestLayer.post<AddExpenseRequestDto, AddExpenseResponseDTO>("/dashboard", {
      name: watch().name,
      category_name: watch().category,
      category_description: watch().description,
      amount: watch().amount,
      currency: watch().currency,
      notes: watch().notes,
      // recurring_frequency: watch().isRecurring,
      type: ExpenseType.DEBIT,
      date: new Date(watch().date || ""),
    }).then((response) => {
      console.log("Expense added successfully: ", response.data);
      dialogRef.current?.close();
    }).catch((error) => {
      console.log("Error while adding expense: ", error);
    });
  }

  const onCurrencySelect = useCallback((currency: string) => {
    setSelectedCurrency(currency === selectedCurrency ? null : currency);
  }, [selectedCurrency]);

  const onCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category === selectedCategory ? "All Categories" : category);
  }, [selectedCategory]);

  function onAddExpenseClick() {
    dialogRef.current?.open();
  }

  const onAddExpenseDialogClose = () => {
    dialogRef.current?.close();
  }

  const onPrevMonthClick = () => {
    let prevMonthDate = new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1);
    setCurrDate(prevMonthDate);
  }

  const onNextMonthClick = () => {
    let nextMonthDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
    setCurrDate(nextMonthDate);
  }

  return (
    <div className="dashboard_l-container dashboard_c-container">

      <header className='dashboard_l-header dashboard_c-header'>
        <section className='dashboard_l-welcome'>
          <p className='t1'>
            Welcome, {userData?.username}!
          </p>
          <span className='s2'>Track your expenses across multiple currencies</span>
        </section>

        <section className='dashboard_l-profile'>
          <button className='l-button o-button--primary' onClick={onAddExpenseClick}>
            <PlusIcon size={24} weight='regular'/>
            Add Expense
          </button>
          <Dropdown toggleId='profile'
            toggle={() => (
              <div className='dashboard_c-profile__toggle'>
                <img src={`https://ui-avatars.com/api/?name=${userData?.username}&background=334155&color=fff`} 
                  alt="Profile Image" width={40} height={40} />
              </div>
            )}
            header={() => (
              <div className='l-flex l-flex--center dashboard_c-profile__header'>
                <img src={`https://ui-avatars.com/api/?name=${userData?.username}&background=334155&color=fff`} 
                  alt="Profile Image" width={40} height={40} style={{flex: 1}} />

                <div className='dashboard_l-header__info'>
                  <p className='s2'>{userData?.username}</p>
                  <p className='s3'>{userData?.email}</p>
                </div>
              </div>
            )}
            options={["Logout"]}
            onSelect={(option: string) => {
              if(option === "Logout") {
                logoutUser?.();
              }
            }}
          >
          </Dropdown>
        </section>
      </header>

      <section className='dashboard_l-filters'>
        {
          currencyData.map((currency: GetMonthlyCurrencyDataResponse) => {
            return (
              <section className={`o-card--currency dashboard_c-card dashboard_l-card ${selectedCurrency === currency.country_code ? 'is-active' : ''}`}
                onClick={() => onCurrencySelect(currency.country_code)}
                key={currency.country_code}>
                <div className='dashboard_l-card__header'>
                  <span className='s2'>{currency.country_code}</span>
                  <WalletIcon size={24} weight='regular' color={selectedCurrency === currency.country_code ? '#FFF' : '#94a3b8'} />
                </div>
                
                <div className='dashboard_l-card__content'>
                  <p className='t4'>{getCurrencyFromCountryCode(currency.country_code)?.currencySymbol ?? ""}{Number.parseInt(currency.total_amount).toFixed(2)}</p>
                  <p className='s3'>{currency.total_expenses_count} Expenses</p>
                </div>
              </section>
            );
          })
        }
      </section>

      <section className='dashboard_l-calendar dashboard_c-calendar'>
        <CalendarNav date={currDate} onPrevMonthClick={onPrevMonthClick} onNextMonthClick={onNextMonthClick} />
          
        <div className='dashboard_l-calendar__filters dashboard_c-calendar__filters'>
          <button className={`dashboard_c-filter__currency l-button s2 ${selectedCategory === "All Categories" ? 'o-button--dark' : 'o-button--secondary'}`} 
            key="all-categories"
            onClick={() => onCategorySelect("All Categories")} >
            <GlobeIcon size={16} weight='bold' />
            All Categories
          </button>

          {categories.size > 0 && (
            [...categories].map((category: string) => (
              <button className={`dashboard_c-filter__currency s2 ${selectedCategory === category ? 'o-button--dark' : 'o-button--secondary'}`} 
                key={category} onClick={() => onCategorySelect(category)}>
                {category}
              </button>
            ))
          )}
        </div>

        <Calendar date={currDate} type='month' renderCell={(date: Date) => {
          const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          return (
            <>
              {calendarData[dateKey]?.category_data?.length && (
                calendarData[dateKey]?.category_data?.filter((categoryData) => selectedCategory === "All Categories" || categoryData.category === selectedCategory)?.map((categoryData) => (
                  <div className='s3 dashboard_c-calendar__category dashboard_l-calendar__category' 
                    key={`${dateKey}-${categoryData.category}`}
                    hidden={selectedCurrency ? !formatCurrencyValue(categoryData.country_totals, selectedCurrency) : false}
                    style={{backgroundColor: `var(${categoryStyles[categoryData.category]?.styleVariable})`}}>
                    {formatCurrencyValue(categoryData.country_totals, selectedCurrency)}
                  </div>
                ))
              )}
            </>
          )
        }}></Calendar>
      </section>

      <footer className='l-flex--col dashboard_l-footer o-card--main'>
        <p className='s2'>Categories</p>

        <section className='l-flex'>
          {[...categories].map((category: string) => (
            <section className='l-flex dashboard_c-legend__item' key={category}>
              <div className='dashboard_c-item__indicator' style={{backgroundColor: `var(${categoryStyles[category]?.styleVariable})`}}></div>
              <span className='s3'>{category}</span>
            </section>
          ))}
        </section>
      </footer>

      <Dialog 
        ref={dialogRef} 
        title="Add expense" 
        isOpen={false} 
        onClose={() => {}}
        footer={() => {
          return (<div className='l-flex l-flex--end'>
            <button type='submit' className='o-button--primary' // disabled={loginUser?.status === 'pending'}
              onClick={handleSubmit(onAddExpenseSubmit)}>
              Submit
            </button>
            <button type="button" className="o-button--secondary" onClick={onAddExpenseDialogClose}>
              Close
            </button>
          </div>)
        }}
      >
        <form className='l-form' onSubmit={handleSubmit(onAddExpenseSubmit)}>
          <fieldset className='l-form__fieldset c-form__fieldset'>
            <section className='l-form__input-section'>
              <label htmlFor="name" className='l-input__label c-input__label'>Name:</label>

              <div className={`l-input c-input ${errors.name ? 'has-error' : ''}`}>
                <input type="text" placeholder='Enter name' id='name'
                    className='l-input__field c-input__field'
                    {...register("name", { required: {value: true, message: "Name is required"} })}
                />
              </div>

              {errors.name && <p className='c-input__error-message'>{errors.name.message}</p>}
            </section>

            <section className='l-form__input-section'>
              <label htmlFor="category" className='l-input__label c-input__label'>Category:</label>

              <div className={`l-input c-input ${errors.category ? 'has-error' : ''}`}>
                <input type="text" placeholder='Enter category' id='category'
                    className='l-input__field c-input__field'
                    {...register("category", { required: {value: true, message: "Category is required"} })}
                />
              </div>
              {errors.category && <p className='c-input__error-message'>{errors.category.message}</p>}
            </section>

            <section className='l-form__input-section'>
              <label htmlFor="description" className='l-input__label c-input__label'>Description:</label>

              <div className='l-input c-input'>
                <input type="text" placeholder='Enter description' id='description'
                    className='l-input__field c-input__field'
                    {...register("description")}
                />
              </div>
            </section>

            <section className='l-form__input-section'>
              <label htmlFor="amount" className='l-input__label c-input__label'>Amount:</label>

              <div className={`l-input c-input ${errors.amount ? 'has-error' : ''}`}>
                <input type="number" placeholder='Enter amount' id='amount'
                    min={0} step={0.01}
                    className='l-input__field c-input__field'
                    {...register("amount", { required: {value: true, message: "Amount is required"} })}
                />
              </div>
              {errors.amount && <p className='c-input__error-message'>{errors.amount.message}</p>}
            </section>

            <section className='l-form__input-section'>
              <label htmlFor="currency" className='l-input__label c-input__label'>Currency:</label>

              <div className={`l-input c-input ${errors.currency ? 'has-error' : ''}`}>
                <input type="text" placeholder='Enter currency' id='currency'
                    className='l-input__field c-input__field'
                    {...register("currency", { required: {value: true, message: "Currency is required"} })}
                />
              </div>
              {errors.currency && <p className='c-input__error-message'>{errors.currency.message}</p>}
            </section>

            <section className='l-form__input-section'>
              <label htmlFor="date" className='l-input__label c-input__label'>Date:</label>

              <div className={`l-input c-input ${errors.date ? 'has-error' : ''}`}>
                <input type="date" placeholder='Enter date' id='date'
                    className='l-input__field c-input__field'
                    {...register("date", { required: {value: true, message: "Expense Date is required"} })}
                />
              </div>
              {errors.date && <p className='c-input__error-message'>{errors.date.message}</p>}
            </section>

            <section className='l-form__input-section'>
              <label htmlFor="notes" className='l-input__label c-input__label'>Notes:</label>

              <div className='l-input c-input'>
                <textarea placeholder='Enter notes' id='notes'
                    className='l-input__field c-input__field'
                    {...register("notes")}
                    rows={5}
                />
              </div>
            </section>
          </fieldset>
        </form>
      </Dialog>
    </div>
  )
}