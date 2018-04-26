import React from 'react'
import { connect } from 'react-redux'
import { registerUser } from '../../store/actions/security.actions'

class Register extends React.PureComponent<MergedProps, OwnState> {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    }
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()

    const { registerAction } = this.props
    const { email, firstName, lastName, password, confirmPassword } = this.state

    if (password !== confirmPassword) throw new Error('Passwords do not match')

    registerAction(email, firstName, lastName, password)
  }

  render() {
    const { email, firstName, lastName, password, confirmPassword } = this.state
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
          <input id='email' type='text' value={email} onChange={this.handleChange('email')} />
          <label htmlFor='first-name'>First name:</label>
          <input id='first-name' type='text' value={firstName} onChange={this.handleChange('firstName')} />
          <label htmlFor='last-name'>Last name:</label>
          <input id='last-name' type='text' value={lastName} onChange={this.handleChange('lastName')} />
          <label htmlFor='password'>Password:</label>
          <input id='password' type='password' value={password} onChange={this.handleChange('password')} />
          <label htmlFor='confirm-password'>Confirm password:</label>
          <input id='confirm-password' type='text' value={confirmPassword} onChange={this.handleChange('confirmPassword')} />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button type='submit'>Submit</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  registerAction: (email, firstName, lastName, password) => dispatch(registerUser(email, firstName, lastName, password)),
})

export default connect<{}, DispatchProps>(null, mapDispatchToProps)(Register)

export interface OwnProps { }

interface OwnState {
  email: string
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
}

interface DispatchProps {
  registerAction: (email: string, firstName: string, lastName: string, password: string) => void
}

type MergedProps = OwnProps & DispatchProps