import { gql, useSubscription } from '@apollo/client'
import { CircularProgress, Typography } from '@material-ui/core'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { SESSION_LINK_LIVE } from '../context-provider/live-session-link-context'

const SUB_EVENTS = gql`
  subscription stream($streamId: ID!) {
    stream(streamId: $streamId) {
      id,
      event
    }
  }
`

export interface Props {
    streamId: string;
    maxWidth?: string | number;
    maxHeight?: number;
    parentWidth?: any;
    parentHeight?: any;
    setParentWidth?: Dispatch<SetStateAction<any>>;
    setParentHeight?: Dispatch<SetStateAction<any>>;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>
}

export function Player ({ streamId, frameProps, parentWidth, parentHeight, setParentWidth, setParentHeight }: Props): JSX.Element {
  const ref = useRef<HTMLIFrameElement>(null);
  const [{ width, height }, setWidthHeight] = useState({ width: '0', height: '0' });

  // Buffer events until we have a page ready to render them
  const {current: bufferedEvents} = useRef<string[]>([])
  function sendEvent(event?:string) {
    if (ref.current && ref.current.contentWindow && ((ref.current.contentWindow as any).PLAYER_READY)) { 
      while (bufferedEvents.length > 0) {
        const event = bufferedEvents.shift()
        ref.current.contentWindow.postMessage({ event }, '*')
      }
      if(event) {ref.current.contentWindow.postMessage({ event }, '*')}
    } else if(event) {
        bufferedEvents.push(event)
    }
  }

  // When the page is ready, start sending buffered events
  useEffect(() => {
    if (!ref.current || !ref.current.contentWindow || !ref.current.contentWindow) { return }
    const iframeWindow = ref.current.contentWindow
    const listener = (e: MessageEvent) => {if(e.data === "ready") {sendEvent()}}
    iframeWindow.addEventListener('message', listener)
    return () => {
      if(iframeWindow&&iframeWindow.removeEventListener) {
          iframeWindow.removeEventListener("message", listener);
      }
  }
}, [ref.current, ref.current && ref.current.contentWindow]);

  const { loading, error } = useSubscription(SUB_EVENTS, {
    onSubscriptionData: e => sendEvent(e.subscriptionData.data.stream.event),
    variables: { streamId },
    context: {target: SESSION_LINK_LIVE},
  })

  useEffect(() => {
    if (ref.current == null || ref.current.contentWindow == null) { return }
    window.addEventListener('message', ({ data }) => {
      if (!data || !data.width || !data.height) { return }
      setWidthHeight({ width: data.width, height: data.height})
      if (setParentWidth && setParentHeight) {
        setParentWidth(data.width)
        setParentHeight(data.height)
      }
    })
  }, [ref.current, ref.current && ref.current.contentWindow])

  
  if(loading) {return <CircularProgress />}
  if(error) {return <Typography><FormattedMessage id="failed_to_connect" />: {JSON.stringify(error)}</Typography>}
  return <iframe
      ref={ref}
      key={streamId}
      style={{
        visibility: loading ? 'hidden' : 'visible',
        borderWidth: '1px',
        transformOrigin: 'center center'
      }}
      src={`player.html`}
      width={parentWidth && parentHeight !== 0 ? parentWidth : width}
      height={parentHeight && parentHeight !== 0 ? parentHeight: height}
      // width={width}
      // height={height}
      {...frameProps}
    />
}
