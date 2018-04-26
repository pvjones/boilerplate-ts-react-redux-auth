import React from 'react'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/security.actions'

const Home: React.SFC<MergedProps> = ({ logoutAction }) => (
  <React.Fragment>
    <div>Home</div>
    <button
      onClick={() => logoutAction()}
    >
      Logout
    </button>
  </React.Fragment>
)

const mapDispatchToProps = dispatch => ({
  logoutAction: () => dispatch(signOut()),
})

export default connect(null, mapDispatchToProps)(Home)

interface OwnProps { }

interface StoreProps {
  logoutAction: () => void
}

type MergedProps = OwnProps & StoreProps
