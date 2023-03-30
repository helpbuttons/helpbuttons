import { PigeonProps } from 'pigeon-maps';
import React from 'react';
import { buttonTypes } from 'shared/buttonTypes';
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
  color: string;
  image: string;
  title: string;
  onClick?: any;
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

  const { color } = buttonTypes.find((buttonType) => {
    return buttonType.name === props.button.type;
  });
  const handleMarkerClicked = (buttonId) => {
    props.handleMarkerClicked(buttonId);
    console.log('clicked ' + buttonId);
  };

  return (
    <>
      <MarkerButtonIcon {...props}
      color={color}
      image={makeImageUrl(props.button.image, '/api/')}
      title={props.button.title}
      onClick={() => handleMarkerClicked(props.button.id)}
      />
      {props.currentButtonId == props.button.id && (
        <MarkerButtonPopup
          {...props}
          offset={[500,0]}
        />
      )}
    </>
  );
}

function MarkerButtonPopup(props: MarkerButtonPopupProps) {
  return (
  <div
          style={{
            position: 'absolute',
            transform: `translate(${props.left}px, ${props.top}px)`,
            backgroundColor: 'white',
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
        className={`marker-button marker-button-selector ${props.color}`}
      >
        <div className="avatar-medium marker-button__image">
          <img
            src={props.image}
            alt={props.title}
            className="picture__img"
          />
        </div>

        <span className="marker-button__arrow"></span>

        <div className={`marker-button__tags marker-button-selector-title ${props.color}`}>
          <div className="marker-button__link-tag">
            {props.title}
          </div>
        </div>
      </figure>
    </div>
  );
}
