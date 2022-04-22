import React from 'react';
import Link from './Link.js';
import AddLink from './AddLink';
import classes from './EditableLinks.module.scss';

class EditableLinks extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      links: [...props.links],
      showLinks: props.links.length > 0,
      showAll: false,
    };
    this.updateListeners = this.updateListeners.bind(this);
    this.showAll = this.showAll.bind(this);
    this.hideSome = this.hideSome.bind(this);
    this.adjustMoreLinksHeight = this.adjustMoreLinksHeight.bind(this);
    this.moreLinksRef = React.createRef();
    this.editableLinksRef = React.createRef();
  }

  componentDidMount(){
    if(this.editableLinksRef.current && !this.state.showAll){
      this.editableLinksRef.current.addEventListener('mousedown', (event)=>{
        if(!event.target.href) this.showAll();
      });


      // this.editableLinksRef.current.addEventListener('mouseenter', this.showAll);
    }
  }

  componentDidUpdate(prevProps){
    this.updateListeners();
    this.adjustMoreLinksHeight();

    if(this.props.links !== prevProps.links){
      this.setState((prevState)=>{
        if(this.props.isEditing)
          return {...prevState, links: this.props.links, showLinks: this.props.links.length > 0, showAll: true}
        else
          return {...prevState, links: this.props.links, showLinks: this.props.links.length > 0, showAll: false}
      });
    }
  }

  updateListeners(){
    if(this.editableLinksRef.current){
      function handleClickOutside(event, ref, callback){
        if(ref.current && !ref.current.contains(event.target)) callback();
      }

      if(this.state.showAll){
        if(!this.props.isEditing) this.editableLinksRef.current.addEventListener('mouseleave', this.hideSome);
        else document.addEventListener('mousedown', (event)=>handleClickOutside(event, this.editableLinksRef, this.hideSome));
      }
      else {
        if(!this.props.isEditing) this.editableLinksRef.current.removeEventListener('mouseleave', this.hideSome);
        else document.removeEventListener('mousedown', (event)=>handleClickOutside(event, this.editableLinksRef, this.hideSome));
      }

    }
  }

  showAll(){
    this.setState((prevState) => {
      if(prevState.links.length < 2) return prevState;
      return {
        ...prevState,
        showAll: true,
      }
    });
  }

  hideSome(){
    this.setState((prevState) => {
      return {
        ...prevState,
        showAll: false,
      }
    })
  }

  removeLink(linkIndex){
    this.setState((prevState) => {
      const newLinks = [...prevState.links];
      newLinks.splice(linkIndex, 1);
      return {
        ...prevState,
        links: newLinks
      };
    },
    () => this.props.onPreserveValue('links', this.state.links))
  }

  addLink(link){
    this.setState((prevState) => {
      const newLinks = [...prevState.links];
      newLinks.push(link);
      return {
        ...prevState,
        links: newLinks
      }
    },
    () => this.props.onPreserveValue('links', this.state.links))
  }

  adjustMoreLinksHeight(){
    if (this.moreLinksRef.current){
      if(this.state.showAll){
        console.log('adjusting');
        this.moreLinksRef.current.style.height = "1px";
        this.moreLinksRef.current.style.height = (this.moreLinksRef.current.scrollHeight)+"px";
        // this.moreLinksRef.current.style.height = "fit-content";
      }
      else {
        this.moreLinksRef.current.style.height = 0;
      }
    }
  }

  render(){

    const editableLinksClass = (this.state.showLinks || this.props.isEditing)
      ? classes.EditableLinks
      : classes.EditableLinks__hidden

    const showMoreButtonClass = (!this.state.showAll)
      ? classes.header__showMoreButton
      : `${classes.header__showMoreButton} ${classes.hidden}`

    const moreLinksClass = (this.state.showAll)
      ? classes.moreLinks
      : `${classes.moreLinks} ${classes.hiddenLinks}`

    return (
      <div ref={this.editableLinksRef} className={editableLinksClass}>
        <div className={classes.header}>
          <label className={classes.header__label}>Links:</label>
          {
            (this.state.links.length - 1 > 0)
            ? <span className={showMoreButtonClass} onClick={this.showAll}>
              {`show ${this.state.links.length - 1} more`}</span>
            : ''
          }
        </div>
        {
          (this.state.links.length > 0)
          ? <div className={classes.links}>
              <Link
                key={0}
                link={this.state.links[0]}
                isEditing={this.props.isEditing}
                onRemove={()=>this.removeLink(0)}
              />

              {
                (this.state.links.length > 1)
                ? <div ref={this.moreLinksRef} className={moreLinksClass}>
                  {
                    this.state.links.map((link,i)=>{
                      if(i === 0) return '';
                      return <Link
                        key={i}
                        link={link}
                        isEditing={this.props.isEditing}
                        onRemove={()=>this.removeLink(i)}
                      />
                    })
                  }

                  {this.props.isEditing &&
                    <div className={classes.addLink}>
                      <AddLink
                        itemKey={this.props.itemKey}
                        placeholder='add link'
                        onAddLink={(newLink)=>this.addLink(newLink)}
                      />
                    </div>
                  }
                </div>

                : (this.props.isEditing)
                  ? <div className={classes.addLink}>
                    <AddLink
                      itemKey={this.props.itemKey}
                      placeholder='add link'
                      onAddLink={(newLink)=>this.addLink(newLink)}
                    />
                  </div>
                  : ''
              }
          </div>

          : (this.props.isEditing)
            ? <div className={classes.addLink}>
              <AddLink
                itemKey={this.props.itemKey}
                placeholder='add link'
                onAddLink={(newLink)=>this.addLink(newLink)}
              />
            </div>
            : ''
        }


      </div>
    );
  }

}


export default EditableLinks;
