import * as React from 'react'
import { SFC, useRef, useEffect } from 'react'
import { useConfig } from 'docz'
import styled from 'styled-components'
import Hash from 'react-feather/dist/icons/hash'

import { get } from '../../utils/theme'

import scrollama from 'scrollama'
import 'intersection-observer'

const Icon = styled(Hash)`
  position: absolute;
  display: inline-block;
  top: 9px;
  left: -23px;
  opacity: 0;
  transition: opacity 0.2s;
  color: ${get('colors.primary')};
`

const Heading = styled.h2`
  position: relative;
  width: fit-content;
  
  &:hover .heading--Icon {
    opacity: 1;
  }

  & a {
    position: absolute;
  }

  ${get('styles.h2')};
`

export const H2: SFC<React.HTMLAttributes<any>> = ({ children, ...props }) => {
  const pathname = typeof window !== 'undefined' ? location.pathname : '/'
  const { linkComponent: Link } = useConfig()
  if (!Link) return null

  useEffect(() => {
    // 空标题直接 return
    if (!props.id) {
      return
    }

    // instantiate the scrollama
    const scroller = scrollama()

    // setup the instance, pass callback functions
    const percentage = 100 / window.innerHeight;
    scroller
      .setup({
        step: '#' + props.id,
        offset: percentage,
        threshold: 1,
        order: false,
      })
      .onStepEnter(() => {
        if (props.id !== localStorage.getItem('currentSlug')) {
          localStorage.setItem('currentSlug', props.id || '')
          window.dispatchEvent(new Event('storage'))
        }
      })

    // setup resize event
    window.addEventListener('resize', scroller.resize)

    return () => {
      window.removeEventListener('resize', scroller.resize)
    }
  }, [])

  const onClickLink = (e: any) => {
    e.preventDefault();
    const dom = document.querySelector('#' + props.id) as HTMLElement;
    if(dom){
      window.location.hash = '#' + props.id;
      window.setTimeout(()=>{
        const distance = dom.offsetTop - 16;
        window.scrollTo(0, distance);
      })
    }
  }

  return (
    <Heading {...props}>
      <Link onClick={onClickLink} aria-hidden to={''}>
        <Icon className="heading--Icon" height={20} />
      </Link>
      {children}
    </Heading>
  )
}
