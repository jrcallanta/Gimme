import React from 'react';
import { makeGet, makePost } from '../../tools/APIRequests';

import ItemModal from '../ItemModal/ItemModal';
import InputTitle from '../InputTitle';
import WarningBox from '../WarningBox';
import DropDownMenu from '../DropDownMenu';
import Button from '../Button'
import Tag from './Tag'
import NewItemCard from './NewItemCard';
import ItemCard from './ItemCard';
import LoaderIcon from '../LoaderIcon';

import classes from './ItemTable.module.scss';

// ItemTable Component used to display items from a given list.
// Component controls if its items are editable upon selection
//
// PROPS {
//   user : userSchema
//   list : itemListSchema
//   isEditable : bool
//   authItemFunctions : {}
//   ?onChangeListName : func
//   ?onChangeListPrivacy : func
//   ?onDeleteList : func
// }
class ItemTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      items: [],
      filteredItems: null,
      currItem: null,
      tags: [],
      showItemModal: false,
      creatingNewItem: false
    }
    this._isMounted = false;
    this.TAG_DISPLAY_LIMIT = 5
    this.selectItemHandler = this.selectItemHandler.bind(this)
    this.toggleTagHandler = this.toggleTagHandler.bind(this)
    this.toggleDisplayAllTags = this.toggleDisplayAllTags.bind(this)
    this.createItemHandler = this.createItemHandler.bind(this)
    this.deleteItemHandler = this.deleteItemHandler.bind(this)
    this.saveItemHandler = this.saveItemHandler.bind(this)
    this.deleteListHandler = this.deleteListHandler.bind(this)
    this.changeListNameHandler = this.changeListNameHandler.bind(this)
    this.closeItemModal = this.closeItemModal.bind(this)
    this.toggleDeleteWarningBoxHandler = this.toggleDeleteWarningBoxHandler.bind(this)
  }


  async componentDidMount() {
    this._isMounted = true;
    const items = await this.getItems();
    const tags = await this.getTags(items);
    this.setState((prev) => {
      return {
        ...prev,
        loaded: true,
        items: items,
        currItem: null,
        tags: tags,
        displayAllTags: false,
        showDeleteWarningBox: false,
      }
    })
  }


  componentWillUnmount() {
    this._isMounted = false;
  }


  setState(state, callback?) {
    if(this._isMounted) super.setState(state, callback)
  }


  async componentDidUpdate(prevProps, prevState) {
    if(this.props.list._id !== prevProps.list._id ||
          this.props.isEditable !== prevProps.isEditable){
      this.setState((prev) => { return {...prev, loaded: false} })

      await this.refreshItems();

      this.setState((prev) => { return {...prev, loaded: true} })
    }
    else if(this.state.tags !== prevState.tags){
      this.setState((prev) => { return {...prev, loaded: false}})

      const filteredItems = await this.getFilteredItems()
      this.setState((prev) => {
        return { ...prev, filteredItems: filteredItems}
      })

      this.setState((prev) => { return {...prev, loaded: true} })
    }
  }


  // Method refreshes list by making api request for items,
  //  then processed to set component state with additional
  //  attributes passed through the 'options' param
  async refreshItems(options) {
    const items = await this.getItems(options?.clearList);
    const tags = await this.getTags(items);

    this.setState((prev) => {
      if(options && options.keepFilters){
        Object.entries(prev.tags).forEach(([k,v]) => {
          if(v.active && tags[k]) tags[k].active = true;
        })
      }
      return { ...prev, items: items, tags: tags }
    })
  }


  // Method makes api request for items based on given lists,
  // returns items as an array
  async getItems(clearListFlag) {
    if(clearListFlag){
      this.props.clearList(this.props.list)
    }
    else if(this.props.items) {
      return this.props.items;
    }

    const result = (this.props.list._id)
      ? await makeGet('/lists/' + this.props.list._id + '/items/')
      : (this.props.isEditable)
        ? await makeGet(`/users/${this.props.user._id}/items`)
        : await makeGet(`/users/handle/${this.props.user.handle}/items`);

    if(result) this.props.addToCache(this.props.list, result.items)

    return (result) ? result.items : []
  }


  // Method processes tags within the given list, then makes
  //  api request using the only the active tags, retrieving
  //  items and returning items as an array
  async getFilteredItems() {
    const activeTags = await Promise.all(
      Object.entries(this.state.tags)
        .filter(([tag,obj]) => {
        // if(obj.active) return tag;
        return obj.active
      }).map((tag) => tag[0])
    )
    if(!activeTags.length) return null;

    const url = (this.props.list._id)
      ? `/lists/${this.props.list._id}/items/filtered`
      : (this.props.isEditable)
        ? `/users/${this.props.user._id}/items/filtered`
        : `/users/handle/${this.props.user.handle}/items/filtered`
    const result = await makePost(url, {tags: activeTags})
      .then((res) => res.json())

    if(result.items){
      const items = result.items
        .filter((item) => this.props.list.listItems.indexOf(item._id) >= 0)
      return items;
    }
    else return []
  }


  // Method refreshes component state, setting currItem to the selected
  //  item, resets creatingNewItem flag, and displays item modal with details
  selectItemHandler(item){
    this.setState((prev)=>{
      return {...prev, currItem: item, showItemModal: true, creatingNewItem: false}
    })
  }


  // Method sets up a newItem object to display with an editable ItemModal,
  //  keeping any active tags as part of the newItem's taglist, then
  //  refreshes the component state
  async createItemHandler(){
    const activeTags = await Promise.all(
      Object.entries(this.state.tags).filter(([tag,obj]) => {
        // if(obj.active) return tag;
        return obj.active
      }).map((tag) => tag[0])
    )

    const newItem = {
      name: 'New Item',
      listId: this.props.list._id,
      images: [],
      notes: '',
      links: [],
      tags: (activeTags.length) ? activeTags : [],
    }

    this.setState((prev)=>{
      return {...prev, currItem: newItem, showItemModal: true, creatingNewItem: true}
    })
  }


  // Method makes api request to delete currItem,
  //  then refreshes list and closes itemModal
  async deleteItemHandler(){
    if(this.props.authItemFunctions){
      const result = await this.props.authItemFunctions.deleteItem(this.state.currItem)

      if(result.error){

      } else {
        this.refreshItems({keepFilters: true, clearList: true});
        this.closeItemModal();
      }
    }
  }


  // Method makes api request to save currItem with given attributes,
  //  then refreshes list but keeps any active filters still active
  async saveItemHandler(savedItem) {
    if(this.props.authItemFunctions){
      const result = (this.state.creatingNewItem)
        ? await this.props.authItemFunctions.createItem(this.props.list, savedItem)
        : await this.props.authItemFunctions.updateItem(savedItem)

      if(result.error){

      } else {
        this.refreshItems({keepFilters: true, clearList: true});
        this.setState((prev) => {
          return {...prev, creatingNewItem: false, currItem: result.item} })
      }

      return result
    }
  }


  // Method process each item in 'items' param and creates a
  //  tag object, which will be used to later filter any items
  //  returns an array of tags sorted in decreasing order of
  //  the number of items
  async getTags(items) {
    const tags = {}
    await Promise.all(items.map((item) => {
      item.tags.map((tag) => {
        if(tags[tag])
          tags[tag].freq = tags[tag].freq + 1;
        else
          tags[tag] = {active: false, freq: 1};

        return ''
      })
      return ''
    }));

    const sorted = {}
    await Promise.all(
      Object.entries(tags)
        .sort(([k1,v1], [k2,v2]) => {
          return (v1.freq > v2.freq) ? -1 : 1;
        })
        .map(([k,v]) => sorted[k] = v)
    )
    return sorted;
  }


  // Method sets selected tag to active and refreshes component state,
  //  triggering a filter for newly active tags
  async toggleTagHandler(tag) {
    this.setState((prev) => {
      const tags = {...prev.tags}
      tags[tag].active = !tags[tag].active
      return {...prev, tags: tags}
    })
  }


  // Method refreshes component state to show/hide
  //  all tags in the corresponding list
  toggleDisplayAllTags() {
    this.setState((prev) => { return {...prev, displayAllTags: !prev.displayAllTags}})
  }


  // Method triggers display for warning box upon
  //  requesting a list deletion
  deleteListHandler() {
    this.setState((prev) => {
      this.props.onDeleteList()
      return {...prev, showDeleteWarningBox: false}
    })
  }


  // Method calls prop to change corresponding list name
  changeListNameHandler(newListName){
    this.props.onChangeListName(newListName)
  }


  // Method refreshes component state to hide itemModal,
  //  reseting currItem and creatingNewItem flags
  closeItemModal() {
    this.setState((prev) => {
      return {...prev, currItem: null, showItemModal: false, creatingNewItem: false}
    })
  }


  // Method refreshes component state to show/hide warning box
  toggleDeleteWarningBoxHandler() {
    this.setState((prev) => {
      return {...prev, showDeleteWarningBox: !prev.showDeleteWarningBox}
    })
  }


  render() {
    // if(!this.state.loaded) return <LoaderIcon/>;

    const displayedItems = (this.state.filteredItems)
      ? this.state.filteredItems
      : this.state.items;

    const displayedTags = (this.state.displayAllTags)
      ? this.state.tags
      : Object.entries(this.state.tags).slice(0,this.TAG_DISPLAY_LIMIT).reduce((result, pair) => {
        result[pair[0]] = pair[1];
        return result
      }, {})

    const moreTagsButtonClass = (this.state.displayAllTags)
      ? `${classes.moreButton} ${classes.active}`
      : `${classes.moreButton}`

    return (
      <div className={classes.ItemTable}>
        {
          this.state.showItemModal &&
          <ItemModal
            item={this.state.currItem}
            isEditable={this.props.isEditable}
            isCreatingNewItem={this.state.creatingNewItem}
            onClose={this.closeItemModal}
            onDelete={this.deleteItemHandler}
            onSave={this.saveItemHandler}
          />
        }

        <div className={classes.ItemTable__header}>
          <InputTitle
              placeholder={this.props.list.name}
              isEditable={this.props.list._id && this.props.isEditable}
              isActive={false}
              isEditing={false}
              isBlurable={true}
              allowEmpty={true}
              onEnter={this.changeListNameHandler}
          />
          {this.props.list._id && this.props.isEditable &&
            <div className={classes.actions}>
              <DropDownMenu
                display={'set privacy'}
                options={['PUBLIC', 'PRIVATE']}
                selected={this.props.list.privacy}
                onSelect={this.props.onChangeListPrivacy}
                style={{
                  mode: 'dark',
                  textStyle: 'lowercase',
                  justify: 'right',
                }}
              />
              <Button onClick={this.toggleDeleteWarningBoxHandler}>delete list</Button>
            </div>
          }
          {this.state.showDeleteWarningBox &&
            <WarningBox
              warning={'Delete this list?'}
              onCancel={this.toggleDeleteWarningBoxHandler}
              onConfirm={this.deleteListHandler}
              type={'light'}
            />
          }
        </div>

        <div className={classes.ItemTable__taglist}>
          { Object.keys(displayedTags).length !== 0 &&
            <div className={classes.ItemTable__taglist__moreButton}>
              <div className={moreTagsButtonClass} onClick={this.toggleDisplayAllTags}>
                <div className={classes.moreButton__icon}></div>
              </div>
            </div>
          }
          <div className={classes.ItemTable__taglist__tags}>
            {
              Object.entries(displayedTags).map((tag, i) => {
                return <Tag
                  key={i}
                  tag={tag[0]}
                  isActive={tag[1].active}
                  onClick={() => this.toggleTagHandler(tag[0])}
                />
              })
            }
          </div>
        </div>

        {(!this.state.loaded)
          ? <LoaderIcon/>
          : <div className={classes.ItemTable__table}>
            {(displayedItems.length || (this.props.isEditable && this.props.list._id))
              ?  <div className={classes.ItemTable__table__cards}>
                  { this.props.list._id && this.props.isEditable &&
                    <NewItemCard
                      label={'Add To List'}
                      onClick={this.createItemHandler}
                    />
                  }
                  {
                    displayedItems.map((item, i)=>{
                      return <ItemCard
                        key={i}
                        item={item}
                        onClick={()=>this.selectItemHandler(item)}
                      />
                    })
                  }
              </div>

              : <div className={classes.ItemTable__table__empty}>
                <h2>No Items</h2>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default ItemTable;
