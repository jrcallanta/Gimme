import { useEffect } from 'react';


/*** Custom Hooks *******************************/


// Custom Hook triggers callback when pressing 'enter'
//   while inside a focused text area
export const useOnPressEnterInFocused = (ref, callback) => {
  useEffect(() => {
    function handlePressEnter(event) {
      if (ref.current && ref.current.contains(event.target)) {
        if(event.key.toLowerCase() === "enter") {
          event.preventDefault();
          callback();
        }
      }
    }

    document.addEventListener("keydown", handlePressEnter);
    return () => {
      document.removeEventListener("keydown", handlePressEnter);
    };
  }, [ref]);
}

// Custom Hook triggers callback when clicking
//  outside of the ref passed
export const useOnClickOutside = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}


export const useOnClickOutsideOfFocused = (outsideOfThisRef, inFocusRef, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (inFocusRef.current === document.activeElement){
        if (outsideOfThisRef.current && !outsideOfThisRef.current.contains(event.target)) {
          callback();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [outsideOfThisRef, inFocusRef]);
}


export const useOnMouseLeave = (ref, callback) => {
  useEffect(()=>{
    function handleMouseLeave(event){
      if(event.target === ref.current)
        callback()
    }
    if(ref.current) ref.current.addEventListener('mouseleave', handleMouseLeave);
    return ()=>{ref.current.removeEventListener('mouseleave', handleMouseLeave)};
  }, [ref]);
}
