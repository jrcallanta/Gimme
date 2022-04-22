import React from 'react';
import classes from './InputTitle.module.scss';

// InputTitle Component used primarily in CataloguePage Component
// when creating new list, providing input for the new list name
class InputTitle extends React.Component{
  constructor(props){
    super(props)
    this._isMounted = false;
    this.state = {text: props.placeholder.slice(), active: props.isActive, editing: props.isEditing}
    this.inputRef = React.createRef()
    this.adjustFocus = this.adjustFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.enterEditMode = this.enterEditMode.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }


  componentDidMount(){
    this._isMounted = true;
    this.adjustFocus()
  }


  componentWillUnmount() {
    this._isMounted = false;
  }


  setState(state, callback?) {
    if(this._isMounted) super.setState(state, callback);
  }


  componentDidUpdate(prevProps){
    this.adjustFocus()
    if(this.props !== prevProps){
      this._isMounted && this.setState((prev)=>{
        return {...prev, text: this.props.placeholder.slice()}
      })
    }
  }


  // Method used to auto adjust height of changing textbox value
  adjustFocus(){
    if(this.inputRef.current){
      this.inputRef.current.style.height = "1px";
      this.inputRef.current.style.height = (this.inputRef.current.scrollHeight)+"px";
      this.inputRef.current.focus();
    }
  }


  // Method used to trigger styling to show if textbox is active
  handleChange(e) {
    if(this.inputRef.current && this.inputRef.current.value !== ''){
      if(!this.state.active){
        this.setState((prev)=>{return {...prev, active: true}})
      }
    }
    else if(this.state.active){
      this.setState((prev)=>{return {...prev, active: false}})
    }

    this.adjustFocus();
  }


  // Method handle key event, checking if 'enter' key was pressed,
  //  then calls onValidEnter prop if exists, or onEnter prop otherwise
  async handleEnter(e) {
    if(e.key.toLowerCase() === 'enter'){
      e.preventDefault();
      const val = this.inputRef.current.value.trim()

      if(val !== ''){
        if(this.props.onValidEnter){
          if(await this.props.onValidEnter(val))
            this.setState((prev)=>{return {...prev, text: val, active: false, editing: false}})
          else
            this.setState((prev)=>{return {...prev, text: val, active: true, editing: true}})
        }
        else {
          this.props.onEnter(val);
          this.setState((prev)=>{return {...prev, text: val, active: false, editing: false}})
        }
      }
      else if (this.props.allowEmpty)
        this.setState((prev)=>{return {...prev, active: false, editing: false}})
    }
    else this.handleChange()
  }


  // Method refreshes component state into editing mode
  enterEditMode() {
    if(this.props.isEditable){
      console.log('editing')
      this.setState((prev)=>{return {...prev, active: true, editing: true}})
    }
  }


  // Method refreshes state, setting activeness if isBlurable prop is true
  handleBlur(){
    if(this.props.isBlurable){
      this.setState((prev)=>{
        const val = this.inputRef.current.value.trim()
        if(val !== '')
          return {...prev, text: val, active: false, editing: false}
        else
          return {...prev, active: false, editing: false}
      })
    }
  }


  render(){
    const inputTitleClass = (this.props.showUnderline)
      ? `${classes.InputTitle} ${classes.underline}`
      : `${classes.InputTitle}`
    const textareaClass = (this.state.active)
      ? `${classes.InputTitle__input} ${classes.active}`
      : `${classes.InputTitle__input}`
    const fixedTitleClass = (!this.props.isEditable)
      ? `${classes.InputTitle__fixed} ${classes.disabled}`
      : `${classes.InputTitle__fixed}`

    return (
      <div className={inputTitleClass}>
        {
          (this.state.editing)
          ? <textarea
            ref={this.inputRef}
            className={textareaClass}
            onChange={this.handleChange}
            onKeyDown={this.handleEnter}
            onBlur={this.handleBlur}
            placeholder={this.state.text}
            type="text"
            maxLength='30'
          ></textarea>
          :
          <h2
            className={fixedTitleClass}
            onClick={this.enterEditMode}
            >{this.state.text}
            </h2>
        }
        {this.props.hint &&
          <p className={classes.InputTitle__hint}>{this.props.hint}</p>
        }
      </div>
    );
  }
}

export default InputTitle;
