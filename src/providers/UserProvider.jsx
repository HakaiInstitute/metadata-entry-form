import React, { Component, createContext } from "react";
import { withRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { auth } from "../auth";
import firebase from "../firebase";

export const UserContext = createContext({ user: null, authIsLoading: false });

class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      authIsLoading: false,
      admins: [],
      reviewers: [],
      isReviewer: false,
    };
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  componentDidMount = () => {
    const { match } = this.props;

    const { region } = match.params;

    this.unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        const { displayName, email, uid } = userAuth;

        Sentry.addBreadcrumb({ user: email });

        firebase
          .database()
          .ref(region)
          .child(`users`)
          .child(uid)
          .child("userinfo")
          .update({ displayName, email });

        firebase
          .database()
          .ref(region)
          .child(`permissions`)
          .on("value", (permissionsFB) => {
            const permissions = permissionsFB.toJSON();

            const admins = Object.values(permissions.admins || {});
            const reviewers = Object.values(permissions.reviewers || {});

            const isAdmin = admins.includes(email);
            const isReviewer = reviewers.includes(email);

            this.setState({
              admins,
              reviewers,
              isAdmin,
              isReviewer,
            });
          });
      }
      this.setState({ user: userAuth });
    });
  };

  render() {
    const { children } = this.props;
    const translate = firebase.functions().httpsCallable("translate");

    return (
      <UserContext.Provider value={{ ...this.state, translate }}>
        {children}
      </UserContext.Provider>
    );
  }
}

export default withRouter(UserProvider);