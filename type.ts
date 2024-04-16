export interface TPlan {
  _id: string,
  color: string | 'indigo'
  width: number | 4
  startDate: string,
  endDate: string,
  demo: string,
  kind: string,
  title: string,
  user: {
    id: string,
    username: string,
    email: string
  },
  createdAt: string,
  updatedAt: string,
  __v: string
}
export interface TScheduleKind {
  _id: string,
  name: string,
  avatar: string,
  created_at?: string,
  updated_at?: string,
  __v?: string
}

export interface TOneDay {
  color?: string | 'indigo'
  width: number
  datesCnt?: number
  date: string,
  month: number,
  no: number,
  plan?: TPlan[]
}
export default TOneDay;