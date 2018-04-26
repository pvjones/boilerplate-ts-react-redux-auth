import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { signIn } from '../../store/actions/security.actions'

class Login extends React.PureComponent<MergedProps, OwnState> {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value })
  }

  handleSubmit = e => {
    const { loginAction } = this.props
    const { email, password } = this.state
    loginAction(email, password)
    e.preventDefault()
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'space-between',
            width: '240px',
          }}
        >
          <label htmlFor='email'>Email:</label>
          <input id='email' type='text' value={this.state.email} onChange={this.handleChange('email')} />
          <label htmlFor='password'>Password:</label>
          <input id='password' type='password' value={this.state.password} onChange={this.handleChange('password')} />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button type='submit'>Sign In</button>
            <button onClick={e => e.stopPropagation()}>
              <Link to='/register'>Register</Link>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loginAction: (email, password) => dispatch(signIn(email, password)),
})

export default connect<{}, DispatchProps>(null, mapDispatchToProps)(Login)

export interface OwnProps { }

interface OwnState {
  email: string
  password: string
}

interface DispatchProps {
  loginAction: (email: string, password: string) => void
}

type MergedProps = OwnProps & DispatchProps