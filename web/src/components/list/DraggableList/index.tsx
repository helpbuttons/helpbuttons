import { useState, MouseEvent, TouchEvent, useEffect, useRef } from 'react';
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
  onDragPos?: (y: number, transitioning: boolean) => void;  // ← add this

}

const DraggableList: React.FC<DraggableProps> = ({
  children,
  className,
  onScroll,
  style,
  viewMode,
  onFullScreen,
  isListOpen,
  setListOpen,
  isListFullScreen,
  onDragPos,
}) => {
  // Set initial position using `initialPos` or default values
  const getFullScreenListHeight = () => 124;
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: getFullScreenListHeight() });

  const [dragging, setDragging] = useState<boolean>(false);
  const [rel, setRel] = useState<{ x: number; y: number } | null>(null);

  const getClosedListHeight = () => window.innerHeight - 110;
  const getOpenListHeight = () => window.innerHeight - 345;

  const [transitioning, setTransitioning] = useState<boolean>(false);

  // Tracks whether the current drag was started by the user (not programmatic)
  const isUserDragRef = useRef(false);
  // Captures pos.y at drag start for direction detection
  const dragStartPosRef = useRef<number>(0);

  const functionHandler = (data: number) => {
    if (data < getOpenListHeight()) {
      onFullScreen(true, true);
    } else {
      onFullScreen(true, false);
    }
  };

  useEffect(() => {
    let initialY = getFullScreenListHeight();
    if (viewMode === ExploreViewMode.MAP)  initialY = getClosedListHeight();
    if (viewMode === ExploreViewMode.BOTH) initialY = getOpenListHeight();
    snapTo(initialY);
  }, [viewMode]);

  useEffect(() => {
    setTransitioning(true);           // ← same here
    if (isListOpen && !isListFullScreen) {
      setPos((prev) => ({ ...prev, y: getOpenListHeight() }));
      setDragging(true);
    } else if (isListFullScreen) {
      setPos((prev) => ({ ...prev, y: 124 }));
      setDragging(true);
    } else {
      setPos((prev) => ({ ...prev, y: getClosedListHeight() }));
      setDragging(false);
    }
  }, [isListOpen, isListFullScreen]);;

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
      snapTo(getOpenListHeight());
      setDragging(true);
    } else if (isListFullScreen) {
      snapTo(getFullScreenListHeight());
      setDragging(true);
    } else {
      snapTo(getClosedListHeight());
      setDragging(false);
    }
  }, [isListOpen, isListFullScreen]);

  // Snap logic runs here after dragging stops so pos.y is the committed (fresh) value.
  useEffect(() => {
    if (!dragging && isUserDragRef.current) {
      isUserDragRef.current = false;
      const draggedDown = pos.y > dragStartPosRef.current;
      let newY: number;
      if (pos.y < getOpenListHeight()) {
        newY = getFullScreenListHeight();
      } else if (draggedDown || pos.y >= getClosedListHeight() - 50) {
        // Dragged toward bottom, or landed very close to/at the bottom → stay closed
        newY = getClosedListHeight();
      } else {
        newY = getOpenListHeight();
      }
      functionHandler(newY);
      snapTo(newY);
    }
  }, [dragging]);

  // MOUSE EVENTS
  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    startDragging(e.pageX, e.pageY);
    e.stopPropagation();
  };

  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    endDragging();
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
    endDragging();
  };

  // SHARED FUNCTIONS
  const startDragging = (x: number, y: number) => {
    setTransitioning(false);
    isUserDragRef.current = true;
    dragStartPosRef.current = pos.y;
    const Xpos = { x: x - (pos.x || 0), y: y - (pos.y || 0) };
    setDragging(true);
    setRel(Xpos);
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleDragPos = (y: number, transitioning: boolean) => {
    if (!bottomRef.current) return;
    // height of index__content-bottom = window height minus where the draggable top is
    const h = window.innerHeight - y;
    bottomRef.current.style.transition = transitioning
      ? 'height 0.35s cubic-bezier(0.32, 0.72, 0, 1)'
      : 'none';
    bottomRef.current.style.height = `${h}px`;
  };

  const moveElement = (x: number, y: number) => {
    const newPos = { x: x - rel.x, y: y - rel.y };
    if (newPos.y < getFullScreenListHeight()) newPos.y = getFullScreenListHeight();
    if (newPos.y > getClosedListHeight())     newPos.y = getClosedListHeight();
    functionHandler(newPos.y);
    setPos(newPos);
    onDragPos?.(newPos.y, false);   // ← live drag, no transition
  };

  const snapTo = (newY: number) => {
    setTransitioning(true);
    onDragPos?.(newY, true);        // ← snap, with transition
    requestAnimationFrame(() => {
      setPos((prev) => ({ ...prev, y: newY }));
    });
  };

  // endDragging only stops the drag; snap logic is in the useEffect above.
  const endDragging = () => {
    setDragging(false);
  };

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'absolute',
        top: `${pos.y}px`,
        touchAction: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
        transition: transitioning
          ? 'top 0.35s cubic-bezier(0.32, 0.72, 0, 1)'
          : 'none',
      }}
      onScroll={onScroll}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTransitionEnd={() => setTransitioning(false)}
      draggable
    >
      {children}
    </div>
  );
};

export default DraggableList;
