import React from 'react'
import Title from './Title'
import ParticipantsCount from './ParticipantsCount'
import ParticipantsList from './ParticipantsList'
import EditContent from './EditContent'


// 全部組件整合
const Details = ({ currentCount, totalCount }) => {
  return (
    <>
      <Title />
      <EditContent/>
      <ParticipantsCount currentCount={currentCount} totalCount={totalCount} />
      <ParticipantsList />
    </>
  )
}

export default Details
