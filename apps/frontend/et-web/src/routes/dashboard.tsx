import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useContext, useReducer, useState } from 'react';
import { AuthContext } from '../context/auth/auth.context';
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from "@phosphor-icons/react";
import CalendarHeader from '../components/calendar/header';
import Calendar from '../components/calendar';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent
})

function RouteComponent() {

  const {userData} = useContext(AuthContext);
  const [currDate, setCurrDate] = useState(new Date());

  useEffect(() => {
    console.log("use effect");

    return () => {
      console.log("use effect cleanup");
    }
  }, []);

  const onPrevMonthClick = () => {
    let prevMonthDate = new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1);
    setCurrDate(prevMonthDate);
  }

  const onNextMonthClick = () => {
    let nextMonthDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
    setCurrDate(nextMonthDate);
  }

  return (
    <div className='grid grid-rows-[auto_1fr_auto] grid-cols-[250px_1fr] h-full'>
      <section className='row-start-1 row-span-3 col-span-1 border-2 border-t-0 border-b-0 flex justify-center items-center'>
        <p>Left section</p>
      </section>

      <section className='row-span-1 col-span-1 flex justify-between items-center mb-2 p-2'>
        <CalendarHeader date={currDate} onPrevMonthClick={onPrevMonthClick} onNextMonthClick={onNextMonthClick} />

        <button className='p-2 flex justify-between items-center gap-2 bg-blue-500 text-white rounded-md cursor-pointer'>
          <PlusIcon size={20} weight="bold"/>
          Add Expense
        </button>
      </section>

      <section className='row-span-1 col-span-1 flex justify-center items-center'>
        <Calendar date={currDate} type='month'>
          <p>Calendar component</p>
        </Calendar>
      </section>

      <footer className='row-span-1 col-span-1 flex justify-center items-center'>
        <p>Footer section</p>
      </footer>
    </div>
  )
}
