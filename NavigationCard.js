/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Facebook, Inc. ("Facebook") owns all right, title and interest, including
 * all intellectual property and other proprietary rights, in and to the React
 * Native CustomComponents software (the "Software").  Subject to your
 * compliance with these terms, you are hereby granted a non-exclusive,
 * worldwide, royalty-free copyright license to (1) use and copy the Software;
 * and (2) reproduce and distribute the Software as part of your own software
 * ("Your Software").  Facebook reserves all rights not expressly granted to
 * you in this license agreement.
 *
 * THE SOFTWARE AND DOCUMENTATION, IF ANY, ARE PROVIDED "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES (INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE) ARE DISCLAIMED.
 * IN NO EVENT SHALL FACEBOOK OR ITS AFFILIATES, OFFICERS, DIRECTORS OR
 * EMPLOYEES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @providesModule NavigationCard
 * @flow
 */
'use strict';

const Animated = require('react-native').Animated;
const NavigationCardStackPanResponder = require('./NavigationCardStackPanResponder');
const NavigationCardStackStyleInterpolator = require('./NavigationCardStackStyleInterpolator');
const NavigationContainer = require('./NavigationContainer');
const NavigationPagerPanResponder = require('./NavigationPagerPanResponder');
const NavigationPagerStyleInterpolator = require('./NavigationPagerStyleInterpolator');
const NavigationPointerEventsContainer = require('./NavigationPointerEventsContainer');
const NavigationPropTypes = require('./NavigationPropTypes');
const React = require('react');
const StyleSheet = require('react-native').StyleSheet;
const View = require('react-native').View;

import type  {
  NavigationPanPanHandlers,
  NavigationSceneRenderer,
  NavigationSceneRendererProps,
} from 'NavigationTypeDefinition';

type SceneViewProps =  {
  sceneRenderer: NavigationSceneRenderer,
  sceneRendererProps: NavigationSceneRendererProps,
};

type Props = NavigationSceneRendererProps & {
  onComponentRef: (ref: any) => void,
  panHandlers: ?NavigationPanPanHandlers,
  pointerEvents: string,
  renderScene: NavigationSceneRenderer,
  style: any,
};

const {PropTypes} = React;

class SceneView extends React.Component<any, SceneViewProps, any> {

  static propTypes = {
    sceneRenderer: PropTypes.func.isRequired,
    sceneRendererProps: NavigationPropTypes.SceneRenderer,
  };

  shouldComponentUpdate(nextProps: SceneViewProps, nextState: any): boolean {
    return (
      nextProps.sceneRendererProps.scene.navigationState !==
        this.props.sceneRendererProps.scene.navigationState
    );
  }

  render(): ?ReactElement {
    return this.props.sceneRenderer(this.props.sceneRendererProps);
  }
}

/**
 * Component that renders the scene as card for the <NavigationCardStack />.
 */
class NavigationCard extends React.Component<any, Props, any> {
  props: Props;

  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    onComponentRef: PropTypes.func.isRequired,
    panHandlers: NavigationPropTypes.panHandlers,
    pointerEvents: PropTypes.string.isRequired,
    renderScene: PropTypes.func.isRequired,
    style: PropTypes.any,
  };

  render(): ReactElement {
    const {
      panHandlers,
      pointerEvents,
      renderScene,
      style,
      ...props, /* NavigationSceneRendererProps */
    } = this.props;

    const viewStyle = style === undefined ?
      NavigationCardStackStyleInterpolator.forHorizontal(props) :
      style;

    const viewPanHandlers = panHandlers === undefined ?
      NavigationCardStackPanResponder.forHorizontal(props) :
      panHandlers;

    return (
      <Animated.View
        {...viewPanHandlers}
        pointerEvents={pointerEvents}
        ref={this.props.onComponentRef}
        style={[styles.main, viewStyle]}>
        <SceneView
          sceneRenderer={renderScene}
          sceneRendererProps={props}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

NavigationCard = NavigationPointerEventsContainer.create(NavigationCard);
NavigationCard = NavigationContainer.create(NavigationCard);

// Export these buil-in interaction modules.
NavigationCard.CardStackPanResponder = NavigationCardStackPanResponder;
NavigationCard.CardStackStyleInterpolator = NavigationCardStackStyleInterpolator;
NavigationCard.PagerPanResponder = NavigationPagerPanResponder;
NavigationCard.PagerStyleInterpolator = NavigationPagerStyleInterpolator;

module.exports = NavigationCard;
