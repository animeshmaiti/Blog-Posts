import React from 'react'
import { AnimationWrapper } from '../common/page-animation'
import { InPageNavigation } from '../components/InPageNavigation'

export const HomePage = () => {
  return (
    <AnimationWrapper>
        <section className='h-cover flex justify-center gap-10'>
            {/* latest blogs */}
            <div className='w-full'>
                <InPageNavigation routes={['home','trending']} defaultHidden={['trending']}>
                    <h1>Latest blogs</h1>
                    <h1>Trending blogs</h1>
                </InPageNavigation>
            </div>
            {/* filters and trending */}
            <div>

            </div>
        </section>
    </AnimationWrapper>
  )
}