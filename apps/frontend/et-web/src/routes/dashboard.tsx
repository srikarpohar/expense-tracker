import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useContext, useState, Activity } from 'react';
import { AuthContext } from '../context/auth/auth.context';
import { CaretLeftIcon, PlusIcon } from "@phosphor-icons/react";
import CalendarHeader from '../components/calendar/header';
import Calendar from '../components/calendar';
import type { AccordionData } from '../components/accordion';
import Accordion from '../components/accordion';
import './dashboard.css';

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

function RouteComponent() {
  // Context
  const {userData} = useContext(AuthContext);

  // State.
  const [currDate, setCurrDate] = useState(new Date());
  const [minimiseFilters, setMinimiseFilters] = useState(false);

  // Dummy data for accordion
  const [accordionData, setAccordionData] = useState<AccordionData[]>(dummyAccordionData);

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
    <div className={`container grid grid-rows-[50px_auto_1fr_auto] grid-cols-(--tw-grid-cols) gap-x-2`}
      style={{"--tw-grid-cols": minimiseFilters ? '10px 1fr' : '350px 1fr' } as React.CSSProperties}>

      <header className='row-start-1 col-span-2 flex justify-center items-center p-3 border-b-2 border-gray-100'>
        <h1 className='text-[24px]! font-bold text-gray-800 m-0'>Welcome, {userData?.username}!</h1>
      </header>

      <section className={`left-container p-2 
        row-start-2 row-span-3 col-start-1 col-span-1 
        border-t-0 border-b-0 border-(length:--tw-border) border-gray-200
        flex flex-col justify-center items-center`}

        style={{"--tw-border": minimiseFilters ? '0px' : '2px'} as React.CSSProperties}
      >
          
          <button className={`p-1 bg-green-500 text-white flex items-center minimise-button`}
            style={{
              "--tw-rotate": minimiseFilters ? '180deg' : '0deg',
              "--tw-scale": minimiseFilters ? '0.6' : '0.8',
              "--tw-left": minimiseFilters ? '-15px' : '332px'
            } as React.CSSProperties} 
            onClick={() => setMinimiseFilters(!minimiseFilters)}>
              <CaretLeftIcon size={16} weight="bold" className={`flex-1`}/>
          </button>

          <Activity mode={minimiseFilters ? 'hidden' : 'visible'}>
            <div className='flex-1 overflow-y-auto'>
                <Accordion data={accordionData} openAtStart></Accordion>
            </div>

            <button className='bg-red-400 text-white rounded-md m-2 p-2 max-w-[75%]!'>
              Logout
            </button>
        </Activity>
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
