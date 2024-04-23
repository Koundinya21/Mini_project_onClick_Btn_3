import './index.css'
// import {useContext} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
// import DetailsContext from '../../ReactContext'
import TimeUp from '../TimeUp'

// import ScoreContext from '../../ReactContext'

// const Results = ({location}) => {
//   const {score} = location.state
//   const {completedTime} = props
const Results = props => {
  const {location} = props
  const {score, isTimeRunning, elapsedTimeInSeconds} = location.state
  console.log(elapsedTimeInSeconds)
  console.log(isTimeRunning)
  console.log(score)

  const hours = Math.floor(elapsedTimeInSeconds / 3600)
  const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60)
  const seconds = Math.floor(elapsedTimeInSeconds % 60)
  const disHr = hours > 9 ? hours : `0${hours}`
  const disMin = minutes > 9 ? minutes : `0${minutes}`
  const disSec = seconds > 9 ? seconds : `0${seconds}`
  const formattedTime = `${disHr}:${disMin}:${disSec}`

  const scoreValue = score === 10 ? {score} : `0${score}`

  return isTimeRunning ? (
    <div>
      <Header />
      <div className="bg-container">
        <div className="component">
          <div className="result-card-container">
            <div className="bg-card">
              <img
                src="https://res.cloudinary.com/dowxofd2k/image/upload/v1711890610/Asset_2_1_c8uttm.png"
                alt="submit"
                className="img-submit"
              />
              <p className="para">Congrats! You completed the assessment</p>
              <p className="time-taken">Time Taken: {formattedTime}</p>
              <p className="score">Your score:{scoreValue}</p>
              <Link to="/assessment">
                <button type="button" className="reattempt-btn">
                  Reattempt
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <TimeUp score={score} />
  )
}



export default Results
