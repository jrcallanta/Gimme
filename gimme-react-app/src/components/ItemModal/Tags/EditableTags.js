import React from 'react';
import classes from './EditableTags.module.scss';

import AddTag from './AddTag';


class EditableTags extends React.Component {
  constructor(props) {
    super(props);
    this.TAG_DISPLAY_LIMIT = 5;
    this.state = {
      tags: [...this.props.tags],
      displayAll: false,
    }
    this.getTags = this.getTags.bind(this)
    this.toggleDisplayAllTags = this.toggleDisplayAllTags.bind(this)
  }

  componentDidUpdate(prevProps) {
    if(this.props.tags !== prevProps.tags){
      this.setState({tags: this.props.tags})
    }
  }

  removeTag(tagIndex) {
    this.setState((prevState) => {
      const newTags = [...this.state.tags];
      newTags.splice(tagIndex, 1);
      return {tags: newTags};
    },
    () => this.props.onPreserveValue('tags', this.state.tags))
  }

  addTag(tag) {
    if(this.state.tags.includes(tag)) return false;

    this.setState((prevState)=>{
      const newTags = [...this.state.tags];
      newTags.push(tag);
      return {tags: newTags};
    },
    () => this.props.onPreserveValue('tags', this.state.tags))
    return true;
  }



  toggleDisplayAllTags() {
    this.setState((prevState) => {
      return { ...prevState, displayAll: !prevState.displayAll}
    })
  }


  getTags() {
    if(this.state.displayAll) return this.state.tags
    else return this.state.tags.slice(0, this.TAG_DISPLAY_LIMIT)
  }


  render() {
    const displayedTags = this.getTags();
    return (
      <div className={classes.EditableTags}>
        <div className={classes.EditableTags__tags}>
          {
            displayedTags.map((tag, i)=>{
                return <div key={i} className={classes.tag}>
                  {this.props.isEditing &&
                    <div className={classes.closeButton} onClick={()=>{this.removeTag(i)}}>
                      <div className={classes.closeButton__icon}></div>
                    </div>
                  }
                  <p href="">{tag}</p>
                </div>
            })
          }
          {
            this.props.isEditing &&
            <AddTag
              itemKey={this.props.itemKey}
              onAddTag={(newTag)=>this.addTag(newTag)}
            />
          }
        </div>

        {this.state.tags.length > this.TAG_DISPLAY_LIMIT &&
          <div className={classes.showAllButton} onClick={this.toggleDisplayAllTags}>{
          (this.state.displayAll) ? 'hide' : `show all ${this.state.tags.length} tags`
        }</div>}
      </div>
    );
  }
}

export default EditableTags;


/**************************************
    Attempted Functional Component Implementation to match
    other components, but not yet working. State changes
    are not updating properly.
    [use case: removing tag, canceling, removing another tag.
    ends up removing both tags.]
*/

// function EditableTags(props) {
//   console.log('>> recalled: ' + props.itemKey)
//   console.log(props.tags)
//   const [tags, setTags] = useState([...props.tags])
//
//   function removeTag(tagIndex) {
//     setTags((prevTags) => {
//       prevTags.splice(tagIndex, 1);
//       props.onPreserveValue(props.itemKey, prevTags);
//       return prevTags;
//     })
//   }
//
//   return (
//         <div className={classes.EditableTags}>
//           {
//             props.tags.map((tag, i)=>{
//                 return <div key={i} className={classes.tag}>
//                   <div
//                     className={(props.isEditing) ? `${classes.closeButton}` : `${classes.closeButton} ${classes.hidden}`}
//                     onClick={()=>removeTag(i)}>
//                     <div className={classes.closeButton__icon}></div>
//                   </div>
//                   <p href="">{tag}</p>
//                 </div>
//             })
//           }
//           {
//             (props.isEditing)
//             ?
//             <div className={classes.addtag}>
//               <div className={classes.plusButton}>
//                 <div className={classes.plusButton__icon}></div>
//               </div>
//               <p href="">new tag</p>
//             </div>
//             : ''
//           }
//         </div>
//       );
// }
