import React from 'react';
import DisplayImage from './DisplayImage';
import NavImage from './NavImage';
import classes from './ImageViewer.module.scss';
import AddLink from '../Links/AddLink';

class ImageViewer extends React.Component {
  constructor(props) {
    super(props);

    // constants and funcs
    this.DISPLAY_LIMIT = 5;
    this.pimaryRef = React.createRef();
    this.changeIndex = this.changeIndex.bind(this);
    this.imageAddHandler = this.imageAddHandler.bind(this);

    // setState
    // const displayedImageIndex = 0;
    // const navImages = props.images.slice(0, Math.min(props.images.length, this.DISPLAY_LIMIT));
    // const navImagesOffset = 0;
    // this.state = {
    //   images: [...props.images],
    //   displayedImageIndex: displayedImageIndex,
    //   navImages: navImages,
    //   navImagesOffset: navImagesOffset,
    // }

    //setState
    this.state = {
      images: [],
      displayedImageIndex: 0,
      navImages: [],
      navImagesOffset: 0,
    }
  }

  componentDidMount(){
    const images = this.validateImages(this.props.images);
    const displayedImageIndex = 0;
    const navImages = images.slice(0, Math.min(images.length, this.DISPLAY_LIMIT));
    const navImagesOffset = 0;
    this.setState({
      images: images,
      displayedImageIndex: displayedImageIndex,
      navImages: navImages,
      navImagesOffset: navImagesOffset
    })
  }

  componentDidUpdate(prevProps){
    if(this.props !== prevProps){
      if(prevProps.isEditing){
        if(this.props.isEditing) {
          this.setState((prevState)=>{
            // const displayedImageIndex = Math.min(prevState.displayedImageIndex, this.props.images.length - 1);
            // const [lower,upper] = this.getListEnds(this.props.images, displayedImageIndex)
            // const navImages = this.props.images.slice(lower, upper);
            // const navImagesOffset = lower;
            // return {
            //   ...prevState,
            //   images: [...this.props.images],
            //   displayedImageIndex: displayedImageIndex,
            //   navImages: navImages,
            //   navImagesOffset: lower,
            // }

            const images = this.validateImages(this.props.images);
            const displayedImageIndex = Math.min(prevState.displayedImageIndex, this.props.images.length - 1);
            const [lower, upper] = this.getListEnds(images, displayedImageIndex)
            const navImages = images.slice(lower, upper);
            const navImagesOffset = lower;
            return {
              ...prevState,
              images: images,
              displayedImageIndex: displayedImageIndex,
              navImages: navImages,
              navImagesOffset: navImagesOffset,
            }
          })
        } else {
          this.setState((prevState)=>{
            // const displayedImageIndex = 0;
            // const navImages = this.props.images.slice(0, Math.min(this.props.images.length, this.DISPLAY_LIMIT));
            // const navImagesOffset = 0;
            // return{
            //   images: [...this.props.images],
            //   displayedImageIndex: displayedImageIndex,
            //   navImages: navImages,
            //   navImagesOffset: navImagesOffset,
            // }

            const images = this.validateImages(this.props.images);
            const displayedImageIndex = 0;
            const navImages = images.slice(0, Math.min(images.length, this.DISPLAY_LIMIT));
            const navImagesOffset = 0;
            return {
              images: images,
              displayedImageIndex: displayedImageIndex,
              navImages: navImages,
              navImagesOffset: navImagesOffset,
            }
          });
        }
      }
    }
  }

  validateImages(imageUrls) {
    const validImages = imageUrls.map((imageUrl) => {
      try {
        const imageSrc = new URL(process.env.PUBLIC_URL + imageUrl);
        return imageSrc;
      } catch(err) {
        return null;
      }
    })
    return validImages
  }

  getListEnds(arr, index){
    if(arr.length < this.DISPLAY_LIMIT) return [0, arr.length];

    const margin = Math.floor(this.DISPLAY_LIMIT/2);
    if(index <= margin)
      return [0, this.DISPLAY_LIMIT]
    else if(margin < index && index < (arr.length - margin - 1))
      return [index - margin, index + margin + 1]
    else
      return [arr.length - this.DISPLAY_LIMIT, arr.length]
  }

  changeIndex(difference){
    this.setState((prevState)=>{
      const len = prevState.images.length;
      const newIndex = (((prevState.displayedImageIndex + difference) % len) + len) % len;
      const [lower, upper] = this.getListEnds(this.state.images, newIndex);
      return {
        ...prevState,
        displayedImageIndex: newIndex,
        navImages: prevState.images.slice(lower, upper),
        navImagesOffset: lower,
      }
    })
  }

  imageSelectHandler(imageIndex){
    if(this.state.displayedImageIndex === imageIndex) return;
    this.setState((prevState)=>{
      const [lower, upper] = this.getListEnds(this.state.images, imageIndex);
      return {
        ...prevState,
        displayedImageIndex: imageIndex,
        navImages: prevState.images.slice(lower, upper),
        navImagesOffset: lower,
      }
    })
  }

  imageRemoveHandler(imageIndex){
    this.setState((prevState) => {
      const newImages = [...prevState.images];
      newImages.splice(imageIndex, 1);
      if(newImages.length){
        const newShownIndex = Math.min(imageIndex, newImages.length - 1);
        const [lower, upper] = this.getListEnds(newImages, newShownIndex);
        const newShownImagesList = newImages.slice(lower,upper);
        return {images: newImages, displayedImageIndex: newShownIndex, showImagesList: newShownImagesList, navImagesOffset: lower}
      }
      else
        return {images: newImages, displayedImageIndex: 0, navImages: [], navImagesOffset: 0}
    },
    () => this.props.onPreserveValue('images', this.state.images))
  }

  imageAddHandler(imageUrl){
    this.setState((prevState) => {
      const newImages = [...prevState.images];
      newImages.push(imageUrl)
      const newShownIndex = newImages.length - 1;
      const [lower, upper] = this.getListEnds(newImages, newShownIndex);
      return {
        ...prevState,
        images: newImages,
        displayedImageIndex: newShownIndex,
        navImages: newImages.slice(lower, upper),
        navImagesOffset: lower
      };
    },
    () => this.props.onPreserveValue('images', this.state.images))
  }

  render(){
    return (
      <div className={classes.imageViewer}>

        <div className={(this.props.isEditing) ? `${classes.addImage}` : `${classes.addImage} ${classes.addImage__hidden}`}>
          <AddLink
            itemKey={this.props.itemKey}
            placeholder='add image url'
            onAddLink={this.imageAddHandler}
          />
        </div>

        <div ref={this.pimaryRef} className={classes.imageViewer__primary}>
          {
            (this.state.images.length)
            ? <DisplayImage
              image={this.state.images[this.state.displayedImageIndex]}
              alt={this.state.images[this.state.displayedImageIndex]}
            />
            : (!this.props.isEditing)
              ? <h1 className={classes.noImage}>No Images</h1>
              : <div className={classes.helpGuide}>
                  <h2>To add a new image:</h2>
                  <ol>
                    <li>Find an image online</li>
                    <li>Right click image</li>
                    <li>Select 'Open Image in New Tab'</li>
                    <li>Copy URL and paste it above</li>
                  </ol>
              </div>
          }
        </div>

        <div className={classes.imageViewer__secondary}>
          <div className={classes.nav}>
            {this.state.images.length > 1 &&
              <div className={classes.navControl}>
                <div className={classes.arrowButton} onClick={()=>this.changeIndex(-1)}>
                  <div className={classes.arrowButton__icon}></div>
                </div>
              </div>
            }
            {
              this.state.navImages.map((image,i)=>{
                const imageIndex = i + this.state.navImagesOffset;
                return <NavImage
                  key={i}
                  image={image}
                  isEditing={this.props.isEditing}
                  isSelected={this.state.displayedImageIndex === imageIndex}
                  onRemove={()=>this.imageRemoveHandler(imageIndex)}
                  onSelectImage={()=>this.imageSelectHandler(imageIndex)}
                />
              })
            }
            {this.state.images.length > 1 &&
              <div className={classes.navControl}>
                <div className={classes.arrowButton} onClick={()=>this.changeIndex(+1)}>
                  <div className={classes.arrowButton__icon}></div>
                </div>
              </div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default ImageViewer;
