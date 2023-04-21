import { PigeonProps } from 'pigeon-maps';
import React from 'react';
import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';
import { Button } from 'shared/entities/button.entity';
import { makeImageUrl } from 'shared/sys.helper';
import CardButtonMap from '../CardButtonMap';

interface MarkerButtonProps extends PigeonProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  button: Button;
  handleMarkerClicked: any;
  currentButtonId: string;
}

interface MarkerButtonIconProps extends PigeonProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  image: string;
  title: string;
  onClick?: any;
  cssColor: string;
}

interface MarkerButtonPopupProps extends PigeonProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  button: Button;
}
export function MarkerButton(props: MarkerButtonProps) {
  const width = 100;
  const height = 100;

  const { cssColor } = buttonTypes.find((buttonType) => {
    return buttonType.name === props.button.type;
  });
  const handleMarkerClicked = (button: Button) => {
    props.handleMarkerClicked(button);
  };

  return (
    <>
      <MarkerButtonIcon {...props}
      cssColor={cssColor}
      image={makeImageUrl(props.button.image, '/api/')}
      title={props.button.title}
      onClick={() => handleMarkerClicked(props.button)}
      />
      
    </>
  );
}

export function MarkerButtonPopup(props: MarkerButtonPopupProps) {
  return (
  <div
          style={{
            position: 'absolute',
            transform: `translate(${props.left}px, ${props.top}px)`,
            backgroundColor: 'transparent',
            ...(props.style || {}),
          }}
          className={
            props.className
              ? `${props.className} pigeon-click-block`
              : 'pigeon-click-block'
          }
        >
          <CardButtonMap button={props.button} />
        </div>)

}

export function MarkerButtonIcon(props: MarkerButtonIconProps) {

  return (
    <div style={buttonColorStyle(props.cssColor)}>
    <div
      style={{
        position: 'absolute',
        transform: `translate(${props.left}px, ${props.top}px)`,
        ...(props.style || {}),
      }}
      className={
        props.className
          ? `${props.className} pigeon-click-block`
          : 'pigeon-click-block'
      }
    >
      <figure
        id="markerButton"
        onClick={props.onClick}
        className="marker-button marker-button-selector"
      >
        <div className="avatar-medium marker-button__image">
          <img
            src={props.image}
            alt={props.title}
            className="picture__img"
          />
        </div>

        <span className="marker-button__arrow"></span>

        <div className="marker-button__tags marker-button-selector-title"
        >
          <div className="marker-button__link-tag" >
            {props.title}
          </div>
        </div>
      </figure>
    </div></div>
  );
}
