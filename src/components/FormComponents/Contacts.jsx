import React from "react";
import { Add, Delete } from "@material-ui/icons";
import { Grid, IconButton } from "@material-ui/core";
import Contact from "./Contact";
// import memoize from "../../utils/memoize";
import { deepCopy } from "../../utils/misc";

const initial = {
  orgName: "",
  orgEmail: "",
  orgURL: "",
  orgAdress: "",
  orgCity: "",
  orgCountry: "",
  indName: "",
  indPosition: "",
  indEmail: "",
};

const Contacts = ({ onChange, value, name, disabled }) => {
  function addItem() {
    const changes = {
      target: {
        name,
        value: value.concat([deepCopy(initial)]),
      },
    };

    onChange(changes);
  }
  function handleChange(i) {
    return (e) => {
      let newValue = [...value];
      const propName = e.target.name;
      newValue[i][propName] = e.target.value;
      const parentEvent = { target: { name, value: newValue } };
      onChange(parentEvent);
    };
  }
  function removeItem(i) {
    onChange({
      target: { name, value: value.filter((e, index) => index !== i) },
    });
  }
  return (
    <Grid container>
      {value.map((contact, i) => {
        return (
          <Grid key={i} container>
            <Grid item xs={9} style={{ marginLeft: "10px" }}>
              <Contact
                showRolePicker
                name={"contact_" + i}
                value={contact}
                onChange={handleChange(i)}
              />
            </Grid>

            <Grid item xs={2}>
              <IconButton disabled={disabled} onClick={() => removeItem(i)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        );
      })}
      <IconButton onClick={addItem} disabled={disabled}>
        <Add />
      </IconButton>
    </Grid>
  );
};

// const areEqual = (
//   { onChange: a, ...prevProps },
//   { onChange: b, ...nextProps }
// ) => {
//   return JSON.stringify(prevProps.value) === JSON.stringify(nextProps.value);
// };

// const memoize2 = (fn) => React.memo(fn, areEqual);

export default Contacts;