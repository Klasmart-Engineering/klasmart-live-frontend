import { useMutation, useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useCallback } from "react";
import { PainterEvent } from "../types/PainterEvent";

export type PainterEventFunction = (roomId: string, payload: PainterEvent) => void

const WHITEBOARD_SEND_EVENT = gql`
  mutation whiteboardSendEvent($roomId: ID!, $event: String) {
    whiteboardSendEvent(roomId: $roomId, event: $event)
  }
`

const SUBSCRIBE_WHITEBOARD_EVENTS = gql`
  subscription whiteboardEvents($roomId: ID!) {
    whiteboardEvents(roomId: $roomId) {
      type
      id
      param
    }
  }
`

export function useWhiteboardGraphQL(roomId: string | undefined, onEvent: PainterEventFunction): [PainterEventFunction, boolean] {
  const [sendEventMutation] = useMutation(WHITEBOARD_SEND_EVENT)

  const { loading } = useSubscription(SUBSCRIBE_WHITEBOARD_EVENTS, {
    onSubscriptionData: ({ subscriptionData: { data: { whiteboardEvents }} }) => {
      if (whiteboardEvents) {
          receiveEventHandler(whiteboardEvents)
      }
  }, variables: { roomId } })

  const receiveEventHandler = useCallback((whiteboardEvent: any) => {
    if (roomId !== undefined) {
      onEvent(roomId, whiteboardEvent)
    }
  }, [onEvent, roomId])

  const sendEventAction = (roomId: string, payload: PainterEvent) => {
    sendEventMutation({ variables: { roomId, event: JSON.stringify(payload) } })
  }

  return [sendEventAction, loading]
}