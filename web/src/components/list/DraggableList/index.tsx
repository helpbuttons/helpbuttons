import { useState, MouseEvent, TouchEvent, useEffect } from 'react';

interface DraggableProps {
  initialPos: { x: number; y: number };
  className?: string;
  style?: React.CSSProperties;
  onScroll:any,
  onFullScreen:any,
  isListOpen?: boolean; // New prop for isListOpen
  isListFullScreen?: boolean; // New prop for full screen
}

const DraggableList: React.FC<DraggableProps> = ({
  initialPos,
  children,
  className,
  onScroll,
  style,
  onFullScreen,
  isListOpen, // New prop for isListOpen
  isListFullScreen // New prop for isListOpen
}) => {

  const [pos, setPos] = useState<{ x: number; y: number }>(initialPos || { x: 0, y: window.innerHeight - 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);

  const functionHandler = (data) => {
    if(pos.y < window.innerHeight - 360 ){
        onFullScreen(true);
    }
    if(pos.y >= window.innerHeight - 360){
        onFullScreen(false);
    }
  };

  useEffect(() => {

    if (isListOpen) {
        console.log('isopen!!!')
        const targetY = window.innerHeight - 130; // Example target Y value

        setPos((prevPos) => ({ ...prevPos, y: targetY }));
        setDragging(true); // Optional: Set dragging to true if needed
      } else {
        const targetY = window.innerHeight - 360; // Example target Y value

        setPos((prevPos) => ({ ...prevPos, y: targetY }));
        setDragging(true); // Optional: Set dragging to true if needed
      }

    }, [isListOpen]);


    //MOUSE
  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const pos = { x: e.pageX - (e.currentTarget.offsetLeft || 0), y: e.pageY - (e.currentTarget.offsetTop || 0) };
    

    const targetTagName = (e.target as HTMLElement).tagName.toLowerCase();
    const allowedTags = ['input', 'textarea', 'select']; // Add more tag names if needed

    if (!allowedTags.includes(targetTagName)) {
        e.preventDefault();
    }

    // Firefox requires setData to enable dragging
    if ((e.nativeEvent as any).dataTransfer) {
        (e.nativeEvent as any).dataTransfer.setData('application/json', JSON.stringify(pos));
        (e.nativeEvent as any).dataTransfer.effectAllowed = 'move';
      }

    setDragging(true);
    setRel(pos);
    e.stopPropagation();
  };

  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {

    let newY = e.pageY - (pos.y || 0); // Calculate the new Y position

    if(isListOpen)
        {
            newY=window.innerHeight - 360;
            functionHandler(newY);
            setDragging(false);
            setPos((prevPos) => ({
              ...prevPos,
              y: newY,
            }));
        }
    if(pos.y < window.innerHeight - 360)
        {
            newY=68;
            functionHandler(newY);
            setDragging(false);
            setPos((prevPos) => ({
              ...prevPos,
              y: newY,
            }));
        }
    if(pos.y > window.innerHeight - 200)
        {
            newY= window.innerHeight - 120;
            functionHandler(newY);
            setDragging(false);
            setPos((prevPos) => ({
                ...prevPos,
                y: newY,
            }));
        }

    e.stopPropagation();
    e.preventDefault();
  };


  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragging || !rel) return;
    const newPos = { x: e.pageX - rel.x, y: e.pageY - rel.y };
    let newPosY = e.pageY - rel.y;

    // console.log(newPosY);

    if(newPosY<68)
    newPosY=68;

    newPos.y=newPosY;

    functionHandler(newPos.y);
    setPos(newPos);
    e.stopPropagation();
    e.preventDefault();
  };

  //TOUCH
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    startDragging(touch.pageX, touch.pageY);
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
  };

  const moveElement = (x: number, y: number) => {
    const newPos = { x: x - rel.x, y: y - rel.y };
    if(newPos.y<68)
    newPos.y=68;

    if(newPos.y>window.innerHeight - 120)
    newPos.y=window.innerHeight - 120;

    functionHandler(newPos.y);
    setPos(newPos);
  };

  
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0]; // Get the touch that ended
    let newY = touch.pageY - (pos.y || 0); // Calculate the new Y position

    if(pos.y < window.innerHeight - 360)
        {
            newY=68;
            functionHandler(newY);
            setDragging(false);
            setPos((prevPos) => ({
              ...prevPos,
              y: newY,
            }));
        }
    if(pos.y > window.innerHeight - 200)
        {
            newY= window.innerHeight - 120;
            functionHandler(newY);
            setDragging(false);
            setPos((prevPos) => ({
                ...prevPos,
                y: newY,
            }));
        }

    setDragging(false);
    setPos((prevPos) => ({
      ...prevPos,
      y: newY,
    }));
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