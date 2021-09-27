import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.less'
import Home from 'component/page/home'
import TrainerList from 'component/page/trainerList'
import PendingTrainerList from 'component/page/pendingTrainerList'
import About from 'component/page/about'
import Notfound from 'component/page/notFound'
import AppLayout from 'component/layout/appLayout'
import Login from 'component/page/login'
import useFindUser from 'hook/useFindUser'
import Loader from 'component/common/loader'
import UserContext from 'context/userContext'
// import PrivateRoute from 'component/auth/privateRoute'
import ClientList from 'component/page/clientList'
import PurchaseHistoryList from 'component/page/purchaseHistoryList'
import BookingList from 'component/page/bookingList'
import ClientCreate from 'component/page/clientCreate'
import TrainerCreate from 'component/page/trainerCreate'
import ContactList from 'component/page/contactList'
import ContactCreate from 'component/page/contactCreate'

const App = () => {
    const { user, setUser, isLoading } = useFindUser()
    if (isLoading) {
        return <Loader size="large" tip="Loading..." spin />
    }
    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            <Router>
                <div>
                    <Switch>
                        <AppLayout>
                            <Switch>
                                <Route path="/login" exact>
                                    <Login />
                                </Route>
                                <Route path="/contacts" exact>
                                    <ContactList />
                                </Route>
                                <Route path="/contact-create" exact>
                                    <ContactCreate />
                                </Route>
                            </Switch>
                        </AppLayout>
                        {/* <AppLayout>
                            <Switch>
                                <PrivateRoute path="/" exact component={PendingTrainerList} />
                                <PrivateRoute path="/trainer-list" exact component={TrainerList} />
                                <PrivateRoute
                                    path="/trainer-create"
                                    exact
                                    component={TrainerCreate}
                                />
                                <PrivateRoute
                                    path="/pending-trainer-list"
                                    exact
                                    component={PendingTrainerList}
                                />
                                <PrivateRoute path="/client-list" exact component={ClientList} />
                                <PrivateRoute
                                    path="/client-create"
                                    exact
                                    component={ClientCreate}
                                />
                                <PrivateRoute
                                    path="/purchase-history-list"
                                    exact
                                    component={PurchaseHistoryList}
                                />
                                <PrivateRoute path="/booking-list" exact component={BookingList} />
                                <PrivateRoute path="/about" exact component={About} />
                                <Route path="*">
                                    <Notfound />
                                </Route>
                            </Switch>
                        </AppLayout> */}
                    </Switch>
                </div>
            </Router>
        </UserContext.Provider>
    )
}
export default App
