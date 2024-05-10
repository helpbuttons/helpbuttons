import { useState, MouseEvent, useEffect } from 'react';

interface DraggableProps {
  initialPos: { x: number; y: number };
  className?: string;
  style?: React.CSSProperties;
  onScroll:any,
  onStateChange:any,
}

const DraggableList: React.FC<DraggableProps> = ({
  initialPos,
  children,
  className,
  onScroll,
  style,
  onStateChange,
}) => {

  const [pos, setPos] = useState<{ x: number; y: number }>(initialPos || { x: 0, y: window.innerHeight - 100 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);


  const functionHandler = (data) => {
    console.log(pos.y)

    if(pos.y < window.innerHeight - 350 ){
        onStateChange(true);
    }
    if(pos.y >= window.innerHeight - 350){
        onStateChange(false);
    }

  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const pos = { x: e.pageX - (e.currentTarget.offsetLeft || 0), y: e.pageY - (e.currentTarget.offsetTop || 0) };
    setDragging(true);
    setRel(pos);
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    setDragging(false);
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragging || !rel) return;

    const newPos = { x: e.pageX - rel.x, y: e.pageY - rel.y };
    let newPosY = e.pageY - rel.y;

    if (newPosY < 200) {
        // Calculate the smooth transition for posY
        const distanceToBottom = window.innerHeight - newPosY;
        const easingFactor = Math.min(1, distanceToBottom / 100); // Adjust 300 as needed for smoother or faster transition
        newPosY = newPosY + easingFactor * (200 - newPosY);
      }

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
    >
      {children}
    </div>
  );
};

export default DraggableList;