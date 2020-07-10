import React, { createContext, useState, useMemo } from 'react'
import { IntlProvider } from 'react-intl'
import { en } from './localization/en'
import {Join} from './pages/join'
import { Room } from './room'
import { LessonMaterial } from './lessonMaterialContext'
import { Typography } from '@material-ui/core'
import jwt_decode = require('jwt-decode')

export interface IUserContext {
  teacher: boolean,
  materials: LessonMaterial[]
  roomId: string,
  name?: string,
  setName: React.Dispatch<React.SetStateAction<string|undefined>>
}

export const UserContext = createContext<IUserContext>(undefined as any as IUserContext)

function parseToken() {
  try {
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token')
    if(!token) {return}
      const payload = jwt_decode(token) as any
      return {
        teacher:Boolean(payload.teacher),
        name:payload.name?String(payload.name):undefined,
        roomId:String(payload.roomid),
        materials: payload.materials,
      }
  // eslint-disable-next-line no-empty
  } catch(e) {}
  return
}
const params = parseToken()
export function App (): JSX.Element {
  if(!params) {return <Typography>Invalid token, could not connect to class</Typography>}
  const [name, setName] = useState(params.name)
  const userContext = useMemo<IUserContext>(() => ({
    name,
    setName,
    roomId: params.roomId,
    teacher: params.teacher,
    materials: params.materials
  }), [name, setName, params])

  return (
    <IntlProvider locale="en" messages={en}>
      {
        !userContext.name
        ? <Join /> :
        <UserContext.Provider value={userContext}>
            <UserContext.Provider value={userContext}>
              <Room teacher={userContext.teacher} />
            </UserContext.Provider>
          </UserContext.Provider>
      }
    </IntlProvider>
  )
}
