import React from 'react'
import Title from './Title'
import ParticipantsCount from './ParticipantsCount'
import ParticipantsList from './ParticipantsList'


const Details = ({ currentCount, totalCount }) => {
  return (
    <>
      <Title />
      <ParticipantsCount currentCount={currentCount} totalCount={totalCount} />
      <ParticipantsList />
    </>
  )
}

export default Details
