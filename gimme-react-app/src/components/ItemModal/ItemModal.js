import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeGet } from '../../tools/APIRequests';
import { useOnClickOutside } from '../../tools/CustomHooks';

import ImageViewer from './ImageViewer/ImageViewer';
import EditableText from './Texts/EditableText';
import EditableTags from './Tags/EditableTags';
import EditableLinks from './Links/EditableLinks';
import WarningBox from '../WarningBox';
import Button from '../Button';

import classes from './ItemModal.module.scss';


// ItemModal Component used for viewing a selected item
//   when viewing from the owner of the item's account.
//   Component allows for editing of the item fields,
//   sending update requests to the database
//
// REQUIRED PROPS {
//   item : {name, tags, notes, links, images}
//   isCreatingNewItem : bool
//   isEditable : bool
//   onClose : func
//   onDelete : func
//   onSave : func
// }
function ItemModal(props) {
  const navigate = useNavigate();
  const [state, setState] = useState({
    itemState: props.item,
    isEditing: props.isCreatingNewItem,
    showDeleteWarningBox: false,
    saveState: false,
  })


  // Hook used to queue an item update whenever
  //   the state.saveState is changed. Use as
  //   an effect to ensure latest state update.
  useEffect(() => {
    setState((prev) => {
      return { ...prev, itemState: props.item }
    })
  }, [props.item])


  // Wrapper used to detect clicks outside of
  //   modal, triggering the parent to close it
  const wrapperRef = useRef(null);
  useOnClickOutside(wrapperRef, props.onClose);


  // Method called to enter editing mode,
  //   triggering Editable components to switch
  //   into their 'editable' states
  function enterEditMode() {
    if(props.isEditable){
      setState((prevState) => {
        return { ...prevState, isEditing: true };
      });
    }
  }


  // Method calle to exit editing mode,
  //   triggering a itemState reset to the
  //   current copy of the true item
  function exitEditMode() {
    if(props.isEditable){
      if(props.isCreatingNewItem) props.onClose();
      const savedItemState = {...props.item};
      const newState = {
        itemState: savedItemState,
        isEditing: false,
      }
      setState(newState);
    }
  }


  // Method called by children whenever a change
  //   is made while in editing mode. Changes made
  //   by children are preserved but not yet saved.
  function preserveValue(itemKey, itemValue){
    if(props.isEditable){
      setState((prevState) => {
        if(prevState.itemState[itemKey] === itemValue) return prevState;

        const newItemState = {...prevState.itemState};
        newItemState[itemKey] = itemValue;
        return { ...prevState, itemState: newItemState, isEditing: true };
      });
    }
  }


  // Method called when making permanent changes,
  //   queuing a saveState change for updated changes.
  //   Method may be called by children.
  async function saveChanges() {
    if(props.isEditable){
      setState((prevState) => {
        props.onSave(prevState.itemState);
        return { ...prevState, isEditing: false };
      });
    }
  }


  function deleteItem() {
    if(props.isEditable){
      props.onDelete()
    }
  }


  function toggleDeleteWarningBoxHandler() {
    if(props.isEditable){
      setState((prevState) => {
        return { ...prevState, showDeleteWarningBox: !prevState.showDeleteWarningBox }
      })
    }
  }


  async function redirectToList() {
    const result = await makeGet(`/userHandleFromItemId/${props.item._id}`);
    if(!result.error) {
      props.onClose()
      navigate(`/${result.handle}/lists/${props.item.listId}`)
    }
  }



  return (
    <div ref={wrapperRef} className={classes.ItemModal} >
      <div className={classes.closeButton} onClick={props.onClose}>
        <div className={classes.closeButton__icon}></div>
      </div>

      <ImageViewer
        images={state.itemState.images}
        isEditing={state.isEditing}
        itemKey='images'
        onSave={saveChanges}
        onPreserveValue={(key,value)=>preserveValue(key,value)}
      />

      <div className={classes.productInfo}>
        { state.showDeleteWarningBox &&
          <WarningBox
            warning={'Delete this item?'}
            onCancel={toggleDeleteWarningBoxHandler}
            onConfirm={deleteItem}
          />
        }


        <div className={classes.actions}>
          {props.isEditable && !state.isEditing && <Button onClick={enterEditMode}>edit</Button>}
          {!state.isEditing && <Button onClick={redirectToList}>view list</Button>}
          {state.isEditing && <Button onClick={exitEditMode}>cancel</Button>}
          {state.isEditing && <Button onClick={saveChanges}>save changes</Button>}
          {state.isEditing && !props.isCreatingNewItem && <Button classTypes={['danger', 'end']} onClick={toggleDeleteWarningBoxHandler}>delete item</Button>}
        </div>

        <EditableText
          text={state.itemState.name}
          isEditing={state.isEditing}
          itemKey={'name'}
          onSave={saveChanges}
          onPreserveValue={(key,value)=>preserveValue(key,value)}
        />

        <EditableTags
          tags={state.itemState.tags}
          isEditing={state.isEditing}
          itemKey={'tags'}
          onSave={saveChanges}
          onPreserveValue={(key,value)=>preserveValue(key,value)}
        />

        <EditableText
          text={state.itemState.notes}
          isEditing={state.isEditing}
          itemKey={'notes'}
          onSave={saveChanges}
          onPreserveValue={(key,value)=>preserveValue(key,value)}
        />

        <EditableLinks
          links={state.itemState.links}
          isEditing={state.isEditing}
          itemKey={'links'}
          onSave={saveChanges}
          onPreserveValue={(key,value)=>preserveValue(key,value)}
        />
      </div>
    </div>
  );
}

export default ItemModal;
