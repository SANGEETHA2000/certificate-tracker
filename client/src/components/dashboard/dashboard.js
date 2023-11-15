import appLogo from '../../assets/logo.png';
import TableViewComponent from './tableView/tableView';

const DashboardComponent = () => {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row basis-1/12 bg-teal-600 justify-between px-4">
                <div className="flex flex-row gap-4 items-center">
                    <img src={appLogo} alt="SSL Monitor Logo" className='w-11 h-11 rounded-md'/>
                    <span className='text-2xl text-white font-semibold'>SSL Certificate Monitor</span>   
                </div>
                <div className='flex items-center'>
                    <button className='bg-red-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-red-600'>SIGN OUT</button>
                </div>
            </div>
            <div className='flex basis-11/12 flex-row'>
                <div className='flex basis-1/5 border-r-2 border-teal-50'>

                </div>
                <div className='flex basis-4/5 bg-teal-50 p-5'>
                    <TableViewComponent />
                </div>
            </div>
        </div>
    )
}

export default DashboardComponent;