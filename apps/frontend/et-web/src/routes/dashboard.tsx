import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useContext, useState, Activity, useRef } from 'react';
import { AuthContext } from '../context/auth/auth.context';
import { CaretLeftIcon, PlusIcon } from "@phosphor-icons/react";
import CalendarHeader from '../components/calendar/header';
import Calendar from '../components/calendar';
import type { AccordionData } from '../components/accordion';
import Accordion from '../components/accordion';
import './dashboard.css';
import Dialog, { type DialogRef } from '../components/dialog';
import { useForm } from 'react-hook-form';
import { axiosHttpApiRequestLayer } from '../api-layer/base.service';
import { ExpenseType, type AddExpenseCategoryRequestDto, type AddExpenseRequestDto, type AddExpenseResponseDTO, type GetCalendarDataRequest, type GetCalendarDataResponse } from 'expense-tracker-shared';
import { Dropdown } from '../components/dropdown';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent
})

const dummyAccordionData: AccordionData[] = [{
    id: '1',
    title: 'Header 1',
    items: [
      {id: '1', title: 'Item 1'},
      {id: '2', title: 'Item 2'},
      {id: '3', title: 'Item 3'},
    ]
  }, {
    id: '2',
    title: 'Header 2',
    items: [
      {id: '1', title: 'Item 1'},
      {id: '2', title: 'Item 2'},
      {id: '3', title: 'Item 3'},
    ]
  }, {
    id: '3',
    title: 'Header 3',
    items: [
      {id: '1', title: 'Item 1'},
      {id: '2', title: 'Item 2'},
      {id: '3', title: 'Item 3'},
    ]
  }, {
    id: '4',
    title: 'Header 4',
    items: [
      {id: '1', title: 'Item 1'},
      {id: '2', title: 'Item 2'},
      {id: '3', title: 'Item 3'},
    ]
  }, {
    id: '5',
    title: 'Header 5',
    items: [
      {id: '1', title: 'Item 1'},
      {id: '2', title: 'Item 2'},
      {id: '3', title: 'Item 3'},
    ]
  }, {
    id: '6',
    title: 'Header 6',
    items: [
      {id: '1', title: 'Item 1'},
      {id: '2', title: 'Item 2'},
      {id: '3', title: 'Item 3'},
    ]
  }, {
    id: '7',
    title: 'Header 7',
    items: [
      {id: '1', title: 'Item 1'},
      {id: '2', title: 'Item 2'},
      {id: '3', title: 'Item 3'},
    ]
}];

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
  [key: string]: {
    date: string;
    currencyData: {
      totalAmount: number;
      currency: string;
    }[]
  }
}

function RouteComponent() {
  // Context
  const {userData, logoutUser} = useContext(AuthContext);

  // State.
  const [currDate, setCurrDate] = useState(new Date());
  const [minimiseFilters, setMinimiseFilters] = useState(false);

  // Dummy data for accordion
  const [calendarData, setCalendarData] = useState<ICalendarData>({});
  const [accordionData, setAccordionData] = useState<AccordionData[]>(dummyAccordionData);

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

  useEffect(() => {
    console.log("use effect");
    axiosHttpApiRequestLayer.get<GetCalendarDataRequest, GetCalendarDataResponse[]>('/dashboard', {
      monthYear: `${currDate.getMonth() + 1}/${currDate.getFullYear()}`,
    }).then((response) => {
      setCalendarData(response.data.reduce((acc, curr) => {
        acc[curr.date] = {
          date: curr.date,
          currencyData: curr.currencyData,
        }
        return acc;
      }, {} as ICalendarData));
      console.log("Dashboard data: ", response.data);
    }).catch((error) => {
      console.log("Error while fetching dashboard data: ", error);
    });

    return () => {
      console.log("use effect cleanup");
    }
  }, []);

  const onAddExpenseSubmit = () => {
    console.log("Form data:", watch());
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
    <div className={`container grid grid-rows-[50px_auto_1fr_auto] grid-cols-(--tw-grid-cols) gap-x-2`}
      style={{"--tw-grid-cols": minimiseFilters ? '10px 1fr' : '350px 1fr' } as React.CSSProperties}>

      <header className='row-start-1 col-span-2 flex justify-center items-center p-3 border-b-2 border-gray-100'>
        <h1 className='flex-1 text-center text-[24px]! font-bold text-gray-800 m-0'>Welcome, {userData?.username}!</h1>
        <Dropdown toggleId='profile'
          header={() => (
            <div className='flex items-center gap-2 cursor-pointer mr-4'>
              <img src={`https://ui-avatars.com/api/?name=${userData?.username}&background=0D8ABC&color=fff`} 
                alt="Profile Image" width={40} height={40} 
                className='border-2 border-sky-500 rounded-[50%]'/>
            </div>
          )}
          options={["Logout"]}
          onSelect={(option: string) => {
            if(option === "Logout") {
              logoutUser?.();
            }
          }}
        />
      </header>

      {/* <section className={`left-container p-2 
        row-start-2 row-span-3 col-start-1 col-span-1 
        border-t-0 border-b-0 border-(length:--tw-border) border-gray-200
        flex flex-col justify-center items-center`}

        style={{"--tw-border": minimiseFilters ? '0px' : '2px'} as React.CSSProperties}
      >
          
          <button className={`p-1 bg-green-500 text-white flex items-center minimise-button`}
            style={{
              "--tw-rotate": minimiseFilters ? '180deg' : '0deg',
              "--tw-scale": minimiseFilters ? '0.6' : '0.9',
              "--tw-left": minimiseFilters ? '-15px' : '332px'
            } as React.CSSProperties} 
            onClick={() => setMinimiseFilters(!minimiseFilters)}>
              <CaretLeftIcon size={16} weight="bold" className={`flex-1`}/>
          </button>

          <Activity mode={minimiseFilters ? 'hidden' : 'visible'}>
            <div className='flex-1 overflow-y-auto'>
                <Accordion data={accordionData} openAtStart></Accordion>
            </div>

            <button className='bg-red-400 text-white rounded-md m-2 p-2 max-w-[75%]! cursor-pointer' onClick={logoutUser}>
              Logout
            </button>
        </Activity>
      </section> */}

      <section className='row-span-1 col-start-1 col-span-2 flex justify-between items-center mb-2 p-2'>
        <CalendarHeader date={currDate} onPrevMonthClick={onPrevMonthClick} onNextMonthClick={onNextMonthClick} />

        <button className='p-2 flex justify-between items-center gap-2 bg-blue-500 text-white rounded-md cursor-pointer'
          onClick={() => dialogRef.current?.open()}>
          <PlusIcon size={20} weight="bold"/>
          Add Expense
        </button>
      </section>

      <section className='row-span-1 col-start-1 col-span-2 flex justify-center items-center'>
        <Calendar date={currDate} type='month' renderCell={(date: string) => {
          return (
            <p>{calendarData[date]?.currencyData[0]?.totalAmount} {calendarData[date]?.currencyData[0]?.currency}</p>
          )
        }}>
        </Calendar>
      </section>

      <Dialog 
        ref={dialogRef} 
        title="Add expense" 
        isOpen={false} 
        onClose={() => {}}
        footer={() => {
          return (<div className='flex justify-around items-center gap-2'>
            <input type="submit" 
              className='submit-btn'
              onClick={handleSubmit(onAddExpenseSubmit)}
              // disabled={loginUser?.status === 'pending'}
              value="Submit" 
            />
            <button type="button" className="dialog-footer-button" onClick={onAddExpenseDialogClose}>
                Close
            </button>
          </div>)
        }}
      >
        <form>
          <fieldset>
            <section className='input-section'>
              <label htmlFor="name" className='flex-1 w-50 font-bold'>Name:</label>
              <input type="text" placeholder='Enter name' id='name'
                  className={errors.name ? 'border-red-500 flex-2' : 'flex-2'} 
                  {...register("name", { required: true })}
              />
            </section>

            <section className='input-section'>
              <label htmlFor="category" className='flex-1 w-50 font-bold'>Category:</label>
              <input type="text" placeholder='Enter category' id='category'
                  className={errors.category ? 'border-red-500 flex-2' : 'flex-2'} 
                  {...register("category", { required: true })}
              />
            </section>

            <section className='input-section'>
              <label htmlFor="description" className='flex-1 w-50 font-bold'>Description:</label>
              <input type="text" placeholder='Enter description' id='description'
                  className={errors.description ? 'border-red-500 flex-2' : 'flex-2'} 
                  {...register("description", { required: true })}
              />
            </section>

            <section className='input-section'>
              <label htmlFor="amount" className='flex-1 w-50 font-bold'>Amount:</label>
              <input type="number" placeholder='Enter amount' id='amount'
                  min={0} step={0.01}
                  className={errors.amount ? 'border-red-500 flex-2' : 'flex-2'} 
                  {...register("amount", { required: true })}
              />
            </section>

            <section className='input-section'>
              <label htmlFor="currency" className='flex-1 w-50 font-bold'>Currency:</label>
              <input type="text" placeholder='Enter currency' id='currency'
                  className={errors.currency ? 'border-red-500 flex-2' : 'flex-2'} 
                  {...register("currency", { required: true })}
              />
            </section>

            <section className='input-section'>
              <label htmlFor="date" className='flex-1 w-50 font-bold'>Date:</label>
              <input type="date" placeholder='Enter date' id='date'
                  className={errors.date ? 'border-red-500 flex-2' : 'flex-2'} 
                  {...register("date", { required: true })}
              />
            </section>

            <section className='input-section'>
              <label htmlFor="notes" className='flex-1 w-50 font-bold'>Notes:</label>
              <textarea placeholder='Enter notes' id='notes'
                  className={[errors.notes ? 'border-red-500 flex-2' : 'flex-2', 'border-1 rounded-sm p-2'].join(' ')} 
                  {...register("notes", { required: true })}
              />
            </section>

            <section className='input-section left-0'>
              <label htmlFor="isRecurring" className='flex-1 w-50 font-bold'>Is Recurring:</label>
              <input type="checkbox" id='isRecurring'
                  className={errors.isRecurring ? 'border-red-500 flex-2' : 'flex-2'} 
                  {...register("isRecurring")}
              />
            </section>
          </fieldset>
        </form>
      </Dialog>

      <footer className='row-span-1 col-start-1 col-span-2 flex justify-center items-center'>
        <p>Footer section</p>
      </footer>
    </div>
  )
}
