import { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/authContext';
import axios from 'axios';
import { filterPaginationData } from '../common/filterPaginationData';
import Loader from '../components/Loader';
import NoDataMessage from '../components/NoDataMessage';
import { AnimationWrapper } from '../common/page-animation';
import NotificationCard from '../components/Notification/NotificationCard';
import LoadMoreDataBtn from '../components/BlogPost/LoadMoreDataBtn';

const Notifications = () => {
    const { isValid } = useContext(authContext);
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null);
    const filters = ['all', 'like', 'comment', 'reply'];
    const {authUser:{new_notification_available},setAuthUser}=useContext(authContext);
    const fetchNotifications = async ({ page, deleteCount = 0 }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/notification/notifications`, { page, filter, deleteCount }, {
                withCredentials: true
            })
            const { data: { notifications: data } } = response;
            if(new_notification_available){
                setAuthUser(prev => ({ ...prev, new_notification_available: false }));
            }
            const formattedData = await filterPaginationData({
                state: notifications,
                data,
                page,
                countRoute: '/api/notification/all-notifications-count',
                data_to_send: { filter },
                verify: true
            });
            setNotifications(formattedData);
            console.log(formattedData);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }
    useEffect(() => {
        if (isValid) {
            fetchNotifications({ page: 1 });
        }
    }, [filter, isValid]);
    const handleFilterChange = (filterName) => {
        setFilter(filterName);
        setNotifications(null);
    }

    return (
        <div>
            <h1 className='max-md:hidden'>Recent Notifications</h1>
            <div className='my-8 flex gap-6'>
                {
                    filters.map((filterName, i) => {
                        return (
                            <button key={i} className={`py-2 ${filter == filterName ? 'btn-dark' : 'btn-light'}`} onClick={() => handleFilterChange(filterName)}>{filterName}</button>
                        )
                    })
                }
            </div>
            {
                notifications == null ? <Loader /> :
                    <>
                        {
                            notifications.results.length ?
                                notifications.results.map((notification, i) => {
                                    return (
                                        <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                                            <NotificationCard data={notification} index={i} notificationState={{notifications,setNotifications}}/>
                                        </AnimationWrapper>
                                    )
                                })
                                : <NoDataMessage message='No Notifications' />
                        }
                        <LoadMoreDataBtn state={notifications} fetchDataFun={fetchNotifications} additionalParam={{deletedDocCount:notifications.deletedDocCount}}/>
                    </>
            }
        </div>
    )
}

export default Notifications