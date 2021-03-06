import React from 'react';
import { connect } from 'react-redux';
import Bulletin from './Bulletin';
import wavboRipSVG from './../images/wavbo-rip.svg'

let isOverflow;

class Main extends React.Component {
  componentDidMount() {
    this.mainElement = document.querySelector('[data-target="main"]');
    this.messagesElement = document.querySelector('[data-target="messages"]');
  }

  componentDidUpdate() {
    // Messages Component 的捲軸會移到最後一則訊息，
    // 其他的 Component 都是捲軸都是移到最頂端

    isOverflow = this.messagesElement.offsetHeight > this.mainElementInnerHeight;

    if (this.props.currentPath === 'messages' && isOverflow) {
      this.scrollToLastMessageElement();
    } else {
      this.mainElement.scroll(0, 0);
    }
  }

  scrollToLastMessageElement() {
    const lastMessageElement = document.querySelector('.message:last-child');

    if (!lastMessageElement) {
      return;
    }

    lastMessageElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  navigateToCurrentPath(currentPath) {
    const currentPathIndex = this.props.children.findIndex(
      component => component.key === currentPath
    );

    if (currentPathIndex === -1) {
      throw new Error(
        `There is no corresponding component for "${currentPath}" path.
        Please make sure you set the right "key" attribute of component in App.js`
      );
    }

    return currentPathIndex;
  }

  get mainElementInnerHeight() {
    const paddingTop = parseFloat(
      window.getComputedStyle(this.mainElement).getPropertyValue('padding-top')
    );
    const paddingBottom = parseFloat(
      window
        .getComputedStyle(this.mainElement)
        .getPropertyValue('padding-bottom')
    );
    return this.mainElement.offsetHeight - paddingTop - paddingBottom;
  }

  render() {
    const { currentPath, children, isOver } = this.props;

    return (
      <main className="block-main" data-target="main"
        style={ isOver ? {
          background: 'center center no-repeat',
          backgroundSize: '70%',
          backgroundImage: `url(${wavboRipSVG})`,
        } : null}
      >
        <div
          className="container h-100"
          style={{
            transform: `translate(-${this.navigateToCurrentPath(currentPath) *
              100}%)`
          }}
        >
          {children}
        </div>
        {!isOver && !isOverflow && <Bulletin />}
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentPath: state.currentPath
  };
};

export default connect(mapStateToProps)(Main);
