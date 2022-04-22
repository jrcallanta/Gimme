import React from 'react';
import classes from './Button.module.scss';


// Button Component takes in onClick prop to trigger parenting
//  function, or a path to trigger a redirect. Also takes in
//  'classTypes' prop that is used to access the different
//  classNames (if) defined in the corresponding scss file,
//  giving parent component styling options to select from
class Button extends React.Component {

  constructor(props){
    super(props)

    this.classTypes = `${classes.button}`;
    if(this.props.classTypes){
      const keys = Object.entries(classes).map(([k]) => {return k})
      this.props.classTypes.map((type) => {
        const classKey = 'button__' + type;
        if(keys.indexOf(classKey) >= 0)
          this.classTypes += ` ${classes[classKey]}`
        return `${classes[classKey]}`
      })
    }
  }

  render(){
    return (this.props.onClick)
    ? <span
        className={this.classTypes}
        onClick={this.props.onClick}>
        {this.props.children}
    </span>

    : <a
      className={this.classTypes}
      href={this.props.to}>
      {this.props.children}
    </a>
  }
}

export default Button;
