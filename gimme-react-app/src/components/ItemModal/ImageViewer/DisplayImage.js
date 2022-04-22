import React from 'react';
import classes from './DisplayImage.module.scss';

class DisplayImage extends React.Component {
  constructor(props){
    super(props);
    this.imageRef = React.createRef();
    this.state = {
      imageSrc: null,
      validImage: true
    }
  }

  componentDidMount(){
    // try {
    //   const imageSrc = new URL(this.props.image);
    //   this.setState({validImage: true, imageSrc: imageSrc})
    // } catch(err) {
    //   this.setState({validImage: false, imageSrc: null})
    // }
  }

  componentDidUpdate(prevProps){
    // if(prevProps !== this.props){
      // try {
      //   const imageSrc = new URL(this.props.image);
      //   this.setState({validImage: true, imageSrc: imageSrc})
      // } catch(err) {
      //   this.setState({validImage: false, imageSrc: null})
      // }
    // }
  }

  render(){
    return(
      <div className={classes.imageBlock}>
        {
          (this.props.image)
          ? <img
            ref={this.imageRef}
            className={classes.imageBlock__img}
            src={this.props.image}
            alt={this.props.alt}
          />

          : <div className={classes.missingImage}>
              <div className={classes.missingImage__icon}></div>
          </div>
        }
      </div>
    );
  }
}

export default DisplayImage;
