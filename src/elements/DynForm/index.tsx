import React, {useState} from "react";

const DynamicForm = (props) => {

  const [state, setState] = useState(props.defaultValues ?? {})

  const onSubmit = e => {
    e.preventDefault();
    if (props.onSubmit) props.onSubmit(state);
  };

  const onChange = (e, key, type = "single") => {
    //console.log(`${key} changed ${e.target.value} type ${type}`);
    if (type === "single") {
      setState((prevState) =>
        ({
          ...prevState,
          [key]: e.target.value
        })
      );
    } else {
      // Array of values (e.g. checkbox): TODO: Optimization needed.
      const found = state[key]
        ? state[key].find(d => d === e.target.value)
        : false;

      if (found) {
        const data = state[key].filter(d => {
          return d !== found;
        });
        setState((prevState) => ({
          ...prevState,
          [key]: data
        }));
      } else {
        console.log("found", key, state[key]);
        // this.setState({
        //   [key]: [e.target.value, ...this.state[key]]
        // });
        const others = state[key] ? [...state[key]] : [];
        setState(prevState => ({
          ...prevState,
          [key]: [e.target.value, ...others]
        }));
      }
    }
  };

  const renderForm = () => {
    const model = props.model;

    return model.map(m => {
      const key = m.key;
      const type = m.type || "text";
      const modelProps = m.props || {};
      const name = m.name;

      const target = key;
      const value = state[target] || "";

      let input = (
        <input
          {...modelProps}
          className="form__input"
          type={type}
          key={key}
          name={name}
          value={value}
          onChange={e => {
            onChange(e, target);
          }}
        />
      );

      if (type == "radio") {
        input = m.options.map(o => {
          const checked = o.value == value;
          return (
            <React.Fragment key={"fr" + o.key}>
              <input
                {...modelProps}
                className="form__input"
                type={type}
                key={o.key}
                name={o.name}
                checked={checked}
                value={o.value}
                onChange={e => {
                  onChange(e, o.name);
                }}
              />
              <label key={"ll" + o.key}>{o.label}</label>
            </React.Fragment>
          );
        });
        input = <div className="form-group-radio">{input}</div>;
      }

      if (type == "select") {
        const options = m.options.map(o => {
          //console.log("select: ", o.value, value);
          return (
            <option
              {...modelProps}
              className="form-input"
              key={o.key}
              value={o.value}
            >
              {o.value}
            </option>
          );
        });

        //console.log("Select default: ", value);
        input = (
          <select
            value={value}
            onChange={e => {
              onChange(e, m.key);
            }}
          >
            {options}
          </select>
        );
      }

      if (type == "checkbox") {
        const options = m.options.map(o => {
          //let checked = o.value == value;
          let checked = false;
          if (value && value.length > 0) {
            checked = value.indexOf(o.value) > -1 ? true : false;
          }
          //console.log("Checkbox: ", checked);
          return (
            <React.Fragment key={"cfr" + o.key}>
              <input
                {...modelProps}
                className="checkbox"
                type={type}
                key={o.key}
                name={o.name}
                checked={checked}
                value={o.value}
                onChange={e => {
                  onChange(e, m.key, "multiple");
                }}
              />
              <label key={"ll" + o.key}>{o.label}</label>
            </React.Fragment>
          );
        });

        input = <div className="form-group-checkbox">{options}</div>;
      }

      return (
        <div key={"g" + key} className="form-group">
          <label className="form__label" key={"l" + key} htmlFor={key}>
            {m.label}
          </label>
          {input}
        </div>
      );
    });
  };

    const title = props.title || "Dynamic Form";

    return (
        <div className={props.className}>
        <h3 className="form-title">{title}</h3>
        <form
            className="dynamic-form"
            onSubmit={e => {
            onSubmit(e);
            }}
        >
            {renderForm()}
            <div className="form-actions">
            <button type="submit" className="btn">submit</button>
            </div>
        </form>
        </div>
    );
}

const model = [
    {
        key: "test",
        type: "text",
        name: "test",
        value: "prueba"
    },
    {
        key: "checkbox",
        type: "checkbox",
        name: "checkbox",
        options: [
            {"key": "option1", "name": "Option1", "value": "Option 1", "label": "Option 1"},
            {"key": "option2", "name": "Option2", "value": "Option 2", "label": "Option 2"}
        ]
    },
    {
        key: "radio",
        type: "radio",
        name: "radio",
        options: [
            {"key": "option1", "name": "radio", "value": "Option 1", "label": "Option 1"},
            {"key": "option2", "name": "radio", "value": "Option 2", "label": "Option 2"}
        ]
    },
    {
        key: "select",
        type: "select",
        name: "select",
        options: [
            {"key": "option1", "name": "Option1", "value": "Option 1", "label": "Option 1"},
            {"key": "option2", "name": "Option2", "value": "Option 2", "label": "Option 2"}
        ]
    },

]

function DynForm() {
  return (
    <div className="App">
      <header className="App-header">
        <DynamicForm title="My form" model={model} onSubmit={(state) => alert(JSON.stringify(state))}
                     defaultValues={{test: "default test string"}} />
      </header>
    </div>
  );
}

export default DynForm;
