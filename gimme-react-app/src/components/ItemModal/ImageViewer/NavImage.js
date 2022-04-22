import React from 'react';
import classes from './NavImage.module.scss';

class NavImage extends React.Component {
  constructor(props){
    super(props);
    this.imageRef = React.createRef();
    this.state = {
      validImage: true
    }
  }

  componentDidMount(){
    // try {
    //   const imageSrc = new URL(process.env.PUBLIC_URL + this.props.image);
    //   this.setState({validImage: true, imageSrc: imageSrc})
    // } catch(err) {
    //   this.setState({validImage: false, imageSrc: null})
    // }
  }

  componentDidUpdate(prevProps){
    // if(prevProps !== this.props){
    //   try {
    //     const imageSrc = new URL(process.env.PUBLIC_URL + this.props.image);
    //     this.setState({validImage: true, imageSrc: imageSrc})
    //   } catch(err) {
    //     this.setState({validImage: false, imageSrc: null})
    //   }
    // }
  }

  render() {

    const imgClass = (this.props.isSelected)
      ? `${classes.NavImage__img}`
      : `${classes.NavImage__img} ${classes.NavImage__img__dim}`
    const missingImageClass = (this.props.isSelected)
      ? `${classes.missingImage}`
      : `${classes.missingImage} ${classes.missingImage__dim}`


    return (
      <div
        className={classes.NavImage}
        onClick={this.props.onSelectImage}>
        {this.props.isEditing &&
          <div className={classes.closeButton} onClick={this.props.onRemove}>
            <div className={classes.closeButton__icon}></div>
          </div>
        }
        {
          (this.props.image)
          ? <img
              ref={this.imageRef}
              className={imgClass}
              src={this.props.image}
              alt=""/>
          : <div className={missingImageClass}>
              <div className={classes.missingImage__icon}></div>
          </div>
        }
      </div>
    );
  }
}


export default NavImage;
