import React from "react";
import { Typography, List, CircularProgress } from "@material-ui/core";
import { getDatabase, ref, onValue } from "firebase/database";
import firebase from "../../firebase";
import MetadataRecordListItem from "../FormComponents/MetadataRecordListItem";
import { auth, getAuth, onAuthStateChanged } from "../../auth";
import {
  cloneRecord,
  loadRegionRecords,
} from "../../utils/firebaseRecordFunctions";
import { Fr, En, I18n } from "../I18n";
import FormClassTemplate from "./FormClassTemplate";

class Published extends FormClassTemplate {
  constructor(props) {
    super(props);
    this.state = {
      records: {},
      deleteModalOpen: false,
      submitModalOpen: false,
      withdrawModalOpen: false,
      modalKey: "",
      modalRecord: null,
      loading: false,
    };
  }

  async loadRecords() {
    this.setState({ loading: true });
    const { match } = this.props;
    const { region } = match.params;

    this.unsubscribe = onAuthStateChanged(getAuth(firebase), async (user) => {
      if (user) {
        const database = getDatabase(firebase);
        const usersRef = ref(database, `${region}/users`);

        onValue(usersRef, (regionRecordsFB) => {
          const records = loadRegionRecords(regionRecordsFB, ["published"]);
          this.setState({ records, loading: false });
        });
        this.listenerRefs.push(usersRef);
      }
    });
  }

  async componentDidMount() {
    this.loadRecords();
  }

  editRecord(key, userID) {
    const { match, history } = this.props;
    const { language, region } = match.params;
    history.push(`/${language}/${region}/${userID}/${key}`);
  }

  // user ID is that of the record owner, not the editor
  handleCloneRecord(recordID, sourceUserID) {
    const { match } = this.props;
    const { region } = match.params;

    if (auth.currentUser) {
      cloneRecord(recordID, sourceUserID, auth.currentUser.uid, region);
    }
  }

  render() {
    const { match } = this.props;
    const { region } = match.params;
    const { records, loading } = this.state;

    const recordDateSort = (a, b) => new Date(b.created) - new Date(a.created);

    return (
      <div>
        <Typography variant="h5">
          <I18n>
            <En>Published Records</En>
            <Fr>Dossiers publiés</Fr>
          </I18n>
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <span>
            <div>
              <Typography>
                <I18n>
                  <En>These are the published records in your region.</En>
                  <Fr>
                    Il s'agit des enregistrements publiés dans votre région.
                  </Fr>
                </I18n>
              </Typography>

              <List>
                {records && records.length
                  ? records
                      .sort(recordDateSort)
                      .filter((record) => record.status === "published")
                      .map((record) => {
                        const { title } = record;

                        if (!(title?.en || !title?.fr)) return null;

                        return (
                          <MetadataRecordListItem
                            record={record}
                            key={record.recordID}
                            onViewEditClick={() =>
                              this.editRecord(
                                record.recordID,
                                record.userinfo?.userID
                              )
                            }
                            showDeleteAction={false}
                            showUnSubmitAction={false}
                            showCloneAction
                            showAuthor
                            showViewAction
                            onCloneClick={() =>
                              this.handleCloneRecord(
                                record.recordID,
                                record.userinfo?.userID,
                                region
                              )
                            }
                          />
                        );
                      })
                  : ""}
              </List>
            </div>

            {!records && (
              <Typography>
                <I18n>
                  <En>There are no published records.</En>
                  <Fr>Il n'y a pas de documents publiés.</Fr>
                </I18n>
              </Typography>
            )}
          </span>
        )}
      </div>
    );
  }
}

export default Published;
