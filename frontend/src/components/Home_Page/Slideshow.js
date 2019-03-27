import React, { Component } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

const items = [
  {
    id: 1,
    altText: 'Purpose of Archive',
    header: 'Purpose of Archive',
    caption: 'An initiative to help final year students with their BE projects'
  },
  {
    id: 2,
    altText: 'Connect with Seniors',
    header: 'Connect with Seniors',
    caption: 'Find out more abt the creators of the projects, grow & connect'
  },
  {
    id: 3,
    altText: 'BE Projects',
    header: 'BE Projects',
    caption: 'Explore our vast collection of final year projects'
  }
];

class Slideshow extends Component {

  state = {
    activeIndex: 0
  }

  onExiting=()=> {
    this.animating = true;
  }

  onExited=()=>{
    this.animating = false;
  }

  next=()=>{
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous=()=>{
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex=(newIndex)=> {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;

    const slides = items.map((item) => {
      return (
        <CarouselItem
          className="custom-tag"
          tag="div"
          key={item.id}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <CarouselCaption className="text-danger" captionText={item.caption} captionHeader={item.header} />
        </CarouselItem>
      );
    });

    return (
      <div>
        <style>
          {
            `.custom-tag {
                max-width: 100%;
                height: 600px;
                background: black;
              }`
          }
        </style>
        <Carousel
          activeIndex={activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
          {slides}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
        </Carousel>
      </div>
    );
  }
}
export default Slideshow;
