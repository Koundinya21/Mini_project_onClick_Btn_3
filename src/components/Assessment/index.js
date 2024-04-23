import {Component} from 'react'

import {Link} from 'react-router-dom'

import './index.css'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

// import DetailsContext from '../../ReactContext'
import Header from '../Header'

import QuestionsBtn from '../QuestionsBtn'
// import Timer from '../Timer'

import OptionsContent from '../Options'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// const contextType = DetailsContext

class Assessment extends Component {
  state = {
    questionsData: [],
    apiStatus: apiStatusConstants.initial,
    currentQuestion: 0,
    selectedOptionId: '',
    score: 0,
    timerMinutes: 10,
    elapsedTimeInSeconds: 0,
    isTimeRunning: false,

    // timerRunning: true,
  }

  componentDidMount() {
    this.requestingQuestions()
    this.renderTimerComponent()
  }

  componentWillUnmount() {
    this.clearInterval()
  }

  clearInterval = () => this.clearInterval(this.timerId)

  IncrementOfElapsedTime = () => {
    const {elapsedTimeInSeconds, timerMinutes} = this.state
    const timerCompleted = timerMinutes * 60 === elapsedTimeInSeconds

    if (timerCompleted) {
      this.clearInterval()
      this.setState({
        isTimeRunning: false,
      })
    } else {
      this.setState(prev => ({
        elapsedTimeInSeconds: prev.elapsedTimeInSeconds + 1,
      }))
    }
  }

  renderTimerComponent = () => {
    this.timerId = setInterval(this.IncrementOfElapsedTime, 1000)
  }

  renderCompletedTime = () => {
    const {elapsedTimeInSeconds, timerMinutes} = this.state
    const timeRemaining = timerMinutes * 60 - elapsedTimeInSeconds

    const Min = Math.floor(timeRemaining / 60)
    const Sec = Math.floor(timeRemaining % 60)

    const stringifiedMin = Min > 9 ? Min : `0${Min}`
    const StringifiedSec = Sec > 9 ? Sec : `0${Sec}`

    return `00:${stringifiedMin}:${StringifiedSec}`
  }

  renderTimer = () => (
    <div className="timer-container">
      <h1 className="heading">Time Left</h1>
      <p className="time">{this.renderCompletedTime()}</p>
    </div>
  )

  setActiveOption = optionId => {
    this.setState({selectedOptionId: optionId})
  }

  onChangeSingleOption = event => {
    this.setState({selectedOptionId: event.target.value})
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" width="50" height="50" />
    </div>
  )

  requestingQuestions = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/assess/questions'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)

      const updatedData = fetchedData.questions.map(question => ({
        id: question.id,
        optionsType: question.options_type,
        questionsText: question.question_text,
        options: question.options.map(option => ({
          imageUrl: option.image_url,
          idOption: option.id,
          text: option.text,
          isCorrect: option.is_correct,
        })),
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        questionsData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dowxofd2k/image/upload/v1706372545/ugqa3jsdrqmpgseeyt8v.png"
        alt="failure"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something went wrong</h1>
      <p className="failure-para">We are having some trouble</p>
      <Link to="/assessment">
        <button type="button">Retry</button>
      </Link>
    </div>
  )

  toFindIndexOfTrue = () => {
    const {questionsData, currentQuestion} = this.state

    const displayingOneQuestion = questionsData[currentQuestion]
    const optionsValue = displayingOneQuestion.options

    function toFindTrue(option) {
      return option.isCorrect === 'true'
    }

    return optionsValue.find(toFindTrue)
  }

  checkTheAnswer = () => {
    const {selectedOptionId} = this.state
    const CorrectValue = this.toFindIndexOfTrue()
    console.log(CorrectValue.idOption)
    console.log('CHecking')
    if (CorrectValue.idOption === selectedOptionId) {
      this.setState(prev => ({
        score: prev.score + 1,
      }))
    }
  }

  increaseCount = () => {
    const {questionsData, currentQuestion} = this.state

    if (currentQuestion < questionsData.length) {
      this.setState(prev => ({
        currentQuestion: prev.currentQuestion + 1,
        selectedOptionId: '',
      }))
      this.checkTheAnswer()
    } else {
      console.log('Ended')
    }
  }

  changeOption = optionId => {
    this.setState({selectedOptionId: optionId})
  }

  ClickSubmitBtn = () => {
    const {history} = this.props
    const {score, isTimeRunning, elapsedTimeInSeconds} = this.state
    // const {setElapsedTimeInSeconds} = contextType
    // console.log(setElapsedTimeInSeconds)
    // this.setState({
    //   isTimeRunning: false,
    // })
    // setElapsedTimeInSeconds(elapsedTimeInSeconds)

    // console.log(score)

    history.replace('/results', {score, isTimeRunning, elapsedTimeInSeconds})
  }

  handleQuestionClick = questionIndex => {
    this.setState({currentQuestion: questionIndex})
  }

  renderQuestions = () => {
    const {questionsData, currentQuestion, selectedOptionId, score} = this.state

    const displayingOneQuestion = questionsData[currentQuestion]
    const optionsValue = displayingOneQuestion.options

    const NumberOfQuestions = questionsData.length
    // console.log(selectedOptionId)

    console.log(NumberOfQuestions)
    console.log(score)
    return (
      <div className="Main-Background">
        <div>
          <div className="container">
            <div className="questions-Container">
              <div className="space-between-btn-questions">
                <h1 className="question">
                  {currentQuestion + 1}.{displayingOneQuestion.questionsText}
                </h1>

                <hr className="line" />

                <OptionsContent
                  optionType={displayingOneQuestion.optionsType}
                  options={optionsValue}
                  changeOption={this.changeOption}
                  activeOption={selectedOptionId}
                />
              </div>

              {currentQuestion < 9 && (
                <div className="button-container">
                  <button
                    type="button"
                    className="next-button"
                    onClick={this.increaseCount}
                  >
                    Next Question
                  </button>
                </div>
              )}
            </div>

            <div>
              {/* <Timer isTimerRunning={isTimerRunningBeforeSubmit} /> */}
              {this.renderTimer()}
              <div className="questions-btn-space">
                <QuestionsBtn
                  currentQuestion={currentQuestion}
                  questionsData={questionsData}
                  handleQuestionClick={this.handleQuestionClick}
                />
                <div className="btn-container">
                  <button
                    type="button"
                    className="btn-submit"
                    onClick={this.ClickSubmitBtn}
                  >
                    Submit Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

 
  }

  renderTheQuestionsPart = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderQuestions()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="Assessment-container">
        <Header />
        {this.renderTheQuestionsPart()}
      </div>
    )
  }
}
export default Assessment

