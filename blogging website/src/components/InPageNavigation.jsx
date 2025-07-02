import { useEffect, useRef } from 'react';

export const InPageNavigation = ({
    routes,
    defaultHidden = [],
    defaultActiveIndex = 0,
    activeIndex,
    onTabChange,
    children,
}) => {
    const activeTabLineRef = useRef();
    const activeTabRef = useRef();
    const indexToUse = activeIndex ?? defaultActiveIndex;

    const changePageState = (btn, index) => {
        const { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = `${offsetWidth}px`;
        activeTabLineRef.current.style.left = `${offsetLeft}px`;
        onTabChange?.(index); // If controlled
    };

    useEffect(() => {
        changePageState(activeTabRef.current, indexToUse);
    }, [routes, indexToUse]);

    return (
        <>
            <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
                {routes.map((route, index) => (
                    <button
                        key={index}
                        ref={index === indexToUse ? activeTabRef : null}
                        className={
                            'p-4 px-5 capitalize ' +
                            (indexToUse === index ? 'text-black' : 'text-dark-grey') +
                            (defaultHidden.includes(route) ? ' md:hidden' : '')
                        }
                        onClick={(e) => changePageState(e.target, index)}
                    >
                        {route}
                    </button>
                ))}
                <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300' />
            </div>
            {Array.isArray(children) ? children[indexToUse] : children}
        </>
    );
};
