import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.less'
import Notfound from 'component/page/notFound'
import AppLayout from 'component/layout/appLayout'
import UserContext from 'context/userContext'
import ContactList from 'component/page/contactList'
import ContactCreate from 'component/page/contactCreate'

const App = () => {
    return (
        <UserContext.Provider>
            <Router>
                <div>
                    <Switch>
                        <AppLayout>
                            <Switch>
                                <Route path="/contacts" exact>
                                    <ContactList />
                                </Route>
                                <Route path="/contact-create" exact>
                                    <ContactCreate />
                                </Route>
                            </Switch>
                        </AppLayout>
                    </Switch>
                </div>
            </Router>
        </UserContext.Provider>
    )
}
export default App
