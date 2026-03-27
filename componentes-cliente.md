# Copia de componentes del cliente (`client/src`)

Fecha de generación: documento de referencia con el código fuente de la aplicación React del cliente.

---

## `client/src/index.js`

```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../style/index.css";

ReactDOM.render(<App />, document.getElementById("app"));
```

---

## `client/src/App.jsx`

```jsx
import React from "react";
import Homepage from "./pages/Homepage";
import Header from "./components/Header";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Header />
      <Homepage />
    </DndProvider>
  );
};

export default App;
```

---

## `client/src/pages/Homepage.jsx`

```jsx
import React, { useState } from "react";
import Item from "../components/Item";
import DropWrapper from "../components/DropWrapper";
import Col from "../components/Col";
import { data, statuses } from "../data";

const Homepage = (props) => {
  const [items, setItems] = useState(data);
  const onDrop = (item, monitor, status) => {
    const mapping = statuses.find((si) => si.status === status);

    setItems((prevState) => {
      const newItems = prevState
        .filter((i) => i.id !== item.id)
        .concat({ ...item, status, icon: mapping.icon });
      return [...newItems];
    });
  };
  const moveItem = (dragIndex, hoverIndex) => {
    const item = items[dragIndex];
    setItems((prevState) => {
      const newItems = prevState.filter((i, index) => idx !== dragIndex);
      newItems.splice(hoverIndex, 0, item);
      return [...newItems];
    });
  };

  return (
    <div className="row">
      {statuses.map((s) => {
        return (
          <div className="col-wrapper" key={s.status}>
            <h2 className="col-header">{s.status.toUpperCase()}</h2>
            <DropWrapper onDrop={onDrop} status={s.status}>
              <Col>
                {items
                  .filter((i) => i.status === s.status)
                  .map((i, idx) => (
                    <Item
                      key={i.id}
                      item={i}
                      index={idx}
                      moveItem={moveItem}
                      status={s}
                    />
                  ))}
              </Col>
            </DropWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default Homepage;
```

---

## `client/src/components/Col.jsx`

```jsx
import React from "react";

const Col = ({ isOver, children }) => {
  const className = isOver ? "highlight-region" : "";
  return <div className={`col${className}`}>{children}</div>;
};

export default Col;
```

---

## `client/src/components/DropWrapper.jsx`

```jsx
import React from "react";
import { useDrop } from "react-dnd";
import ITEM_TYPE from "../data/types";
import { statuses } from "../data";

const DropWrapper = ({ onDrop, children, status }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    canDrop: (item, monitor) => {
      const itemIndex = statuses.findIndex((si) => si.status === item.status);
      const statusIndex = statuses.findIndex((si) => si.status === status);
      return [itemIndex + 1, itemIndex - 1, itemIndex].includes(statusIndex);
    },
    drop: (item, monitor) => {
      onDrop(item, monitor, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <div ref={drop} className={"drop-wrapper"}>
      {React.cloneElement(children, { isOver })}
    </div>
  );
};

export default DropWrapper;
```

---

## `client/src/components/Header.jsx`

```jsx
import React from "react";

const Header = () => {
  return (
    <div>
      <div className="row">
        <p className="page-header">Trello Dashboard</p>
      </div>
    </div>
  );
};

export default Header;
```

---

## `client/src/components/Item.jsx`

```jsx
import React, { Fragment, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import Window from "./Window";
import ITEM_TYPE from "../data/types";
const Item = ({ item, index, moveItem, status }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoveredRect = ref.current.getBoundClientRect();
      const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
      const mousePosition = monitor.getClientOffset();
      const hoverClientY = mousePosition.y - hoveredRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ITEM_TYPE, ...item, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [show, setShow] = useState(false);

  const onOpen = () => setShow(true);
  const onClose = () => setShow(false);
  drag(drop(ref));
  return (
    <Fragment>
      <div
        ref={ref}
        style={{ opacity: isDragging ? 0 : 1 }}
        className={"item"}
        onClick={onOpen}
      >
        <div className="color-bar" style={{ backgroundColor: status.color }} />
        <p className="item-title">{item.content}</p>
        <p className="item-status">{item.icon}</p>
      </div>
      <Window item={item} onClose={onClose} show={show} />
    </Fragment>
  );
};

export default Item;
```

---

## `client/src/components/Window.jsx`

```jsx
import React from "react";
import Modal from "react-modal";
Modal.setAppElement("#app");

const Window = ({ show, onClose, item }) => {
  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      className={"modal"}
      overlayClassName={"overlay"}
    >
      <div className="close-btn-ctn">
        <h1 style={{ flex: "1 90%" }}>{item.title}</h1>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
      </div>
      <div>
        <h2>Description</h2>
        <p>{item.content}</p>
        <h2>Status</h2>
        <p>
          {item.icon}{" "}
          {`${item.status.charAt(0).toUpperCase()}${item.status.slice(1)}`}
        </p>
      </div>
    </Modal>
  );
};

export default Window;
```

---

## Nota

Los componentes anteriores importan datos y tipos desde `client/src/data/` (`index.js`, `types.js`); esos archivos no están incluidos en esta copia.
