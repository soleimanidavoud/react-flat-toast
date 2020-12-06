import React, { Component, useContext, useEffect } from "react";
import styles from "../styles/Toast.module.css";

const ToastContext = React.createContext();
const { Provider } = ToastContext;

export function generateUEID() {
  let first = (Math.random() * 46656) | 0;
  let second = (Math.random() * 46656) | 0;
  first = ("000" + first.toString(36)).slice(-3);
  second = ("000" + second.toString(36)).slice(-3);
  return first + second;
}

export class ToastProvider extends Component {
  state = { toasts: [] };

  onDismiss = (id) => () => {
    this.remove(id);
  };

  add = (message, variant) => {
    if (this.state.toasts.length < 5) {
      const id = generateUEID();
      this.setState((state) => {
        const newToast = { id, message, variant };
        const toasts = [...state.toasts, newToast];

        return { toasts };
      });
    }
  };

  remove = (id) => {
    this.setState((state) => {
      const toasts = state.toasts.filter((t) => t.id !== id);
      return { toasts };
    });
  };

  render() {
    const { children } = this.props;
    const { add, remove } = this;
    const toasts = Object.freeze(this.state.toasts);

    return (
      <Provider value={{ add, remove }}>
        {children}
        <div className={styles.toastContainer}>
          {toasts.map((ts) => (
            <Toast
              key={ts.id}
              onDismiss={this.onDismiss(ts.id)}
              message={ts.message}
            />
          ))}
        </div>
      </Provider>
    );
  }
}

function Timer(callback, delay) {
  let timerId;
  let start = delay;
  let remaining = delay;

  this.clear = function () {
    clearTimeout(timerId);
  };

  this.pause = function () {
    clearTimeout(timerId);
    remaining -= Date.now() - start;
  };

  this.resume = function () {
    start = Date.now();
    clearTimeout(timerId);
    timerId = setTimeout(callback, remaining);
  };

  this.resume();
}

const Toast = (props) => {
  const { message, onDismiss } = props;

  var timeout;

  useEffect(() => {
    startTimer();
    return () => {
      clearTimer();
    };
  }, []);

  const startTimer = () => {
    timeout = new Timer(onDismiss, 3000);
  };

  const clearTimer = () => {
    if (timeout) timeout.clear();
  };

  return <div className={styles.toast}>{message}</div>;
};

export const useToasts = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw Error(
      "The `useToasts` hook must be called from a descendent of the `ToastProvider`."
    );
  }

  return {
    addToast: ctx.add,
  };
};
