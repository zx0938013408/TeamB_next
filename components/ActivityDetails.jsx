import React from 'react'
import ActivityHeader from '../components/ActivityEditHeader'
import ParticipantsCount from '../components/ParticipantsCount'
import ParticipantsList from './ParticipantsList'


const ActivityDetails = ({ currentCount, totalCount }) => {
  return (
    <>
      <ActivityHeader />
      <ParticipantsCount currentCount={currentCount} totalCount={totalCount} />
      <ParticipantsList />
    </>
  )
}

export default ActivityDetails
