import React from 'react';

import classes from './ItemCard.module.scss';

// ItemCard Component used to display basic item
//   attributes on a parenting ItemTable Component
//
// REQUIRED PARAMS {
//   item : itemSchema,
//   onClick : func
// }
class ItemCard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      itemModalIsShown: false,
      imageSrc: null,
      validImage: true
    }
    this.imageRef = React.createRef();
    this.grabDomain = this.grabDomain.bind(this);
  }


  // Method used to shorten provided url,
  //  returns string of just the url domain if any
  grabDomain(url) {
    try {
      return (new URL(url)).hostname;
    } catch(err) {
      return ''
    }
  }


  async componentDidMount(){
      try {
        const imageSrc = new URL(process.env.PUBLIC_URL + this.props.item.images[0]);
        this.setState({validImage: true, imageSrc: imageSrc})
      } catch(err) {
        this.setState({validImage: false, imageSrc: null})
      }
  }


  componentDidUpdate(prevProps){
    if(prevProps !== this.props){
        try {
          const imageSrc = new URL(process.env.PUBLIC_URL + this.props.item.images[0]);
          this.setState({validImage: true, imageSrc: imageSrc})
        } catch(err) {
          this.setState({validImage: false, imageSrc: null})
        }
    }
  }


  render(){
    return (
        <div className={classes.ItemCard} onClick={this.props.onClick}>
          <div className={classes.ItemCard__image}>
            {
              (this.props.item.images.length)
              ? (this.state.validImage)
                ? <img
                    ref={this.imageRef}
                    className={classes.ItemCard__image__img}
                    src={this.state.imageSrc}
                    alt={this.state.imageSrc}
                />

                : <div className={classes.missingImage}>
                    <div className={classes.missingImage__icon}></div>
                </div>

              : <h3 className={classes.ItemCard__image__noImage}>No Image</h3>
            }
          </div>

          <h3 className={classes.ItemCard__name}>{this.props.item.name}</h3>

          {
            (this.props.item.links.length)
            ? <span className={classes.ItemCard__link}>
              <a
                tabIndex='-1'
                href={this.props.item.links[0]}
                target='_blank'
                rel='noreferrer'
                >{this.grabDomain(this.props.item.links[0])}
              </a>
            </span>
            : ''
          }
        </div>
    );
  }

}

export default ItemCard;
