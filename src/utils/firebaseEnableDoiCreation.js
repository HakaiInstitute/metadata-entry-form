import firebase from "../firebase";

export async function newDataciteAccount(region, prefix, authHash) {
    const dataciteRef = await firebase
        .database()
        .ref("admin")
        .child(region)
        .child("dataciteCredentials");
    
    // Overwriting prefix and authHash directly under dataciteCredentials
    await dataciteRef.set({
      prefix,
      dataciteHash: authHash,
  });
}

export async function deleteAllDataciteCredentials(region) {
  try {
    // Reference to the dataciteCredentials node for the specified region
    const dataciteCredentialsRef = firebase
      .database()
      .ref("admin")
      .child(region)
      .child("dataciteCredentials");

    // Deleting the dataciteCredentials node and all its children
    await dataciteCredentialsRef.remove();

    // Return a message indicating success
    return { success: true, message: "All Datacite credentials deleted successfully." };
  } catch (error) {
    // Log and return an error message
    console.error("Error deleting Datacite credentials:", error);
    return { success: false, message: "Failed to delete Datacite credentials." };
  }
}

export async function getDatacitePrefix(region) {
    try {
      const prefix = (await firebase.database().ref('admin').child(region).child("dataciteCredentials").child("prefix").once("value")).val();
      return prefix;
  } catch (error) {
      console.error(`Error fetching Datacite Prefix for region ${region}:`, error);
      return null;
  }
}