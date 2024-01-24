import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Add,
  Delete,
  ArrowUpwardSharp,
  ArrowDownwardSharp,
} from "@material-ui/icons";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import validator from "validator";
import { useDebouncedCallback } from 'use-debounce';
import { En, Fr, I18n } from "../I18n";

import BilingualTextInput from "./BilingualTextInput";
import RequiredMark from "./RequiredMark";
import { deepCopy } from "../../utils/misc";
import { validateURL } from "../../utils/validate";
import { QuestionText, paperClass, SupplementalText } from "./QuestionStyles";
import { UserContext } from "../../providers/UserProvider";

const Resources = ({ updateResources, resources, disabled }) => {

  const mounted = useRef(false);
  const { checkURLActive } = useContext(UserContext);
  const [urlIsActive, setUrlIsActive] = useState({});
  const emptyResource = { url: "", name: "", description: { en: "", fr: "" } };


  // Debounce callback for URL updates
  // const debouncedResourceUrls = useDebouncedCallback((index, url) => {
  //   const newResources = [...resources];
  //   newResources[index].debouncedUrl = url;
  // }, 3000);

  // console.log(debouncedResourceUrls);

  // the below line doesn't work because useDebounce cannot be called inside a callback
  // const [debouncedResourceUrls] = resources.map((res) => useDebounce(res.url, 1000));

  // console.log(`debounced urls: ${debouncedResourceUrls}`)

  // const checkURLActive = useCallback(
  //   debounce(checkURLActive, 500),
  //   [checkURLActive]
  // );

  useEffect(() => {

    mounted.current = true;
    console.log(`resources array: ${JSON.stringify(resources)}`)

    // debouncedResources.forEach...
    resources.forEach((resource) => {
       // Check if the URL is not empty and valid
      if (resource.url && resource.debouncedUrl && validateURL(resource.url)) {

        console.log(`Checking activity for URL: ${resource.url}`);
        checkURLActive(resource.debouncedUrl)
          .then((response) => {

            // Log the entire response for debugging
            console.log(`Response from checkURLActive for ${resource.debouncedUrl}:`, response);

            const isActive = response.data; 


              setUrlIsActive((prevStatus) => ({ ...prevStatus, [resource.url]: isActive }));

              // Log based on the isActive value
              if (isActive) {
                console.log(`URL found active: ${resource.url}`);
              } else {
                console.log(`URL found inactive: ${resource.url}`);
              }
            }
          )
      } else if (!resource.url || !validateURL(resource.url)) {
        // Handles both invalid and empty URLs

          setUrlIsActive((prevStatus) => ({ ...prevStatus, [resource.url]: false }));
          console.log(`URL is invalid or empty, marked as inactive: ${resource.url}`);
        
      }
    });

    return () => {
      mounted.current = false;
    };
  }, [resources, checkURLActive, debouncedResourceUrls ]);

  function addResource() {
    updateResources(resources.concat(deepCopy(emptyResource)));
  }

  // removes the resource section from the list at index i
  function removeResource(i) {
    updateResources(resources.filter((e, index) => index !== i));
  }

  // move the resource section
  function moveResource(i, newIndex) {
    if (newIndex < 0 || newIndex >= resources.length) return;
    const element = resources.splice(i, 1)[0];
    resources.splice(newIndex, 0, element);
    updateResources(resources);
  }

  const nameLabel = <I18n en="Name" fr="Titre" />;
  const descriptionLabel = <I18n en="Description" fr="Description" />;

  console.log(`url is active object: ${JSON.stringify(urlIsActive)}`)

  return (
    <div>
      {resources.map((resourceItem = deepCopy(emptyResource), i) => {
        const urlIsValid = !resourceItem.url || validateURL(resourceItem.url);
        
        function handleResourceChange(key) {
          return (e) => {
            const newValue = [...resources];
            newValue[i][key] = e.target.value;
            updateResources(newValue);
          };
        }
        return (
          <Paper key={i} style={paperClass}>
            <Grid container direction="column" spacing={3}>
              <Grid item xs>
                <QuestionText>
                  <I18n>
                    <En>Enter a name for the resource</En>
                    <Fr>Entrez un titre pour la ressource</Fr>
                  </I18n>
                  <RequiredMark passes={resourceItem.name?.en || resourceItem.name?.fr} />
                </QuestionText>
                <BilingualTextInput
                  label={nameLabel}
                  value={resourceItem.name}
                  onChange={handleResourceChange("name")}
                  fullWidth
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs>
                <QuestionText>
                  <I18n>
                    <En>Enter the URL for the resource</En>
                    <Fr>Entrez l'URL de la ressource</Fr>
                  </I18n>

                  <RequiredMark passes={validator.isURL(resourceItem.url)} />
                  <SupplementalText>
                    <I18n>
                      <En>
                        <p>
                          The link may be to a formal data resource on another
                          repository or a link to a personal online drive (e.g.
                          Google Drive).
                        </p>
                      </En>
                      <Fr>
                        <p>
                          Le lien peut être vers une ressource de données
                          formelle sur un autre dépôt de données ou un lien vers
                          un disque personnel en ligne (par exemple Google
                          Drive).
                        </p>
                      </Fr>
                    </I18n>
                  </SupplementalText>
                </QuestionText>

                <TextField
                  helperText={
                    (!urlIsValid && <I18n en="Invalid URL" fr="URL non valide" />)
                    || (resourceItem.url && urlIsActive[resourceItem.url] === false && <I18n en="URL is not active" fr="L'URL n'est pas active" />)
                    || (resourceItem.url && urlIsActive[resourceItem.url] === true && <I18n en="URL is active" fr="L'URL est active" />)
                  }
                  error={!urlIsValid}
                  label="URL"
                  value={resourceItem.url}
                  onChange={handleResourceChange("url")}
                  fullWidth
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs>
                <QuestionText>
                  <I18n>
                    <En>Enter a description of the resource</En>
                    <Fr>Entrez une description de la ressource</Fr>
                  </I18n>
                </QuestionText>{" "}
                <BilingualTextInput
                  name="description"
                  label={descriptionLabel}
                  value={resourceItem.description}
                  onChange={handleResourceChange("description")}
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs>
                <Button
                  startIcon={<Delete />}
                  disabled={disabled}
                  onClick={() => removeResource(i)}
                >
                  <I18n>
                    <En>Remove item</En>
                    <Fr>Supprimer la ressource</Fr>
                  </I18n>
                </Button>
                <Button
                  startIcon={<ArrowUpwardSharp />}
                  disabled={disabled || i - 1 < 0}
                  onClick={() => moveResource(i, i - 1)}
                >
                  <I18n>
                    <En>Move up</En>
                    <Fr>Déplacer vers le haut</Fr>
                  </I18n>
                </Button>
                <Button
                  startIcon={<ArrowDownwardSharp />}
                  disabled={disabled || i + 1 >= resources.length}
                  onClick={() => moveResource(i, i + 1)}
                >
                  <I18n>
                    <En>Move down</En>
                    <Fr>Déplacer vers le bas</Fr>
                  </I18n>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        );
      })}

      <Paper style={paperClass}>
        <Button startIcon={<Add />} disabled={disabled} onClick={addResource}>
          <I18n>
            <En>Add item</En>
            <Fr>Ajouter une ressource</Fr>
          </I18n>
        </Button>
      </Paper>
    </div>
  );
};

export default Resources;
