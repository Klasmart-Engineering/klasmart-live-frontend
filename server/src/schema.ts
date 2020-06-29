import { gql } from 'apollo-server'

export const schema = gql`
  type Query {
    ready: Boolean
    session(roomId: ID!, sessionId: ID!): Session 
  }

  type Mutation {
    setSessionStreamId(roomId: ID!, streamId: ID!): Boolean
    showContent(roomId: ID!, type: ContentType!, contentId: ID): Boolean
    sendMessage(roomId: ID!, message: String): Message
    postPageEvent(streamId: ID!, pageEvents: [PageEventIn]): Boolean
  }

  type Subscription {
    room(roomId: ID!, name: String): RoomNotification
    stream(streamId: ID!, from: ID): PageEventOut
  }

  type RoomNotification {
    message: Message
    join: Session
    leave: Session
    content: Content
  }

  type Session {
    id: ID!,
    name: String,
    streamId: ID
  }

  enum ContentType {
    Blank,
    Stream,
    Activity,
  }

  type Content {
    type: ContentType!,
    contentId: ID
  }
  
  type Message {
    id: ID!
    session: Session
    message: String
  }

  input PageEventIn {
    sequenceNumber: Int
    isKeyframe: Boolean
    eventsSinceKeyframe: Int
    eventData: String!
  }

  type PageEventOut {
    id: ID!
    index: Int
    checkout: Boolean
    event: String!
  }
`
