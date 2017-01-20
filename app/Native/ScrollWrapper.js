const _user$project$Native_ScrollWrapper = function () {
  var ScrollView = require('ScrollView');
  class ScrollWrapper extends ScrollView {
    componentDidMount() {
      this.centerSelectedChild();
    }

    centerSelectedChild() {
      const self = this;
      this.props.children.reduce( function(offset, child) {
        if (child.props.scrollTarget == true) {
          const adjustedScrollOffset = self.adjustedScrollOffset(
            offset,
            child.props.style.height
          );
          self.scrollTo({y: adjustedScrollOffset, x: 0});
        }
        return offset + child.props.style.height;
      }, 0);
    }

    adjustedScrollOffset(offset, itemHeight) {
      const centerOffset = (this.viewportHeight() - itemHeight) / 2;
      return Math.min(Math.max(0, offset - centerOffset), this.maxScrollableHeight());
    }

    viewportHeight() {
      return this.props.style.height;
    }

    scrollableHeight() {
      return this.props.children.reduce( function(height, child) {
        return height + child.props.style.height;
      }, 0);
    }

    maxScrollableHeight() {
      return this.scrollableHeight() - this.props.style.height;
    }
  }

  return {
    view: ScrollWrapper,
  };
}();
