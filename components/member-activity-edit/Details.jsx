import React from 'react'
import Title from './Title'
import ParticipantsCount from './ParticipantsCount'
import ParticipantsList from './ParticipantsList'
import EditContent from './EditContent'
import '@/styles/member-activity-edit/page.module.css'
import Announcements from './Announcements'
import CancelActivity from './CancelActivity'


// 全部組件整合
const Details = ({ currentCount, totalCount }) => {
  return (
    <>
      <Title />
      <ParticipantsCount currentCount={currentCount} totalCount={totalCount} />
      <EditContent/>
      <ParticipantsList />
      <Announcements/>
      <CancelActivity/>
    </>
  )
}

export default Details
