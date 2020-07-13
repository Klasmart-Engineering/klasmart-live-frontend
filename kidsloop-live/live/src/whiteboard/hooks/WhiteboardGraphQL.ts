import { useMutation, useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PainterEvent } from "../services/PainterEvent";

export type PainterEventFunction = (payload: PainterEvent) => void

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

export function useWhiteboardGraphQL(roomId: string | undefined, onEvent: PainterEventFunction): PainterEventFunction {
    const [sendEventMutation] = useMutation(WHITEBOARD_SEND_EVENT)

    useSubscription(SUBSCRIBE_WHITEBOARD_EVENTS, {
        onSubscriptionData: ({ subscriptionData }) => {
            if (!subscriptionData) return
            if (!subscriptionData.data) return
            if (!subscriptionData.data.whiteboardEvents) return

            const whiteboardEvent = subscriptionData.data.whiteboardEvents

            if (whiteboardEvent) {
                onEvent(whiteboardEvent)
            }
        },
        variables: { roomId }
    })

    const sendEventAction = (payload: PainterEvent) => {
        sendEventMutation({ variables: { roomId, event: JSON.stringify(payload) } })
    }

    return sendEventAction
}