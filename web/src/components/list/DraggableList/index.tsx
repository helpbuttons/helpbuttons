import { useState, MouseEvent, TouchEvent, useEffect } from 'react';

interface DraggableProps {
  initialPos: { x: number; y: number };
  className?: string;
  style?: React.CSSProperties;
  onScroll:any,
  onFullScreen:any,
  onListOpen:any,
}

const DraggableList: React.FC<DraggableProps> = ({
  initialPos,
  children,
  className,
  onScroll,
  style,
  onFullScreen,
  onListOpen,
}) => {

  const [pos, setPos] = useState<{ x: number; y: number }>(initialPos || { x: 0, y: window.innerHeight - 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);

  const functionHandler = (data) => {
    // console.log(pos.y)
    if(pos.y < window.innerHeight - 360 ){
        onFullScreen(true);
    }
    if(pos.y >= window.innerHeight - 360){
        onFullScreen(false);
        // onListOpen(true);
    }
    if(pos.y < window.innerHeight - 150){
        // onFullScreen(false);
        onListOpen(true);
    }
    if(pos.y >= window.innerHeight - 150){
        onListOpen(false);
    }
  };

  const transitionToPosition = (targetY: number) => {
    const transitionInterval = setInterval(() => {
      const currentY = pos.y;
      const newY = currentY + (targetY - currentY) / 5; // Adjust divisor for transition speed

      setPos((prevPos) => ({ ...prevPos, y: newY }));

      if (Math.abs(newY - targetY) < 1) {
        clearInterval(transitionInterval);
        setDragging(false); // Ensure dragging is set to false after transition
      }
    }, 16); // Adjust interval for smoother transition
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const pos = { x: e.pageX - (e.currentTarget.offsetLeft || 0), y: e.pageY - (e.currentTarget.offsetTop || 0) };
    
    // Firefox requires setData to enable dragging
    if ((e.nativeEvent as any).dataTransfer) {
        (e.nativeEvent as any).dataTransfer.setData('application/json', JSON.stringify(pos));
        (e.nativeEvent as any).dataTransfer.effectAllowed = 'move';
      }

    setDragging(true);
    setRel(pos);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    startDragging(touch.pageX, touch.pageY);
    e.preventDefault();
  };

  const startDragging = (x: number, y: number) => {
    const Xpos = { x: x - (pos.x || 0), y: y - (pos.y || 0) };
    setDragging(true);
    setRel(Xpos);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!dragging || !rel || e.touches.length !== 1) return;
    const touch = e.touches[0];
    moveElement(touch.pageX, touch.pageY);
    e.preventDefault();
  };

  const moveElement = (x: number, y: number) => {
    const newPos = { x: x - rel.x, y: y - rel.y };
    if(newPos.y<68)
    newPos.y=68;

    if(newPos.y>window.innerHeight - 120)
    newPos.y=window.innerHeight - 120;

        // Apply smooth transition for pos.y when mouse is up or touch ends
    // if (!dragging && newPos.y < window.innerHeight - 360) {
    //     console.log("happening")
    //     newPos.y += (68 - newPos.y) / 5; // Adjust the divisor for speed of transition
    //     } else if (!dragging && (newPos.y < window.innerHeight - 50 || newPos.y > 60)) {
    //         console.log("happening")

    //     newPos.y += ((window.innerHeight - 358) - newPos.y) / 5; // Adjust the divisor for speed of transition
    //     }

    functionHandler(newPos.y);
    setPos(newPos);
  };

  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    // const newPos = { x: e.pageX - rel.x, y: e.pageY - rel.y };

 
    // const smoothTransition = () => {
    //     if (newPos.y < window.innerHeight - 360) {
    //     newPos.y += (68 - newPos.y) / 5; // Adjust the divisor for speed of transition
    //     } else if (newPos.y < window.innerHeight - 150 ) {
    //     newPos.y += ((window.innerHeight - 358) - newPos.y) / 5; // Adjust the divisor for speed of transition
    //     } else if (newPos.y > window.innerHeight - 150 ) {
    //         newPos.y += ((window.innerHeight - 50) - newPos.y) / 5; // Adjust the divisor for speed of transition
    //     }

    //     setPos(newPos);

    //     if (newPos.y != window.innerHeight - 358 || (newPos.y != window.innerHeight - 50 || newPos.y != 68)) {
    //     requestAnimationFrame(smoothTransition);
    //     } else {
    //     setDragging(false);
    //     }
    // };

    // smoothTransition();

    setDragging(false);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragging || !rel) return;
    const newPos = { x: e.pageX - rel.x, y: e.pageY - rel.y };
    let newPosY = e.pageY - rel.y;

    console.log(newPosY);

    if(newPosY<68)
    newPosY=68;

    newPos.y=newPosY;

    functionHandler(newPos.y);
    setPos(newPos);
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'absolute',
        // left: pos.x + 'px',
        top: pos.y + 'px',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onScroll={onScroll}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      draggable // Enable dragging for other browsers
    >
      {children}
    </div>
  );
};

export default DraggableList;