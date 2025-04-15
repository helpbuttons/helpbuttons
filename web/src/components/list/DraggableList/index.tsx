import { useState, MouseEvent, TouchEvent, useEffect } from 'react';
import { ExploreViewMode } from 'state/Explore';

interface DraggableProps {
  initialPos?: { x: number; y: number }; // Default to optional
  className?: string;
  style?: React.CSSProperties;
  onScroll: any;
  viewMode: ExploreViewMode; // Added viewMode for dynamic handling
  onFullScreen: any;
  isListOpen?: boolean; // New prop for isListOpen
  setListOpen: any;
  isListFullScreen?: boolean; // New prop for full screen
}

const DraggableList: React.FC<DraggableProps> = ({
  initialPos = { x: 0, y: 68 }, // Default `y` to 68px
  children,
  className,
  onScroll,
  style,
  viewMode,
  onFullScreen,
  isListOpen,
  setListOpen,
  isListFullScreen,
}) => {
  // Set initial position using `initialPos` or default values
  const getFullScreenListHeight = () => 68;
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: getFullScreenListHeight() });

  const [dragging, setDragging] = useState<boolean>(false);
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);

  const getClosedListHeight = () => window.innerHeight - 110;
  const getOpenListHeight = () => window.innerHeight - 360;

  const functionHandler = (data: number) => {
    if (data < getOpenListHeight()) {
      onFullScreen(true, true);
    } else {
      onFullScreen(true, false);
    }
  };

  // Update position based on viewMode initially
  useEffect(() => {
    let initialY = 68; // Default to 68px for LIST mode
    if (viewMode === ExploreViewMode.MAP) {
      initialY = getClosedListHeight(); // Adjust for MAP mode
    } else if (viewMode === ExploreViewMode.BOTH) {
      initialY = getOpenListHeight(); // Adjust for BOTH mode
    
    } else if (viewMode === ExploreViewMode.LIST) {
      initialY = 68; // Adjust for BOTH mode
    }
    setPos({ x: 0, y: initialY });
  }, [viewMode]);

  // Handle resizing the window and adjusting position
  useEffect(() => {
    const handleResize = () => {
      setPos((prevPos) => {
        let newY = prevPos.y;
        if (prevPos.y < getOpenListHeight() - 100) {
          newY = getFullScreenListHeight();
        } else if (prevPos.y > window.innerHeight - 200) {
          newY = getClosedListHeight();
        } else {
          newY = getOpenListHeight();
        }
        return { ...prevPos, y: newY };
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle isListOpen changes
  useEffect(() => {
    if (pos.y === getClosedListHeight()) {
      setListOpen(() => false);
    }
  }, [pos]);

  useEffect(() => {
    if (isListOpen && !isListFullScreen) {
      const targetY = getOpenListHeight();
      setPos((prevPos) => ({ ...prevPos, y: targetY }));
      setDragging(true);
    }
    else if (isListFullScreen) {
      const targetY = 68;
      setPos((prevPos) => ({ ...prevPos, y: targetY }));
      setDragging(true);
    } else {
      const targetY = getClosedListHeight();
      setPos((prevPos) => ({ ...prevPos, y: targetY }));
      setDragging(false);
    }
  }, [isListOpen]);

  // MOUSE EVENTS
  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    startDragging(e.pageX, e.pageY);
    e.stopPropagation();
  };

  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    endDragging(e.pageY);
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragging || !rel) return;
    moveElement(e.pageX, e.pageY);
    e.stopPropagation();
    e.preventDefault();
  };

  // TOUCH EVENTS
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    startDragging(touch.pageX, touch.pageY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!dragging || !rel || e.touches.length !== 1) return;
    const touch = e.touches[0];
    moveElement(touch.pageX, touch.pageY);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    endDragging(touch.pageY);
  };

  // SHARED FUNCTIONS
  const startDragging = (x: number, y: number) => {
    const Xpos = { x: x - (pos.x || 0), y: y - (pos.y || 0) };
    setDragging(true);
    setRel(Xpos);
  };

  const moveElement = (x: number, y: number) => {
    const newPos = { x: x - rel.x, y: y - rel.y };
    if (newPos.y < getFullScreenListHeight()) newPos.y = getFullScreenListHeight();
    if (newPos.y > getClosedListHeight()) newPos.y = getClosedListHeight();
    functionHandler(newPos.y);
    setPos(newPos);
  };

  const endDragging = (y: number) => {
    let newY = y - (pos.y || 0);
    if (pos.y < getOpenListHeight()) {
      newY = getFullScreenListHeight();
    } else if (pos.y > window.innerHeight - 200) {
      newY = getClosedListHeight();
    } else if (pos.y > getClosedListHeight()) {
      newY = getClosedListHeight();
    } else {
      newY = getOpenListHeight();
    }
    functionHandler(newY);
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
        top: pos.y + 'px',
        touchAction: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onScroll={onScroll}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      draggable
    >
      {children}
    </div>
  );
};

export default DraggableList;