import React, { useState, useRef, useEffect } from 'react';

export let activeTabLineRef;
export let activeTabRef;

export const InPageNavigation = ({
    routes,
    defaultHidden = [],
    defaultActiveIndex = 0,
    activeIndex,
    onTabChange,
    children,
}) => {
    activeTabLineRef = useRef();
    activeTabRef = useRef();

    const [width, setWidth] = useState(window.innerWidth);
    const [resizeEventAdded, setResizeEventAdded] = useState(false);

    const isControlled = activeIndex !== undefined;
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
    const indexToUse = isControlled ? activeIndex : inPageNavIndex;

    const changePageState = (btn, i) => {
        const { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = `${offsetWidth}px`;
        activeTabLineRef.current.style.left = `${offsetLeft}px`;

        if (isControlled) {
            onTabChange?.(i);
        } else {
            setInPageNavIndex(i);
        }
    };

    useEffect(() => {
        if (width > 766 && indexToUse !== defaultActiveIndex) {
            changePageState(activeTabRef.current, defaultActiveIndex);
        }
        if (!resizeEventAdded) {
            window.addEventListener('resize', () => {
                if (!resizeEventAdded) setResizeEventAdded(true);
                setWidth(window.innerWidth);
            });
        }
    }, [width]);

    useEffect(() => {
        if (routes.length) {
            changePageState(activeTabRef.current, indexToUse);
        }
    }, [routes, indexToUse]);

    return (
        <>
            <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
                {routes.map((route, i) => (
                    <button
                        key={i}
                        ref={i === indexToUse ? activeTabRef : null}
                        className={
                            'p-4 capitalize ' +
                            (indexToUse === i ? 'text-black' : 'text-dark-grey ') +
                            (defaultHidden.includes(route) ? 'md:hidden' : '')
                        }
                        onClick={(e) => changePageState(e.target, i)}
                    >
                        {route}
                    </button>
                ))}
                <hr ref={activeTabLineRef} className='absolute bottom-0 duration-200 border-dark-grey' />
            </div>
            {Array.isArray(children) ? children[indexToUse] : children}
        </>
    );
};
